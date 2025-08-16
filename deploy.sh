#!/bin/bash

# Автоматический скрипт развертывания HNS проекта на Ubuntu сервере
# Использование: ./deploy.sh [домен] [database_password] [telegram_bot_token] [telegram_chat_id]

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
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
echo -e "${YELLOW}📦 Установка пакетов...${NC}"
sudo apt install -y curl git nginx postgresql postgresql-contrib ufw fail2ban certbot python3-certbot-nginx

# Установка Node.js 20
echo -e "${YELLOW}📦 Установка Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Установка PM2 глобально
sudo npm install -g pm2

# Создание пользователя для приложения
echo -e "${YELLOW}👤 Создание пользователя приложения...${NC}"
sudo useradd -m -s /bin/bash hns || echo "Пользователь hns уже существует"
sudo usermod -aG sudo hns

# Настройка PostgreSQL
echo -e "${YELLOW}🗄️ Настройка PostgreSQL...${NC}"
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Создание базы данных и пользователя
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" || echo "Пользователь уже существует"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" || echo "База данных уже существует"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Клонирование проекта (предполагается, что проект уже в git репозитории)
echo -e "${YELLOW}📥 Подготовка проекта...${NC}"
sudo mkdir -p $PROJECT_DIR
sudo chown hns:hns $PROJECT_DIR

# Если проект еще не склонирован, копируем файлы
if [ ! -d "$PROJECT_DIR/.git" ]; then
    echo -e "${BLUE}Скопируйте файлы проекта в $PROJECT_DIR${NC}"
    echo -e "${BLUE}Или настройте git репозиторий для автоматического развертывания${NC}"
fi

# Создание .env файла
echo -e "${YELLOW}⚙️ Создание .env файла...${NC}"
sudo tee $PROJECT_DIR/.env > /dev/null <<EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID=$TELEGRAM_CHAT_ID
EOF

sudo chown hns:hns $PROJECT_DIR/.env

# Создание Nginx конфигурации
echo -e "${YELLOW}🌐 Настройка Nginx...${NC}"
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Redirect all HTTP requests to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL configuration (будет настроено certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Static files
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

    # API routes
    location /api/ {
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

    # Main application
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

    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
EOF

# Активация сайта в Nginx
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Проверка конфигурации Nginx
sudo nginx -t

# Настройка файрвола
echo -e "${YELLOW}🔥 Настройка файрвола...${NC}"
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 5432  # PostgreSQL (только для локальных подключений)

# Перезапуск Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Создание PM2 конфигурации
echo -e "${YELLOW}⚙️ Создание PM2 конфигурации...${NC}"
sudo -u hns tee $PROJECT_DIR/ecosystem.config.js > /dev/null <<EOF
module.exports = {
  apps: [{
    name: 'hns-studio',
    script: 'dist/index.js',
    cwd: '$PROJECT_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
EOF

# Создание директории для логов
sudo -u hns mkdir -p $PROJECT_DIR/logs

# Создание скрипта для сборки и деплоя
echo -e "${YELLOW}📝 Создание скрипта деплоя...${NC}"
sudo tee $PROJECT_DIR/update.sh > /dev/null <<EOF
#!/bin/bash
cd $PROJECT_DIR

echo "🔄 Обновление проекта..."

# Остановка приложения
pm2 stop hns-studio || echo "Приложение не запущено"

# Установка зависимостей
npm ci --production=false

# Сборка проекта
npm run build

# Миграция базы данных
npm run db:push

# Запуск приложения
pm2 start ecosystem.config.js
pm2 save

echo "✅ Обновление завершено!"
EOF

sudo chmod +x $PROJECT_DIR/update.sh
sudo chown hns:hns $PROJECT_DIR/update.sh

# Получение SSL сертификата
echo -e "${YELLOW}🔒 Получение SSL сертификата...${NC}"
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || echo "Ошибка получения SSL. Запустите вручную: sudo certbot --nginx -d $DOMAIN"

# Настройка автообновления сертификатов
sudo systemctl enable certbot.timer

# Настройка fail2ban
echo -e "${YELLOW}🛡️ Настройка fail2ban...${NC}"
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Настройка логротации
sudo tee /etc/logrotate.d/hns-studio > /dev/null <<EOF
$PROJECT_DIR/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 644 hns hns
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

echo -e "${GREEN}✅ Развертывание завершено!${NC}"
echo -e "${BLUE}📋 Что дальше:${NC}"
echo "1. Скопируйте файлы проекта в $PROJECT_DIR"
echo "2. Запустите: sudo -u hns $PROJECT_DIR/update.sh"
echo "3. Проверьте сайт: https://$DOMAIN"
echo ""
echo -e "${YELLOW}🔧 Полезные команды:${NC}"
echo "• Статус приложения: pm2 status"
echo "• Логи: pm2 logs hns-studio"
echo "• Перезапуск: pm2 restart hns-studio"
echo "• Обновление: sudo -u hns $PROJECT_DIR/update.sh"
echo "• Статус Nginx: sudo systemctl status nginx"
echo "• Статус PostgreSQL: sudo systemctl status postgresql"