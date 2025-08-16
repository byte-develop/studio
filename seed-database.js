#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Загрузка переменных окружения из .env файла
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('❌ Ошибка загрузки .env файла:', error.message);
    process.exit(1);
  }
}

// Технологии
const technologies = [
  // Frontend
  { name: 'React', category: 'Frontend', color: '#61DAFB' },
  { name: 'TypeScript', category: 'Frontend', color: '#3178C6' },
  { name: 'Three.js', category: 'Frontend', color: '#000000' },
  { name: 'React Three Fiber', category: 'Frontend', color: '#61DAFB' },
  { name: 'WebGL', category: 'Frontend', color: '#990000' },
  { name: 'D3.js', category: 'Frontend', color: '#F79A3E' },
  { name: 'Canvas API', category: 'Frontend', color: '#FF6B6B' },
  { name: 'WebAssembly', category: 'Frontend', color: '#654FF0' },
  { name: 'A-Frame', category: 'Frontend', color: '#EF2D5E' },
  { name: 'React Native', category: 'Mobile', color: '#61DAFB' },

  // Backend
  { name: 'Node.js', category: 'Backend', color: '#339933' },
  { name: 'Python', category: 'Backend', color: '#3776AB' },
  { name: 'FastAPI', category: 'Backend', color: '#009688' },
  { name: 'Go', category: 'Backend', color: '#00ADD8' },
  { name: 'Express.js', category: 'Backend', color: '#000000' },

  // Database
  { name: 'PostgreSQL', category: 'Database', color: '#336791' },
  { name: 'Redis', category: 'Database', color: '#DC382D' },
  { name: 'ClickHouse', category: 'Database', color: '#FFCC01' },
  { name: 'InfluxDB', category: 'Database', color: '#22ADF6' },

  // AI/ML
  { name: 'OpenAI API', category: 'AI/ML', color: '#412991' },
  { name: 'TensorFlow', category: 'AI/ML', color: '#FF6F00' },
  { name: 'Machine Learning', category: 'AI/ML', color: '#FF6B35' },

  // Blockchain
  { name: 'Solidity', category: 'Blockchain', color: '#363636' },
  { name: 'Web3.js', category: 'Blockchain', color: '#F16822' },
  { name: 'Smart Contracts', category: 'Blockchain', color: '#627EEA' },

  // DevOps
  { name: 'Docker', category: 'DevOps', color: '#2496ED' },
  { name: 'Kubernetes', category: 'DevOps', color: '#326CE5' },
  { name: 'Grafana', category: 'DevOps', color: '#F46800' },

  // Communication
  { name: 'WebRTC', category: 'Communication', color: '#333333' },
  { name: 'Socket.io', category: 'Communication', color: '#010101' },
  { name: 'WebSocket', category: 'Communication', color: '#FFA500' },
  { name: 'MQTT', category: 'IoT', color: '#660066' },

  // APIs & Integration
  { name: 'GitHub API', category: 'Integration', color: '#181717' },
  { name: 'REST API', category: 'Integration', color: '#02569B' },
  { name: 'WebXR', category: 'VR/AR', color: '#8A2BE2' },
  { name: 'Unity WebGL', category: 'VR/AR', color: '#000000' },

  // Media
  { name: 'FFmpeg', category: 'Media', color: '#007808' },
  { name: 'HLS', category: 'Media', color: '#FF4081' },
];

// Роли в команде
const teamRoles = [
  { 
    title: 'Frontend Developer', 
    description: 'Создание современных пользовательских интерфейсов с React, TypeScript и передовыми веб-технологиями',
    responsibilities: ['Разработка UI/UX компонентов', 'Оптимизация производительности', 'Кроссбраузерная совместимость', 'Адаптивный дизайн'],
    requirements: ['React/TypeScript', '3+ года опыта', 'Знание современных инструментов', 'Понимание UX принципов']
  },
  { 
    title: 'Backend Developer', 
    description: 'Разработка масштабируемых серверных решений и API для сложных бизнес-задач',
    responsibilities: ['Создание REST/GraphQL API', 'Архитектура микросервисов', 'Оптимизация баз данных', 'Интеграция внешних сервисов'],
    requirements: ['Node.js/Python/Go', 'Опыт с базами данных', 'Понимание архитектурных паттернов', 'Знание DevOps практик']
  },
  { 
    title: 'Full-Stack Developer', 
    description: 'Комплексная разработка веб-приложений от пользовательского интерфейса до серверной логики',
    responsibilities: ['Полный цикл разработки', 'Интеграция frontend и backend', 'Проектирование архитектуры', 'Code review и менторинг'],
    requirements: ['Универсальные навыки', '5+ лет опыта', 'Лидерские качества', 'Системное мышление']
  },
  { 
    title: '3D/WebGL Developer', 
    description: 'Создание интерактивных 3D-приложений и визуализаций в браузере',
    responsibilities: ['Разработка 3D-сцен', 'Оптимизация рендеринга', 'Интерактивные анимации', 'WebGL шейдеры'],
    requirements: ['Three.js/WebGL', 'Математика 3D графики', 'Оптимизация производительности', 'Креативное мышление']
  },
  { 
    title: 'AI/ML Engineer', 
    description: 'Интеграция искусственного интеллекта и машинного обучения в веб-приложения',
    responsibilities: ['Создание ML-моделей', 'Интеграция AI API', 'Анализ данных', 'Оптимизация алгоритмов'],
    requirements: ['Python/TensorFlow', 'Статистика и математика', 'Опыт с данными', 'Понимание алгоритмов ML']
  },
  { 
    title: 'DevOps Engineer', 
    description: 'Автоматизация процессов разработки, развертывания и мониторинга приложений',
    responsibilities: ['CI/CD настройка', 'Контейнеризация', 'Мониторинг систем', 'Автоматизация инфраструктуры'],
    requirements: ['Docker/Kubernetes', 'Облачные платформы', 'Скриптинг', 'Системное администрирование']
  },
  { 
    title: 'Mobile Developer', 
    description: 'Разработка кроссплатформенных мобильных приложений и PWA',
    responsibilities: ['React Native разработка', 'Нативные интеграции', 'Оптимизация для мобильных', 'App Store публикация'],
    requirements: ['React Native', 'iOS/Android знания', 'Мобильные паттерны UI/UX', 'Performance optimization']
  },
  { 
    title: 'Blockchain Developer', 
    description: 'Разработка децентрализованных приложений и смарт-контрактов',
    responsibilities: ['Смарт-контракты', 'DApp интерфейсы', 'Web3 интеграции', 'Безопасность блокчейна'],
    requirements: ['Solidity/Web3.js', 'Понимание блокчейна', 'Криптография', 'Безопасность']
  }
];

// Портфолио проекты
const portfolioProjects = [
  {
    title: 'AI-Powered Code Review Platform',
    description: 'Платформа для автоматического ревью кода с ИИ-анализом качества, безопасности и производительности. Интеграция с GitHub/GitLab, система команд и дашборд с метриками.',
    longDescription: 'Революционная платформа, которая использует искусственный интеллект для анализа кода на предмет качества, безопасности и производительности. Система автоматически интегрируется с популярными репозиториями, предоставляет детальную аналитику и помогает командам разработчиков повышать качество кода.',
    category: 'AI/ML',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'OpenAI API', 'GitHub API'],
    features: ['ИИ-анализ кода', 'Интеграция с GitHub/GitLab', 'Система команд', 'Дашборд аналитики', 'Webhook автопроверки']
  },
  {
    title: '3D Virtual Office Platform',
    description: 'Виртуальный офис с 3D-интерфейсом для удаленной работы. 3D-аватары, голосовые комнаты с пространственным звуком и реалтайм коллаборация.',
    longDescription: 'Инновационная платформа виртуального офиса, которая переносит рабочую среду в 3D-пространство. Сотрудники могут взаимодействовать через аватары, проводить встречи в виртуальных комнатах и использовать интерактивные инструменты для совместной работы.',
    category: '3D/WebGL',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    technologies: ['Three.js', 'React Three Fiber', 'WebRTC', 'Socket.io', 'WebGL'],
    features: ['3D-аватары с анимациями', 'Пространственный звук', 'Интерактивные доски', 'Система встреч', 'Реалтайм коллаборация']
  },
  {
    title: 'Intelligent E-commerce Analytics Suite',
    description: 'Продвинутая аналитическая платформа для e-commerce с предиктивной аналитикой, ML-моделями для прогнозирования продаж и автоматическим A/B тестированием.',
    longDescription: 'Комплексное решение для анализа e-commerce данных с использованием машинного обучения. Платформа предоставляет глубокую аналитику поведения пользователей, прогнозирует тренды продаж и автоматически оптимизирует конверсию.',
    category: 'AI/ML',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    technologies: ['React', 'D3.js', 'Python', 'PostgreSQL', 'ClickHouse', 'TensorFlow'],
    features: ['ML-прогнозирование продаж', 'Анализ поведения пользователей', 'Автоматическое A/B тестирование', 'Интерактивные дашборды', 'API интеграции']
  },
  {
    title: 'Blockchain Supply Chain Tracker',
    description: 'Система отслеживания цепочки поставок на блокчейне с смарт-контрактами, QR-кодами и интеграцией IoT-датчиков для полной прозрачности.',
    longDescription: 'Революционная система отслеживания товаров в цепочке поставок, построенная на технологии блокчейн. Обеспечивает полную прозрачность и неизменность данных о происхождении и пути товаров от производителя до потребителя.',
    category: 'Blockchain',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800',
    technologies: ['React', 'Node.js', 'Solidity', 'Web3.js', 'PostgreSQL'],
    features: ['Смарт-контракты', 'QR-отслеживание', 'IoT интеграция', 'Система верификации', 'Мобильное приложение']
  },
  {
    title: 'Real-time Collaborative Design Tool',
    description: 'Figma-подобный инструмент для 3D-дизайна с командной работой в реальном времени, системой слоев и экспортом в популярные форматы.',
    longDescription: 'Профессиональный инструмент для 3D-дизайна, позволяющий командам создавать сложные 3D-модели в браузере с возможностью реального времени коллаборации. Поддерживает все основные 3D-функции и экспорт в индустриальные форматы.',
    category: '3D/WebGL',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    technologies: ['Three.js', 'WebGL', 'Socket.io', 'Canvas API', 'WebAssembly'],
    features: ['Реалтайм коллаборация', '3D-примитивы и материалы', 'Система слоев', 'Экспорт 3D-форматов', 'Система комментариев']
  },
  {
    title: 'AI-Powered Trading Bot Platform',
    description: 'Платформа для создания торговых ботов с ИИ, визуальным конструктором стратегий, ML-анализом рынка и системой управления рисками.',
    longDescription: 'Продвинутая платформа для алгоритмической торговли, которая использует машинное обучение для анализа финансовых рынков. Пользователи могут создавать сложные торговые стратегии без программирования и тестировать их на исторических данных.',
    category: 'AI/ML',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    technologies: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'TensorFlow'],
    features: ['Визуальный конструктор стратегий', 'ML-анализ рынка', 'Бэктестинг', 'Реалтайм мониторинг', 'Управление рисками']
  },
  {
    title: 'Advanced DevOps Monitoring Dashboard',
    description: 'Comprehensive мониторинг для микросервисной архитектуры с автоматическим обнаружением сервисов, предиктивными алертами и масштабированием.',
    longDescription: 'Профессиональная система мониторинга для сложных IT-инфраструктур. Автоматически обнаруживает сервисы, строит карты зависимостей, предсказывает проблемы и может автоматически масштабировать ресурсы.',
    category: 'DevOps',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    technologies: ['React', 'Go', 'Node.js', 'InfluxDB', 'Grafana', 'Docker', 'Kubernetes'],
    features: ['Автообнаружение сервисов', 'Карта зависимостей', 'Предиктивные алерты', 'CI/CD интеграция', 'Автомасштабирование']
  },
  {
    title: 'AR/VR Learning Management System',
    description: 'Платформа для обучения с поддержкой VR/AR, иммерсивными VR-классами, AR-объектами и системой создания 3D-курсов.',
    longDescription: 'Инновационная образовательная платформа, которая использует технологии виртуальной и дополненной реальности для создания уникального учебного опыта. Студенты могут изучать сложные концепции в иммерсивной 3D-среде.',
    category: 'VR/AR',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800',
    technologies: ['React', 'A-Frame', 'Three.js', 'WebXR', 'Unity WebGL'],
    features: ['VR-классы', 'AR-объекты', 'Создание 3D-курсов', 'Мультиплеер', 'Геймификация']
  },
  {
    title: 'Smart IoT Home Automation Platform',
    description: 'Comprehensive система умного дома с веб и мобильным интерфейсом, автоматизацией на основе ML и голосовым управлением.',
    longDescription: 'Полноценная экосистема умного дома, которая объединяет различные IoT-устройства в единую систему. Использует машинное обучение для автоматизации процессов и оптимизации энергопотребления.',
    category: 'IoT',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    technologies: ['React Native', 'Node.js', 'MQTT', 'PostgreSQL', 'React'],
    features: ['Веб и мобильное управление', 'ML-автоматизация', 'Энергомониторинг', 'Система безопасности', 'Голосовое управление']
  },
  {
    title: 'Advanced Video Streaming Platform',
    description: 'Платформа для стриминга с адаптивным битрейтом, реалтайм чатом, системой записи и мультистримом на разные платформы.',
    longDescription: 'Профессиональная стриминговая платформа с продвинутыми возможностями для контент-криейторов. Поддерживает высококачественную трансляцию, интерактивное взаимодействие с аудиторией и детальную аналитику.',
    category: 'Media',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    technologies: ['React', 'WebRTC', 'FFmpeg', 'HLS', 'Socket.io'],
    features: ['Адаптивный битрейт', 'Реалтайм чат', 'Система записи', 'Мультистрим', 'Аналитика просмотров']
  }
];

async function seedDatabase() {
  const env = loadEnv();
  const databaseUrl = env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL не найден в .env файле');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    console.log('🔌 Подключение к базе данных...');
    await client.connect();

    // Создание таблиц если их нет
    console.log('📋 Создание таблиц...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS technologies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        category VARCHAR(50) NOT NULL,
        color VARCHAR(7) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS team_roles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        responsibilities TEXT[] NOT NULL,
        requirements TEXT[] NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio_projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        long_description TEXT,
        category VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'completed',
        image_url TEXT,
        technologies TEXT[] NOT NULL,
        features TEXT[] NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Очистка существующих данных
    console.log('🧹 Очистка существующих данных...');
    await client.query('DELETE FROM portfolio_projects');
    await client.query('DELETE FROM team_roles');
    await client.query('DELETE FROM technologies');
    
    // Сброс автоинкремента
    await client.query('ALTER SEQUENCE technologies_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE team_roles_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE portfolio_projects_id_seq RESTART WITH 1');

    // Добавление технологий
    console.log('⚙️ Добавление технологий...');
    for (const tech of technologies) {
      await client.query(
        'INSERT INTO technologies (name, category, color) VALUES ($1, $2, $3)',
        [tech.name, tech.category, tech.color]
      );
    }
    console.log(`✅ Добавлено ${technologies.length} технологий`);

    // Добавление ролей команды
    console.log('👥 Добавление ролей команды...');
    for (const role of teamRoles) {
      await client.query(
        'INSERT INTO team_roles (title, description, responsibilities, requirements) VALUES ($1, $2, $3, $4)',
        [role.title, role.description, role.responsibilities, role.requirements]
      );
    }
    console.log(`✅ Добавлено ${teamRoles.length} ролей команды`);

    // Добавление проектов портфолио
    console.log('💼 Добавление проектов портфолио...');
    for (const project of portfolioProjects) {
      await client.query(
        'INSERT INTO portfolio_projects (title, description, long_description, category, status, image_url, technologies, features) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          project.title,
          project.description,
          project.longDescription,
          project.category,
          project.status,
          project.imageUrl,
          project.technologies,
          project.features
        ]
      );
    }
    console.log(`✅ Добавлено ${portfolioProjects.length} проектов портфолио`);

    // Проверка результатов
    const techCount = await client.query('SELECT COUNT(*) FROM technologies');
    const rolesCount = await client.query('SELECT COUNT(*) FROM team_roles');
    const projectsCount = await client.query('SELECT COUNT(*) FROM portfolio_projects');

    console.log('\n🎉 База данных успешно заполнена!');
    console.log(`📊 Статистика:`);
    console.log(`   • Технологии: ${techCount.rows[0].count}`);
    console.log(`   • Роли команды: ${rolesCount.rows[0].count}`);
    console.log(`   • Проекты портфолио: ${projectsCount.rows[0].count}`);
    
    console.log('\n🔍 Примеры добавленных данных:');
    
    // Показать несколько примеров технологий
    const sampleTechs = await client.query('SELECT name, category FROM technologies LIMIT 5');
    console.log('   Технологии:');
    sampleTechs.rows.forEach(tech => {
      console.log(`     • ${tech.name} (${tech.category})`);
    });
    
    // Показать несколько примеров проектов
    const sampleProjects = await client.query('SELECT title, category FROM portfolio_projects LIMIT 3');
    console.log('   Проекты:');
    sampleProjects.rows.forEach(project => {
      console.log(`     • ${project.title} (${project.category})`);
    });

  } catch (error) {
    console.error('❌ Ошибка при заполнении базы данных:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Подключение к базе данных закрыто');
  }
}

// Запуск скрипта
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };