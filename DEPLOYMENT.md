# Инструкция по развертыванию HNS на Ubuntu сервере

## Требования к серверу

- Ubuntu 20.04 LTS или выше (рекомендуется Ubuntu 22.04 LTS)
- Минимум 2GB RAM, 20GB диск
- Доступ root или sudo
- Домен hns-studio.space настроен на IP сервера
- Node.js 20.x LTS или новее (будет установлено по инструкции)

## 1. Подготовка сервера

### Обновление системы и установка базовых пакетов
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential
```

### Установка Node.js (последняя LTS версия)
```bash
# Устанавливаем Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Перезагружаем профиль или перелогиниваемся
source ~/.bashrc

# Устанавливаем последнюю LTS версию Node.js
nvm install --lts
nvm use --lts
nvm alias default lts/*

# Проверяем установку
node --version  # Должна быть версия 20.x или новее
npm --version   # Проверка npm

# Обновляем npm до последней версии
npm install -g npm@latest
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
```

**Способ 1: SSH ключ (рекомендуется для приватных репозиториев)**

```bash
# Генерируем SSH ключ на сервере
ssh-keygen -t ed25519 -C "your-email@example.com"
# Нажмите Enter для всех вопросов (использует стандартные настройки)

# Показываем публичный ключ для добавления в GitHub
cat ~/.ssh/id_ed25519.pub
```

1. Скопируйте вывод команды выше
2. Идите в GitHub → Settings → SSH and GPG keys → New SSH key
3. Вставьте скопированный ключ и сохраните
4. Затем клонируйте репозиторий:

```bash
git clone git@github.com:byte-develop/studio.git .
```

**Способ 2: Personal Access Token (альтернатива)**

```bash
# Клонирование через HTTPS с токеном
git clone https://your-username:your-personal-token@github.com/byte-develop/studio.git .
```

Для создания токена: GitHub → Settings → Developer settings → Personal access tokens

**Способ 3: Загрузка файлов вручную (если нет доступа к Git)**

```bash
# Скачать zip архив и распаковать
wget https://github.com/byte-develop/studio/archive/main.zip
unzip main.zip
mv studio-main/* .
rm -rf studio-main main.zip
```

**Способ 4: Загрузка с локального компьютера через SCP**

С локального компьютера:
```bash
# Сжимаем проект (исключая node_modules и .git)
tar --exclude='node_modules' --exclude='.git' -czf hns-studio.tar.gz /path/to/your/local/project

# Загружаем на сервер
scp hns-studio.tar.gz root@your-server-ip:/var/www/hns-studio/

# На сервере распаковываем
cd /var/www/hns-studio
tar -xzf hns-studio.tar.gz --strip-components=1
rm hns-studio.tar.gz
```

### Установка зависимостей
```bash
npm install
```

### Сборка проекта
```bash
npm run build

# Проверьте, что сборка прошла успешно
ls -la dist/
ls -la dist/server/

# Если папка dist не создалась, проверьте package.json на наличие build скрипта
cat package.json | grep -A5 -B5 "scripts"
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

**Важно:** Проект использует ES modules, поэтому создаем конфигурацию с расширением .cjs:

```bash
nano /var/www/hns-studio/ecosystem.config.cjs
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

**Альтернативно, можно использать JSON формат:**
```bash
nano /var/www/hns-studio/ecosystem.config.json
```

```json
{
  "apps": [{
    "name": "hns-studio",
    "script": "./server/index.ts",
    "interpreter": "node",
    "interpreter_args": "--loader tsx",
    "instances": 1,
    "autorestart": true,
    "watch": false,
    "max_memory_restart": "1G",
    "env": {
      "NODE_ENV": "production",
      "PORT": 5000
    },
    "error_file": "./logs/err.log",
    "out_file": "./logs/out.log",
    "log_file": "./logs/combined.log",
    "time": true
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

# Если используете .cjs файл:
pm2 start ecosystem.config.cjs

# Или если используете .json файл:
pm2 start ecosystem.config.json

# Сохраняем конфигурацию и настраиваем автозапуск
pm2 save
pm2 startup  # Следуйте инструкциям для автозапуска

# Проверяем статус
pm2 status
pm2 logs hns-studio
```

**Диагностика проблем запуска:**

```bash
# Установите tsx глобально
npm install -g tsx

# Проверьте, может ли приложение запуститься вручную
cd /var/www/hns-studio
NODE_ENV=production PORT=5000 npx tsx server/index.ts

# Если есть ошибки, исправьте их перед запуском PM2
# Затем запустите PM2
pm2 start ecosystem.config.cjs

# Мониторинг запуска
pm2 logs hns-studio --lines 50
```

**Альтернативный способ запуска (без tsx):**
```bash
# Соберите проект
npm run build

# Запустите скомпилированный JavaScript
pm2 start ecosystem.config.simple.cjs
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

### Проблемы с PM2 и ES modules
```bash
# Ошибка "module is not defined" - переименуйте конфигурацию:
mv ecosystem.config.js ecosystem.config.cjs

# Или создайте JSON версию вместо JS
```

### Проблемы с tsx интерпретатором
```bash
# Установите tsx глобально
npm install -g tsx

# Или измените конфигурацию на использование обычного node:
# В ecosystem.config - уберите tsx и используйте обычный JS
```

### Проблемы с правами доступа
```bash
sudo chown -R $USER:$USER /var/www/hns-studio
```

### Проблемы с базой данных
```bash
sudo systemctl status postgresql
sudo -u postgres psql -l  # Список баз данных
```

### Ошибка 502 Bad Gateway - Node.js приложение не отвечает
```bash
# Проверьте статус PM2
pm2 status

# Проверьте логи приложения
pm2 logs hns-studio

# Проверьте, запущен ли процесс на порту 5000
sudo netstat -tulpn | grep :5000
sudo lsof -i :5000

# Если приложение не запущено, перезапустите его
pm2 restart hns-studio

# Если все еще не работает, остановите и запустите заново
pm2 stop hns-studio
pm2 delete hns-studio
pm2 start ecosystem.config.cjs

# Проверьте логи Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Если проблема с tsx loader
```bash
# Сначала соберите проект в обычный JavaScript
npm run build

# Создайте упрощенную PM2 конфигурацию без tsx
nano ecosystem.config.simple.cjs
```

Содержимое упрощенной конфигурации:
```javascript
module.exports = {
  apps: [{
    name: 'hns-studio',
    script: './dist/server/index.js',  // Используем скомпилированный JS
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

```bash
# Запустите с упрощенной конфигурацией
pm2 start ecosystem.config.simple.cjs
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

### Полная пересборка при проблемах
```bash
cd /var/www/hns-studio
npm clean-install  # Чистая установка зависимостей
npm run build       # Пересборка
pm2 restart hns-studio
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