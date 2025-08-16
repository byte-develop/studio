#!/bin/bash

# Быстрый installer для HNS Studio на Ubuntu сервере
# Скопируйте этот скрипт на ваш сервер и запустите

cat << 'SCRIPT_CONTENT' > /tmp/deploy_hns.sh
#!/bin/bash

# Автоматический скрипт развертывания HNS проекта на Ubuntu сервере
# Использование: ./deploy_hns.sh [домен] [database_password] [telegram_bot_token] [telegram_chat_id]

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Проверка аргументов
if [ $# -lt 2 ]; then
    echo -e "${RED}Ошибка: Недостаточно аргументов${NC}"
    echo "Использование: $0 [домен] [database_password] [telegram_bot_token] [telegram_chat_id]"
    echo "Пример: $0 hns.dev mySecurePass123 your_bot_token your_chat_id"
    exit 1
fi

DOMAIN=$1
DB_PASSWORD=$2
TELEGRAM_BOT_TOKEN=${3:-""}
TELEGRAM_CHAT_ID=${4:-""}
PROJECT_DIR="/var/www/hns-studio"
DB_NAME="hns_studio"
DB_USER="hns_user"

echo -e "${BLUE}🚀 Начинаем развертывание HNS Studio на домене: $DOMAIN${NC}"

# Обновление системы
echo -e "${YELLOW}📦 Обновление системы...${NC}"
apt update && apt upgrade -y

# Установка необходимых пакетов
echo -e "${YELLOW}📦 Установка пакетов...${NC}"
apt install -y curl git nginx postgresql postgresql-contrib ufw fail2ban certbot python3-certbot-nginx

# Установка Node.js 20
echo -e "${YELLOW}📦 Установка Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Установка PM2 глобально
npm install -g pm2

# Создание пользователя для приложения
echo -e "${YELLOW}👤 Создание пользователя приложения...${NC}"
useradd -m -s /bin/bash hns || echo "Пользователь hns уже существует"
usermod -aG sudo hns

# Настройка PostgreSQL
echo -e "${YELLOW}🗄️ Настройка PostgreSQL...${NC}"
systemctl start postgresql
systemctl enable postgresql

# Создание базы данных и пользователя
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" || echo "Пользователь уже существует"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" || echo "База данных уже существует"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Подготовка директории проекта
echo -e "${YELLOW}📁 Подготовка директории проекта...${NC}"
mkdir -p $PROJECT_DIR
chown hns:hns $PROJECT_DIR

# Создание .env файла
echo -e "${YELLOW}⚙️ Создание .env файла...${NC}"
tee $PROJECT_DIR/.env > /dev/null <<EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID=$TELEGRAM_CHAT_ID
EOF

chown hns:hns $PROJECT_DIR/.env

# Создание Nginx конфигурации
echo -e "${YELLOW}🌐 Настройка Nginx...${NC}"
tee /etc/nginx/sites-available/$DOMAIN > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Статические файлы
    location /assets/ {
        alias $PROJECT_DIR/dist/client/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /attached_assets/ {
        alias $PROJECT_DIR/attached_assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# Активация сайта в Nginx
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Проверка конфигурации Nginx
nginx -t

# Настройка файрвола
echo -e "${YELLOW}🔥 Настройка файрвола...${NC}"
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'

# Перезапуск Nginx
systemctl restart nginx
systemctl enable nginx

# Создание PM2 конфигурации
echo -e "${YELLOW}⚙️ Создание PM2 конфигурации...${NC}"
sudo -u hns tee $PROJECT_DIR/ecosystem.config.js > /dev/null <<EOF
module.exports = {
  apps: [{
    name: 'hns-studio',
    script: 'server/index.ts',
    interpreter: 'npx',
    interpreter_args: 'tsx',
    cwd: '$PROJECT_DIR',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Создание директории для логов
sudo -u hns mkdir -p $PROJECT_DIR/logs

# Создание скрипта для обновления проекта
tee $PROJECT_DIR/update.sh > /dev/null <<'EOFUPDATE'
#!/bin/bash
cd /var/www/hns-studio

echo "🔄 Обновление проекта..."

# Остановка приложения
pm2 stop hns-studio || echo "Приложение не запущено"

# Установка зависимостей
npm ci

# Сборка проекта
npm run build

# Миграция базы данных
npm run db:push || echo "Миграции не требуются"

# Запуск приложения
pm2 start ecosystem.config.js
pm2 save

echo "✅ Обновление завершено!"
EOFUPDATE

chmod +x $PROJECT_DIR/update.sh
chown hns:hns $PROJECT_DIR/update.sh

# Настройка автообновления сертификатов
systemctl enable certbot.timer

# Настройка fail2ban
systemctl enable fail2ban
systemctl start fail2ban

echo -e "${GREEN}✅ Базовая настройка сервера завершена!${NC}"
echo -e "${BLUE}📋 Что дальше:${NC}"
echo "1. Скопируйте файлы проекта в $PROJECT_DIR"
echo "2. Запустите: cd $PROJECT_DIR && sudo -u hns ./update.sh"
echo "3. Получите SSL: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "4. Проверьте сайт: http://$DOMAIN (потом https://$DOMAIN)"
echo ""
echo -e "${YELLOW}🔧 Полезные команды:${NC}"
echo "• Статус приложения: pm2 status"
echo "• Логи: pm2 logs hns-studio"
echo "• Перезапуск: pm2 restart hns-studio"
echo "• Статус Nginx: systemctl status nginx"
echo "• Статус PostgreSQL: systemctl status postgresql"
SCRIPT_CONTENT

chmod +x /tmp/deploy_hns.sh
echo "Скрипт создан в /tmp/deploy_hns.sh"
echo ""
echo "Для запуска используйте:"
echo "sudo /tmp/deploy_hns.sh ваш_домен пароль_бд [telegram_token] [telegram_chat_id]"
echo ""
echo "Пример:"
echo "sudo /tmp/deploy_hns.sh hns.dev MySecurePass123 your_bot_token your_chat_id"