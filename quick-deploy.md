# 🚀 Быстрое развертывание HNS Studio на Ubuntu

## Автоматический деплой за 5 минут

### 1. Подготовка сервера

```bash
# Скачайте скрипт развертывания
curl -o deploy.sh https://raw.githubusercontent.com/your-repo/hns-studio/main/deploy.sh
chmod +x deploy.sh

# Запустите автоматическое развертывание
sudo ./deploy.sh your-domain.com your_db_password your_telegram_bot_token your_telegram_chat_id
```

**Пример:**
```bash
sudo ./deploy.sh hns.dev MySecurePass123 1234567890:ABCDEFGHIJK 987654321
```

### 2. Загрузка проекта

После выполнения скрипта:

```bash
# Перейдите в директорию проекта
cd /var/www/hns-studio

# Скопируйте файлы проекта (или клонируйте из git)
# git clone https://github.com/your-repo/hns-studio.git .

# Запустите сборку и деплой
sudo -u hns ./update.sh
```

### 3. Проверка

Откройте в браузере: `https://your-domain.com`

## Что устанавливается автоматически

- ✅ **Node.js 20** - среда выполнения
- ✅ **PostgreSQL** - база данных
- ✅ **Nginx** - веб-сервер и reverse proxy
- ✅ **PM2** - процесс-менеджер для Node.js
- ✅ **SSL сертификат** - автоматически через Let's Encrypt
- ✅ **Firewall (UFW)** - базовая защита
- ✅ **Fail2ban** - защита от брутфорса
- ✅ **Logrotate** - ротация логов

## Структура развертывания

```
/var/www/hns-studio/          # Основная директория
├── dist/                     # Собранные файлы
├── logs/                     # Логи приложения
├── .env                      # Переменные окружения
├── ecosystem.config.js       # Конфигурация PM2
└── update.sh                 # Скрипт обновления
```

## Управление приложением

### PM2 команды
```bash
pm2 status              # Статус всех процессов
pm2 logs hns-studio     # Просмотр логов
pm2 restart hns-studio # Перезапуск приложения
pm2 stop hns-studio    # Остановка приложения
pm2 start hns-studio   # Запуск приложения
```

### Nginx команды
```bash
sudo systemctl status nginx   # Статус Nginx
sudo systemctl restart nginx  # Перезапуск Nginx
sudo nginx -t                 # Проверка конфигурации
```

### PostgreSQL команды
```bash
sudo systemctl status postgresql        # Статус базы данных
sudo -u postgres psql -d hns_studio    # Подключение к БД
```

## Обновление проекта

Для обновления кода:

```bash
# Перейдите в директорию проекта
cd /var/www/hns-studio

# Обновите код (git pull или загрузите новые файлы)
git pull origin main

# Запустите скрипт обновления
sudo -u hns ./update.sh
```

## Мониторинг

### Логи приложения
```bash
# Все логи
tail -f /var/www/hns-studio/logs/combined.log

# Только ошибки
tail -f /var/www/hns-studio/logs/err.log

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Системные ресурсы
```bash
# Использование памяти и CPU
htop

# Дисковое пространство
df -h

# Сетевые подключения
netstat -tlnp
```

## Безопасность

Скрипт автоматически настраивает:

- **UFW Firewall** - разрешены только SSH, HTTP, HTTPS
- **Fail2ban** - защита от брутфорс атак
- **SSL/TLS** - HTTPS с автообновлением сертификатов
- **Security headers** - защитные заголовки в Nginx
- **Gzip сжатие** - оптимизация трафика

## Резервное копирование

### База данных
```bash
# Создание бэкапа
sudo -u postgres pg_dump hns_studio > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление
sudo -u postgres psql hns_studio < backup_file.sql
```

### Файлы проекта
```bash
# Создание архива
tar -czf hns_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/hns-studio
```

## Автоматические обновления

Для настройки автоматических обновлений добавьте в crontab:

```bash
# Открыть crontab
sudo crontab -e

# Добавить строку для ежедневного обновления в 3:00
0 3 * * * cd /var/www/hns-studio && git pull && sudo -u hns ./update.sh
```

## Устранение проблем

### Приложение не запускается
```bash
# Проверьте логи PM2
pm2 logs hns-studio

# Проверьте конфигурацию
cat /var/www/hns-studio/.env

# Перезапустите PM2
pm2 restart hns-studio
```

### Nginx ошибки
```bash
# Проверьте конфигурацию
sudo nginx -t

# Проверьте логи
sudo tail -f /var/log/nginx/error.log
```

### База данных недоступна
```bash
# Проверьте статус PostgreSQL
sudo systemctl status postgresql

# Перезапустите если нужно
sudo systemctl restart postgresql
```

## Поддержка

При проблемах проверьте:
1. Логи PM2: `pm2 logs hns-studio`
2. Логи Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Статус сервисов: `systemctl status nginx postgresql`
4. Переменные окружения: `cat /var/www/hns-studio/.env`