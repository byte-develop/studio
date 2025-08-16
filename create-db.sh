#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🗄️ Создание базы данных HNS Studio${NC}"
echo "========================================="

# Проверка наличия .env файла
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Файл .env не найден${NC}"
    echo "Создаю базовый .env файл..."
    
    cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://hns_user:MyPass123@localhost:5432/hns_studio
EOF
    
    echo -e "${GREEN}✅ Создан .env файл с настройками по умолчанию${NC}"
fi

# Загрузка переменных из .env
source .env

# Извлечение параметров из DATABASE_URL
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo -e "${YELLOW}📋 Параметры подключения:${NC}"
echo "• Пользователь: $DB_USER"
echo "• Пароль: $DB_PASS"
echo "• Хост: $DB_HOST"
echo "• Порт: $DB_PORT"
echo "• База данных: $DB_NAME"
echo ""

# Проверка доступности PostgreSQL
echo -e "${YELLOW}🔍 Проверка PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL не установлен${NC}"
    echo "Установите PostgreSQL:"
    echo "sudo apt update && sudo apt install postgresql postgresql-contrib"
    exit 1
fi

# Запуск PostgreSQL если не запущен
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Создание пользователя и базы данных через postgres суперпользователя
echo -e "${YELLOW}👤 Создание пользователя базы данных...${NC}"
sudo -u postgres psql << EOF
-- Создание пользователя
CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';

-- Создание базы данных
CREATE DATABASE $DB_NAME OWNER $DB_USER;

-- Предоставление прав
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
GRANT CREATEDB TO $DB_USER;

-- Выход
\q
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ База данных и пользователь созданы успешно!${NC}"
    
    # Проверка подключения
    echo -e "${YELLOW}🔌 Проверка подключения...${NC}"
    PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 'Подключение успешно!' as status;" 
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Подключение к базе данных работает!${NC}"
        echo ""
        echo -e "${YELLOW}🌱 Теперь можете запустить заполнение данными:${NC}"
        echo "./run-seed.sh"
    else
        echo -e "${RED}❌ Ошибка подключения к базе данных${NC}"
    fi
else
    echo -e "${RED}❌ Ошибка создания базы данных${NC}"
    echo "Возможные причины:"
    echo "• PostgreSQL не запущен: sudo systemctl start postgresql"
    echo "• Недостаточно прав"
    echo "• База данных уже существует"
    
    # Попробуем альтернативный способ
    echo -e "${YELLOW}🔄 Попытка альтернативного создания...${NC}"
    
    # Создание через createdb
    sudo -u postgres createdb $DB_NAME -O $DB_USER 2>/dev/null && echo "База данных создана через createdb"
    
    # Создание пользователя отдельно
    sudo -u postgres createuser $DB_USER --createdb --no-superuser --no-createrole 2>/dev/null && echo "Пользователь создан"
    
    # Установка пароля
    sudo -u postgres psql -c "ALTER USER $DB_USER PASSWORD '$DB_PASS';" 2>/dev/null && echo "Пароль установлен"
fi