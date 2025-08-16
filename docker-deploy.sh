#!/bin/bash

# Docker развертывание HNS Studio
# Использование: ./docker-deploy.sh [домен] [database_password] [telegram_bot_token] [telegram_chat_id]

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

echo -e "${BLUE}🐳 Начинаем Docker развертывание HNS Studio на домене: $DOMAIN${NC}"

# Проверка установки Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}📦 Установка Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Проверка установки Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}📦 Установка Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Создание .env файла для Docker
echo -e "${YELLOW}⚙️ Создание .env файла...${NC}"
cat > .env <<EOF
DOMAIN=$DOMAIN
DB_PASSWORD=$DB_PASSWORD
TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID=$TELEGRAM_CHAT_ID
EOF

# Создание Nginx конфигурации
echo -e "${YELLOW}🌐 Создание Nginx конфигурации...${NC}"
mkdir -p ssl
cat > nginx.conf <<EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Логирование
    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status \$body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Основные настройки
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Upstream для приложения
    upstream app {
        server app:3000;
    }

    # HTTP сервер (редирект на HTTPS)
    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN;
        
        # Let's Encrypt challenge
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        # Редирект на HTTPS
        location / {
            return 301 https://\$server_name\$request_uri;
        }
    }

    # HTTPS сервер
    server {
        listen 443 ssl http2;
        server_name $DOMAIN www.$DOMAIN;

        # SSL настройки
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # Статические файлы
        location /attached_assets/ {
            alias /var/www/attached_assets/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API и основное приложение
        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
        }
    }
}
EOF

# Запуск контейнеров
echo -e "${YELLOW}🚀 Запуск Docker контейнеров...${NC}"
docker-compose up -d --build

# Ожидание запуска сервисов
echo -e "${YELLOW}⏳ Ожидание запуска сервисов...${NC}"
sleep 30

# Получение SSL сертификата
echo -e "${YELLOW}🔒 Получение SSL сертификата...${NC}"
docker run --rm -it \
  -v "$PWD/ssl:/etc/letsencrypt" \
  -v "$PWD/certbot-www:/var/www/certbot" \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d $DOMAIN \
  -d www.$DOMAIN \
  --email admin@$DOMAIN \
  --agree-tos \
  --non-interactive || echo "Ошибка получения SSL сертификата"

# Перезапуск Nginx после получения сертификата
docker-compose restart nginx

echo -e "${GREEN}✅ Docker развертывание завершено!${NC}"
echo -e "${BLUE}📋 Что дальше:${NC}"
echo "1. Проверьте сайт: https://$DOMAIN"
echo "2. Мониторинг: docker-compose logs -f"
echo "3. Обновление: docker-compose pull && docker-compose up -d --build"
echo ""
echo -e "${YELLOW}🔧 Полезные команды:${NC}"
echo "• Статус контейнеров: docker-compose ps"
echo "• Логи приложения: docker-compose logs app"
echo "• Логи базы данных: docker-compose logs db"
echo "• Перезапуск: docker-compose restart"
echo "• Остановка: docker-compose down"