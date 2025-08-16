import { db } from "./db";
import { technologies, teamRoles, portfolioProjects } from "@shared/schema";

async function seedDatabase() {
  if (!db) {
    console.error("Database not available for seeding");
    return;
  }

  try {
    console.log("Добавляю расширенные тестовые данные...");

    // Расширенный список технологий по категориям
    const baseTechnologies = [
      // Frontend
      { name: "React", icon: "Code", category: "frontend" },
      { name: "Vue.js", icon: "Zap", category: "frontend" },
      { name: "Angular", icon: "Grid", category: "frontend" },
      { name: "Next.js", icon: "ArrowRight", category: "frontend" },
      { name: "Nuxt.js", icon: "ArrowUp", category: "frontend" },
      { name: "TypeScript", icon: "FileCode", category: "frontend" },
      { name: "JavaScript", icon: "Braces", category: "frontend" },
      { name: "Tailwind CSS", icon: "Palette", category: "frontend" },
      { name: "SCSS", icon: "Brush", category: "frontend" },
      { name: "Three.js", icon: "Box", category: "frontend" },
      { name: "WebGL", icon: "Zap", category: "frontend" },
      { name: "Framer Motion", icon: "Play", category: "frontend" },
      
      // Backend
      { name: "Node.js", icon: "Server", category: "backend" },
      { name: "Express.js", icon: "Server", category: "backend" },
      { name: "Fastify", icon: "Zap", category: "backend" },
      { name: "Python", icon: "Bot", category: "backend" },
      { name: "Django", icon: "Shield", category: "backend" },
      { name: "FastAPI", icon: "Rocket", category: "backend" },
      { name: "PHP", icon: "Code", category: "backend" },
      { name: "Laravel", icon: "Crown", category: "backend" },
      { name: "Java", icon: "Coffee", category: "backend" },
      { name: "Spring Boot", icon: "Leaf", category: "backend" },
      { name: "C#", icon: "Hash", category: "backend" },
      { name: ".NET", icon: "Grid", category: "backend" },
      { name: "Go", icon: "Zap", category: "backend" },
      { name: "GraphQL", icon: "Share2", category: "backend" },
      { name: "REST API", icon: "ArrowRightLeft", category: "backend" },
      
      // Mobile
      { name: "React Native", icon: "Smartphone", category: "mobile" },
      { name: "Flutter", icon: "Smartphone", category: "mobile" },
      { name: "iOS (Swift)", icon: "Smartphone", category: "mobile" },
      { name: "Android (Kotlin)", icon: "Smartphone", category: "mobile" },
      { name: "Xamarin", icon: "Smartphone", category: "mobile" },
      { name: "Ionic", icon: "Smartphone", category: "mobile" },
      
      // Database
      { name: "PostgreSQL", icon: "Database", category: "database" },
      { name: "MySQL", icon: "Database", category: "database" },
      { name: "MongoDB", icon: "Database", category: "database" },
      { name: "Redis", icon: "Zap", category: "database" },
      { name: "SQLite", icon: "Database", category: "database" },
      { name: "Firebase", icon: "Flame", category: "database" },
      { name: "Supabase", icon: "Database", category: "database" },
      
      // DevOps & Cloud
      { name: "Docker", icon: "Package", category: "devops" },
      { name: "Kubernetes", icon: "Container", category: "devops" },
      { name: "AWS", icon: "Cloud", category: "devops" },
      { name: "Google Cloud", icon: "Cloud", category: "devops" },
      { name: "Azure", icon: "Cloud", category: "devops" },
      { name: "Vercel", icon: "Triangle", category: "devops" },
      { name: "Netlify", icon: "Globe", category: "devops" },
      { name: "Digital Ocean", icon: "Droplets", category: "devops" },
      { name: "GitHub Actions", icon: "GitBranch", category: "devops" },
      { name: "Jenkins", icon: "Settings", category: "devops" },
      { name: "Terraform", icon: "Layers", category: "devops" },
      
      // AI/ML
      { name: "TensorFlow", icon: "Brain", category: "ai" },
      { name: "PyTorch", icon: "Brain", category: "ai" },
      { name: "OpenAI API", icon: "Bot", category: "ai" },
      { name: "LangChain", icon: "Link", category: "ai" },
      { name: "Hugging Face", icon: "Heart", category: "ai" },
      { name: "Scikit-learn", icon: "TrendingUp", category: "ai" }
    ];

    console.log(`Добавляю ${baseTechnologies.length} технологий...`);
    for (const tech of baseTechnologies) {
      await db.insert(technologies).values(tech).onConflictDoNothing();
    }

    // Обновленные роли команды с двуязычными названиями
    const baseRoles = [
      { 
        title: "Full-Stack разработчики", 
        description: "Универсальные разработчики",
        title_ru: "Full-Stack разработчики", 
        title_en: "Full-Stack Developers",
        description_ru: "Специалисты по фронтенд и бэкенд разработке", 
        description_en: "Frontend and backend development specialists",
        icon: "Code", 
        count: 8, 
        color: "blue" 
      },
      { 
        title: "UI/UX Дизайнеры", 
        description: "Создают красивые интерфейсы",
        title_ru: "UI/UX Дизайнеры", 
        title_en: "UI/UX Designers",
        description_ru: "Создают интуитивные и красивые пользовательские интерфейсы", 
        description_en: "Create intuitive and beautiful user interfaces",
        icon: "Palette", 
        count: 4, 
        color: "purple" 
      },
      { 
        title: "DevOps Инженеры", 
        description: "Настройка инфраструктуры",
        title_ru: "DevOps Инженеры", 
        title_en: "DevOps Engineers",
        description_ru: "Настройка и поддержка облачной инфраструктуры", 
        description_en: "Setup and maintenance of cloud infrastructure",
        icon: "Settings", 
        count: 3, 
        color: "green" 
      },
      { 
        title: "Проект-менеджеры", 
        description: "Управление проектами",
        title_ru: "Проект-менеджеры", 
        title_en: "Project Managers",
        description_ru: "Координация команд и управление проектами", 
        description_en: "Team coordination and project management",
        icon: "Users", 
        count: 2, 
        color: "orange" 
      },
      { 
        title: "QA Инженеры", 
        description: "Контроль качества",
        title_ru: "QA Инженеры", 
        title_en: "QA Engineers",
        description_ru: "Тестирование и обеспечение качества продукта", 
        description_en: "Testing and product quality assurance",
        icon: "CheckCircle", 
        count: 3, 
        color: "red" 
      },
      { 
        title: "Mobile разработчики", 
        description: "Мобильные приложения",
        title_ru: "Mobile разработчики", 
        title_en: "Mobile Developers",
        description_ru: "Создание нативных и кроссплатформенных мобильных приложений", 
        description_en: "Native and cross-platform mobile app development",
        icon: "Smartphone", 
        count: 4, 
        color: "cyan" 
      },
      { 
        title: "AI/ML Специалисты", 
        description: "Машинное обучение",
        title_ru: "AI/ML Специалисты", 
        title_en: "AI/ML Specialists",
        description_ru: "Разработка систем искусственного интеллекта и машинного обучения", 
        description_en: "AI and machine learning systems development",
        icon: "Brain", 
        count: 2, 
        color: "violet" 
      }
    ];

    console.log(`Добавляю ${baseRoles.length} ролей команды...`);
    for (const role of baseRoles) {
      await db.insert(teamRoles).values(role).onConflictDoNothing();
    }

    // Проекты портфолио - полностью реализуемые технически сложные проекты с двуязычными описаниями
    const portfolioProjectsData = [
      {
        title: "CRM система с AI-аналитикой",
        description: "Полнофункциональная CRM система",
        title_ru: "CRM система с AI-аналитикой",
        title_en: "AI-Powered CRM System",
        description_ru: "Полнофункциональная CRM система с автоматизацией продаж, управлением клиентской базой, интеллектуальной аналитикой и прогнозированием. Включает модули для работы с лидами, сделками, отчетностью и интеграцией с внешними сервисами.",
        description_en: "Full-featured CRM system with sales automation, customer database management, intelligent analytics and forecasting. Includes modules for leads, deals, reporting and external service integrations.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "TensorFlow", "OpenAI API"],
        link: "#",
        featured: true
      },
      {
        title: "Система управления обучением (LMS)",
        description: "Платформа онлайн-обучения",
        title_ru: "Система управления обучением (LMS)",
        title_en: "Learning Management System (LMS)",
        description_ru: "Современная платформа онлайн-обучения с интерактивными курсами, системой тестирования, прогресс-трекингом, форумами и видеоконференциями. Поддержка ролей преподавателей, студентов и администраторов.",
        description_en: "Modern online learning platform with interactive courses, testing system, progress tracking, forums and video conferencing. Support for teacher, student and administrator roles.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "Node.js", "PostgreSQL", "TypeScript", "Socket.io", "WebRTC"],
        link: "#",
        featured: true
      },
      {
        title: "Система управления проектами",
        description: "Управление задачами и проектами",
        title_ru: "Система управления проектами",
        title_en: "Project Management System",
        description_ru: "Комплексная система управления проектами и задачами с канбан-досками, временными линиями, отчетами, интеграцией команд и автоматизацией рабочих процессов. Поддержка методологий Agile и Scrum.",
        description_en: "Comprehensive project and task management system with Kanban boards, timelines, reports, team integration and workflow automation. Support for Agile and Scrum methodologies.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "TypeScript", "PostgreSQL", "Node.js", "Socket.io", "Chart.js"],
        link: "#",
        featured: true
      },
      {
        title: "Аналитическая панель управления",
        description: "Панель аналитики с графиками",
        title_ru: "Аналитическая панель управления",
        title_en: "Advanced Analytics Dashboard",
        description_ru: "Мощная панель аналитики с интерактивными графиками, кастомными отчетами, real-time мониторингом KPI, фильтрацией данных и экспортом в различные форматы. Поддержка множественных источников данных.",
        description_en: "Powerful analytics dashboard with interactive charts, custom reports, real-time KPI monitoring, data filtering and export to various formats. Support for multiple data sources.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "D3.js", "Chart.js"],
        link: "#",
        featured: true
      },
      {
        title: "Платформа электронной коммерции",
        description: "Интернет-магазин",
        title_ru: "Платформа электронной коммерции",
        title_en: "E-commerce Platform",
        description_ru: "Полнофункциональная платформа электронной коммерции с каталогом товаров, корзиной покупок, системой заказов, управлением складом, админ-панелью и интеграцией платежей. Мультивендорная поддержка.",
        description_en: "Full-featured e-commerce platform with product catalog, shopping cart, order system, inventory management, admin panel and payment integration. Multi-vendor support.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Redis", "Docker"],
        link: "#",
        featured: false
      },
      {
        title: "Система управления складом",
        description: "Управление запасами",
        title_ru: "Система управления складом",
        title_en: "Inventory Management System",
        description_ru: "Система управления складскими запасами с отслеживанием товаров, автоматическими уведомлениями о низких остатках, управлением поставщиками, штрих-кодированием и детальной отчетностью.",
        description_en: "Warehouse inventory management system with product tracking, automatic low stock notifications, supplier management, barcode scanning and detailed reporting.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "TypeScript", "PostgreSQL", "Node.js", "QR Scanner", "PDF Generator"],
        link: "#",
        featured: false
      },
      {
        title: "Платформа корпоративного общения",
        description: "Чат и коллаборация",
        title_ru: "Платформа корпоративного общения",
        title_en: "Corporate Communication Platform",
        description_ru: "Система корпоративного общения в реальном времени с чатами, каналами, файлообменом, видеозвонками, интеграцией с задачами и продвинутыми настройками приватности.",
        description_en: "Real-time corporate communication system with chats, channels, file sharing, video calls, task integration and advanced privacy settings.",
        image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "Node.js", "PostgreSQL", "Socket.io", "WebRTC", "File Upload"],
        link: "#",
        featured: false
      },
      {
        title: "HR-платформа управления персоналом",
        description: "Управление персоналом",
        title_ru: "HR-платформа управления персоналом",
        title_en: "HR Management Platform",
        description_ru: "Комплексная HR-система для управления персоналом с модулями найма, учета рабочего времени, оценки производительности, управления отпусками и корпоративным обучением.",
        description_en: "Comprehensive HR system for personnel management with hiring modules, time tracking, performance evaluation, leave management and corporate training.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["Vue.js", "TypeScript", "Node.js", "PostgreSQL", "Calendar", "PDF Reports"],
        link: "#",
        featured: false
      },
      {
        title: "Система финансового учета",
        description: "Бухгалтерия и финансы",
        title_ru: "Система финансового учета",
        title_en: "Financial Accounting System",
        description_ru: "Профессиональная система ведения бухгалтерского и управленческого учета с автоматизацией документооборота, формированием отчетности, интеграцией с банками и налоговыми системами.",
        description_en: "Professional accounting and management system with document workflow automation, report generation, bank integration and tax system connectivity.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["Angular", "TypeScript", "PostgreSQL", "Express.js", "PDF Generator", "Banking API"],
        link: "#",
        featured: false
      },
      {
        title: "Система мониторинга IoT",
        description: "Интернет вещей",
        title_ru: "Система мониторинга IoT",
        title_en: "IoT Monitoring System",
        description_ru: "Платформа для мониторинга и управления IoT-устройствами с real-time визуализацией данных, системой алертов, удаленным управлением и интеграцией с облачными сервисами.",
        description_en: "Platform for monitoring and managing IoT devices with real-time data visualization, alert system, remote control and cloud service integration.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        technologies: ["React", "Node.js", "MongoDB", "MQTT", "WebSocket", "Chart.js"],
        link: "#",
        featured: false
      }
    ];

    console.log(`Добавляю ${portfolioProjectsData.length} проектов портфолио...`);
    for (const project of portfolioProjectsData) {
      await db.insert(portfolioProjects).values(project).onConflictDoNothing();
    }

    console.log("✅ Расширенные тестовые данные успешно добавлены:");
    console.log(`   • ${baseTechnologies.length} технологий`);
    console.log(`   • ${baseRoles.length} ролей команды`);
    console.log(`   • ${portfolioProjectsData.length} проектов портфолио`);
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