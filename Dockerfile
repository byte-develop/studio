# Dockerfile для HNS Studio
FROM node:20-alpine

# Создание рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci --production=false

# Копирование исходного кода
COPY . .

# Сборка проекта
RUN npm run build

# Создание пользователя без прав root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Изменение владельца файлов
RUN chown -R nextjs:nodejs /app
USER nextjs

# Открытие порта
EXPOSE 3000

# Переменные окружения по умолчанию
ENV NODE_ENV=production
ENV PORT=3000

# Запуск приложения
CMD ["npm", "start"]