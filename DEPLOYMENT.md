# Инструкция по развертыванию HNS на Ubuntu сервере

## Требования к серверу

- Ubuntu 20.04 LTS или выше
- Минимум 2GB RAM, 20GB диск
- Доступ root или sudo
- Домен hns-studio.space настроен на IP сервера

## 1. Подготовка сервера

### Обновление системы
```bash
sudo apt update && sudo apt upgrade -y
```

### Установка Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Проверка версии
npm --version   # Проверка npm
```

### Установка PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Создание базы данных и пользователя
sudo -u postgres psql
```

В PostgreSQL консоли:
```sql
CREATE DATABASE hns_production;
CREATE USER hns_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE hns_production TO hns_user;
ALTER USER hns_user CREATEDB;
\q
```

### Установка Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Установка PM2 (для управления процессами)
```bash
sudo npm install -g pm2
```

### Установка Certbot для SSL
```bash
sudo apt install certbot python3-certbot-nginx -y
```

## 2. Развертывание приложения

### Клонирование проекта
```bash
cd /var/www
sudo mkdir hns-studio
sudo chown $USER:$USER hns-studio
cd hns-studio

# Загрузка проекта (замените на ваш способ)
git clone <your-repo-url> .
# или загрузите файлы через scp/rsync
```

### Установка зависимостей
```bash
npm install
```

### Сборка проекта
```bash
npm run build
```

### Настройка переменных окружения
```bash
sudo nano /var/www/hns-studio/.env.production
```

Содержимое .env.production:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://hns_user:your_secure_password@localhost:5432/hns_production

# Telegram Bot настройки (опционально)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Безопасность
SESSION_SECRET=generate_random_32_char_string_here
```

### Генерация безопасного ключа сессии
```bash
openssl rand -base64 32
# Вставьте результат в SESSION_SECRET
```

## 3. Настройка Nginx

### Создание конфигурации сайта
```bash
sudo nano /etc/nginx/sites-available/hns-studio.space
```

Содержимое конфигурации:
```nginx
server {
    listen 80;
    server_name hns-studio.space www.hns-studio.space;
    
    # Временно для получения SSL сертификата
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Статические файлы
    location /assets/ {
        alias /var/www/hns-studio/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

### Активация сайта
```bash
sudo ln -s /etc/nginx/sites-available/hns-studio.space /etc/nginx/sites-enabled/
sudo nginx -t  # Проверка конфигурации
sudo systemctl reload nginx
```

## 4. Настройка PM2

### Создание конфигурации PM2
```bash
nano /var/www/hns-studio/ecosystem.config.js
```

Содержимое файла:
```javascript
module.exports = {
  apps: [{
    name: 'hns-studio',
    script: './server/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

### Создание директории для логов
```bash
mkdir /var/www/hns-studio/logs
```

### Запуск приложения
```bash
cd /var/www/hns-studio
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Следуйте инструкциям для автозапуска
```

## 5. Настройка SSL сертификата

```bash
sudo certbot --nginx -d hns-studio.space -d www.hns-studio.space
```

Certbot автоматически обновит конфигурацию Nginx для HTTPS.

### Настройка автообновления сертификатов
```bash
sudo crontab -e
```

Добавьте строку:
```
0 3 * * * /usr/bin/certbot renew --quiet
```

## 6. Настройка базы данных

### Запуск миграций (если есть)
```bash
cd /var/www/hns-studio
npm run db:migrate  # или команда для запуска миграций
```

### Наполнение базы начальными данными
```bash
npm run db:seed  # если есть seed скрипты
```

## 7. Настройка файрвола

```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw status
```

## 8. Мониторинг и обслуживание

### Команды PM2 для управления
```bash
pm2 status          # Статус процессов
pm2 restart hns-studio  # Перезапуск
pm2 stop hns-studio     # Остановка
pm2 logs hns-studio     # Просмотр логов
pm2 monit           # Мониторинг в реальном времени
```

### Обновление приложения
```bash
cd /var/www/hns-studio
git pull            # или загрузите новые файлы
npm install         # Обновление зависимостей
npm run build       # Пересборка
pm2 restart hns-studio  # Перезапуск
```

### Бэкап базы данных
```bash
# Создание бэкапа
sudo -u postgres pg_dump hns_production > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из бэкапа
sudo -u postgres psql hns_production < backup_file.sql
```

## 9. Проверка работы

1. Откройте https://hns-studio.space в браузере
2. Проверьте все разделы сайта
3. Проверьте работу контактной формы
4. Проверьте админ-панель на https://hns-studio.space/admin

## 10. Telegram бот (опционально)

Если нужно настроить Telegram уведомления:

1. Создайте бота через @BotFather
2. Получите токен бота
3. Добавьте бота в группу или получите chat_id
4. Обновите переменные TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env.production
5. Перезапустите приложение: `pm2 restart hns-studio`

## Решение проблем

### Проблемы с правами доступа
```bash
sudo chown -R $USER:$USER /var/www/hns-studio
```

### Проблемы с базой данных
```bash
sudo systemctl status postgresql
sudo -u postgres psql -l  # Список баз данных
```

### Проверка логов
```bash
pm2 logs hns-studio
sudo tail -f /var/log/nginx/error.log
```

### Проблемы с портами
```bash
sudo netstat -tulpn | grep :5000
sudo lsof -i :5000
```

## Безопасность

1. Регулярно обновляйте систему: `sudo apt update && sudo apt upgrade`
2. Используйте сильные пароли для базы данных
3. Настройте регулярные бэкапы
4. Мониторьте логи на подозрительную активность
5. Рассмотрите установку fail2ban для защиты от брутфорса

---

**Контакты для поддержки:**
- Email: info@hns.dev
- Сайт: https://hns-studio.space

После развертывания сайт будет доступен по адресу https://hns-studio.space