import { db } from "./db";
import { technologies, teamRoles, portfolioProjects } from "@shared/schema";

async function seedDatabase() {
  if (!db) {
    console.error("Database not available for seeding");
    return;
  }

  try {
    console.log("Добавляю базовые данные...");

    // Базовые технологии
    const baseTechnologies = [
      { name: "React", icon: "Code", category: "frontend" },
      { name: "Node.js", icon: "Server", category: "backend" },
      { name: "TypeScript", icon: "FileCode", category: "frontend" },
      { name: "Python", icon: "Bot", category: "backend" },
      { name: "PostgreSQL", icon: "Database", category: "database" },
      { name: "Docker", icon: "Package", category: "devops" },
      { name: "Vue.js", icon: "Zap", category: "frontend" },
      { name: "Next.js", icon: "ArrowRight", category: "frontend" },
      { name: "Express.js", icon: "Server", category: "backend" },
      { name: "MongoDB", icon: "Database", category: "database" },
      { name: "Redis", icon: "Zap", category: "database" },
      { name: "AWS", icon: "Cloud", category: "devops" },
      { name: "Kubernetes", icon: "Container", category: "devops" },
      { name: "GraphQL", icon: "Share2", category: "backend" },
      { name: "Three.js", icon: "Box", category: "frontend" },
      { name: "TensorFlow", icon: "Brain", category: "ai" },
      { name: "React Native", icon: "Smartphone", category: "mobile" },
      { name: "Swift", icon: "Smartphone", category: "mobile" }
    ];

    for (const tech of baseTechnologies) {
      await db.insert(technologies).values(tech).onConflictDoNothing();
    }

    // Базовые роли команды
    const baseRoles = [
      { title: "Разработчики", description: "Frontend и Backend разработчики", icon: "Code", count: 8, color: "blue" },
      { title: "UI/UX Дизайнеры", description: "Создают красивые интерфейсы", icon: "Palette", count: 3, color: "purple" },
      { title: "DevOps Инженеры", description: "Настройка и поддержка инфраструктуры", icon: "Settings", count: 2, color: "green" },
      { title: "Проект-менеджеры", description: "Управление проектами и координация", icon: "Users", count: 2, color: "orange" }
    ];

    for (const role of baseRoles) {
      await db.insert(teamRoles).values(role).onConflictDoNothing();
    }

    // Проекты портфолио - полностью реализуемые технически сложные проекты
    const portfolioProjectsData = [
      {
        title: "CRM System с AI-аналитикой",
        description: "Полнофункциональная CRM система с автоматизацией продаж, управлением клиентской базой, интеллектуальной аналитикой и прогнозированием. Включает модули для работы с лидами, сделками, отчетностью и интеграцией с внешними сервисами.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Express.js"],
        link: "#",
        featured: true
      },
      {
        title: "Learning Management System (LMS)",
        description: "Современная платформа онлайн-обучения с интерактивными курсами, системой тестирования, прогресс-трекингом, форумами и видеоконференциями. Поддержка ролей преподавателей, студентов и администраторов.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "Node.js", "PostgreSQL", "TypeScript", "Express.js"],
        link: "#",
        featured: true
      },
      {
        title: "Task Management & Project Tracking",
        description: "Комплексная система управления проектами и задачами с канбан-досками, временными линиями, отчетами, интеграцией команд и автоматизацией рабочих процессов. Поддержка методологий Agile и Scrum.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "TypeScript", "PostgreSQL", "Node.js", "Express.js"],
        link: "#",
        featured: true
      },
      {
        title: "Advanced Analytics Dashboard",
        description: "Мощная панель аналитики с интерактивными графиками, кастомными отчетами, real-time мониторингом KPI, фильтрацией данных и экспортом в различные форматы. Поддержка множественных источников данных.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Express.js"],
        link: "#",
        featured: true
      },
      {
        title: "E-commerce Platform",
        description: "Полнофункциональная платформа электронной коммерции с каталогом товаров, корзиной покупок, системой заказов, управлением складом, админ-панелью и интеграцией платежей. Мультивендорная поддержка.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "Node.js", "PostgreSQL", "TypeScript", "Express.js"],
        link: "#",
        featured: false
      },
      {
        title: "Inventory Management System",
        description: "Система управления складскими запасами с отслеживанием товаров, автоматическими уведомлениями о низких остатках, управлением поставщиками, штрих-кодированием и детальной отчетностью.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "TypeScript", "PostgreSQL", "Node.js", "Express.js"],
        link: "#",
        featured: false
      },
      {
        title: "Real-time Chat & Collaboration",
        description: "Система корпоративного общения в реальном времени с чатами, каналами, файлообменом, видеозвонками, интеграцией с задачами и продвинутыми настройками приватности.",
        image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "Node.js", "PostgreSQL", "TypeScript", "WebSocket"],
        link: "#",
        featured: false
      },
      {
        title: "HR Management Platform",
        description: "Комплексная HR-система для управления персоналом с модулями найма, учета рабочего времени, оценки производительности, управления отпусками и корпоративным обучением.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Express.js"],
        link: "#",
        featured: false
      }
    ];

    for (const project of portfolioProjectsData) {
      await db.insert(portfolioProjects).values(project).onConflictDoNothing();
    }

    console.log("✅ Базовые данные успешно добавлены в базу данных");
  } catch (error) {
    console.error("❌ Ошибка при добавлении базовых данных:", error);
  }
}

// Запускаем seed только если файл запущен напрямую
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  seedDatabase().then(() => {
    console.log("Seeding завершен");
    process.exit(0);
  }).catch((error) => {
    console.error("Ошибка seeding:", error);
    process.exit(1);
  });
}

export { seedDatabase };