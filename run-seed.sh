#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🌱 Скрипт заполнения базы данных HNS Studio${NC}"
echo "================================================="

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js не установлен. Установите Node.js и попробуйте снова.${NC}"
    exit 1
fi

# Проверка наличия npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm не установлен. Установите npm и попробуйте снова.${NC}"
    exit 1
fi

# Проверка наличия .env файла
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Файл .env не найден. Создайте .env файл с DATABASE_URL${NC}"
    echo "Пример содержимого .env:"
    echo "DATABASE_URL=postgresql://username:password@localhost:5432/database_name"
    exit 1
fi

# Проверка наличия DATABASE_URL в .env
if ! grep -q "DATABASE_URL" .env; then
    echo -e "${RED}❌ DATABASE_URL не найден в .env файле${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Установка зависимости pg...${NC}"
npm install pg

echo -e "${YELLOW}🔍 Проверка подключения к базе данных...${NC}"

# Загрузка DATABASE_URL из .env
source .env

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL пуст в .env файле${NC}"
    exit 1
fi

# Создание базы данных если её нет
echo -e "${YELLOW}🏗️ Создание базы данных если её нет...${NC}"

# Извлечение параметров подключения из DATABASE_URL
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "Параметры подключения:"
echo "• Пользователь: $DB_USER"
echo "• Хост: $DB_HOST"
echo "• Порт: $DB_PORT"
echo "• База данных: $DB_NAME"

# Создание базы данных
echo -e "${YELLOW}📂 Создание базы данных $DB_NAME...${NC}"
PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "База данных уже существует или была создана"

# Создание пользователя если нужно
echo -e "${YELLOW}👤 Проверка пользователя...${NC}"
PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || echo "Пользователь уже существует"
PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || echo "Права уже предоставлены"

echo -e "${YELLOW}🌱 Запуск заполнения базы данных...${NC}"
echo ""

# Запуск скрипта заполнения
node seed-database.js

# Проверка успешности выполнения
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ База данных успешно заполнена тестовыми данными!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Что было добавлено:${NC}"
    echo "• 30+ технологий (React, Node.js, AI/ML, Blockchain и др.)"
    echo "• 8 ролей в команде (Frontend, Backend, Full-Stack, DevOps и др.)"
    echo "• 10 проектов портфолио (от AI платформ до VR/AR систем)"
    echo ""
    echo -e "${GREEN}🚀 Теперь можете запустить приложение и увидеть данные в интерфейсе!${NC}"
else
    echo ""
    echo -e "${RED}❌ Произошла ошибка при заполнении базы данных${NC}"
    echo "Проверьте:"
    echo "• Правильность DATABASE_URL в .env файле"
    echo "• Доступность базы данных"
    echo "• Права на создание таблиц"
    exit 1
fi