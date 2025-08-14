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

    // Проекты портфолио
    const portfolioProjectsData = [
      {
        title: "E-commerce Platform",
        description: "Современная платформа электронной коммерции с микросервисной архитектурой, поддержкой множественных валют и продвинутой аналитикой. Включает admin панель, систему управления заказами и интеграцию с платежными системами.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
        link: "#",
        featured: true
      },
      {
        title: "AI-Powered Analytics Dashboard",
        description: "Интеллектуальная панель аналитики с использованием машинного обучения для предсказания трендов и автоматического выявления аномалий в данных. Интерактивные графики и real-time обновления.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["Vue.js", "Python", "TensorFlow", "MongoDB", "Docker"],
        link: "#",
        featured: true
      },
      {
        title: "Mobile Banking App",
        description: "Безопасное мобильное банковское приложение с биометрической авторизацией, P2P переводами, управлением картами и инвестиционным портфелем. Поддержка iOS и Android.",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React Native", "Node.js", "PostgreSQL", "Redis"],
        link: "#",
        featured: true
      },
      {
        title: "3D Product Configurator",
        description: "Интерактивный 3D конфигуратор продуктов для мебельной индустрии. Пользователи могут выбирать материалы, цвета и конфигурации в реальном времени с фотореалистичной визуализацией.",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["Three.js", "React", "Node.js", "AWS"],
        link: "#",
        featured: false
      },
      {
        title: "Real-time Collaboration Platform",
        description: "Платформа для совместной работы в реальном времени с видеозвонками, общими досками, файловым хранилищем и системой задач. Поддержка до 1000 одновременных участников.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["Next.js", "Express.js", "PostgreSQL", "Redis", "Docker"],
        link: "#",
        featured: false
      },
      {
        title: "Smart IoT Dashboard",
        description: "Умная панель управления IoT устройствами для умного дома. Мониторинг датчиков, автоматизация сценариев, энергосбережение и безопасность с мобильным приложением.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "Python", "MongoDB", "Docker", "AWS"],
        link: "#",
        featured: false
      },
      {
        title: "Blockchain Voting System",
        description: "Децентрализованная система голосования на блокчейне с криптографической защитой, прозрачностью результатов и анонимностью избирателей. Web3 интеграция.",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "Node.js", "PostgreSQL", "Docker"],
        link: "#",
        featured: false
      },
      {
        title: "Medical Records Management",
        description: "HIPAA-совместимая система управления медицинскими записями с электронными рецептами, планированием приемов и телемедициной. Интеграция с медицинским оборудованием.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["Vue.js", "Express.js", "PostgreSQL", "Redis", "Docker"],
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