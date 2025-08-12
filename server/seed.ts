import { db } from "./db";
import { technologies, teamRoles, portfolioProjects, serviceProjects } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Добавляем базовые технологии
    const baseTechnologies = [
      { name: "React", icon: "Code", category: "frontend" },
      { name: "Node.js", icon: "Server", category: "backend" },
      { name: "TypeScript", icon: "FileCode", category: "frontend" },
      { name: "Python", icon: "Bot", category: "backend" },
      { name: "PostgreSQL", icon: "Database", category: "database" },
      { name: "Docker", icon: "Package", category: "devops" },
      { name: "Vue.js", icon: "Code", category: "frontend" },
      { name: "Express.js", icon: "Server", category: "backend" },
      { name: "MongoDB", icon: "Database", category: "database" },
      { name: "AWS", icon: "Cloud", category: "devops" },
      { name: "Flutter", icon: "Smartphone", category: "mobile" },
      { name: "React Native", icon: "Smartphone", category: "mobile" }
    ];

    await db.insert(technologies).values(baseTechnologies).onConflictDoNothing();

    // Добавляем базовые роли команды
    const baseRoles = [
      { 
        title: "Frontend Разработчики", 
        description: "Создают пользовательские интерфейсы и обеспечивают отличный UX", 
        icon: "Monitor", 
        count: 5, 
        color: "blue" 
      },
      { 
        title: "Backend Разработчики", 
        description: "Разрабатывают серверную логику и API", 
        icon: "Server", 
        count: 4, 
        color: "green" 
      },
      { 
        title: "UI/UX Дизайнеры", 
        description: "Создают красивые и удобные интерфейсы", 
        icon: "Palette", 
        count: 3, 
        color: "purple" 
      },
      { 
        title: "DevOps Инженеры", 
        description: "Настройка и поддержка инфраструктуры", 
        icon: "Settings", 
        count: 2, 
        color: "orange" 
      },
      { 
        title: "Мобильные Разработчики", 
        description: "Создают нативные и кроссплатформенные приложения", 
        icon: "Smartphone", 
        count: 3, 
        color: "red" 
      },
      { 
        title: "Проект-менеджеры", 
        description: "Управление проектами и координация команды", 
        icon: "Users", 
        count: 2, 
        color: "yellow" 
      }
    ];

    await db.insert(teamRoles).values(baseRoles).onConflictDoNothing();

    // Добавляем примеры проектов портфолио
    const portfolioSamples = [
      {
        title: "E-commerce Platform",
        description: "Современная платформа электронной коммерции с административной панелью",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe API"],
        link: "#",
        featured: true
      },
      {
        title: "Corporate Website",
        description: "Корпоративный сайт с CMS и аналитикой",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        technologies: ["Vue.js", "Express.js", "MongoDB"],
        link: "#",
        featured: true
      },
      {
        title: "Mobile Banking App",
        description: "Мобильное приложение для банковских операций",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
        technologies: ["React Native", "Node.js", "PostgreSQL"],
        link: "#",
        featured: false
      }
    ];

    await db.insert(portfolioProjects).values(portfolioSamples).onConflictDoNothing();

    // Добавляем примеры проектов для услуг
    const serviceSamples = [
      {
        serviceType: "web-development",
        title: "Интернет-магазин электроники",
        description: "Полнофункциональный интернет-магазин с корзиной и оплатой",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
        link: "#"
      },
      {
        serviceType: "web-development", 
        title: "SaaS платформа",
        description: "B2B платформа для управления проектами",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        technologies: ["Vue.js", "Express.js", "MongoDB"],
        link: "#"
      },
      {
        serviceType: "mobile-development",
        title: "Фитнес приложение",
        description: "Мобильное приложение для отслеживания тренировок",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
        technologies: ["Flutter", "Firebase", "Stripe"],
        link: "#"
      },
      {
        serviceType: "mobile-development",
        title: "Доставка еды",
        description: "Приложение для заказа и доставки еды",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
        technologies: ["React Native", "Node.js", "MongoDB"],
        link: "#"
      }
    ];

    await db.insert(serviceProjects).values(serviceSamples).onConflictDoNothing();

    // Добавляем технологии как было изначально
    const technologiesData = [
      { name: 'React', icon: 'Code2', category: 'frontend' },
      { name: 'Vue.js', icon: 'Code2', category: 'frontend' },
      { name: 'Next.js', icon: 'Code2', category: 'frontend' },
      { name: 'TypeScript', icon: 'FileCode', category: 'frontend' },
      { name: 'Node.js', icon: 'Server', category: 'backend' },
      { name: 'Python', icon: 'Code2', category: 'backend' },
      { name: 'Three.js', icon: 'Box', category: 'frontend' },
      { name: 'WebGL', icon: 'Monitor', category: 'frontend' },
      { name: 'PostgreSQL', icon: 'Database', category: 'database' },
      { name: 'MongoDB', icon: 'Database', category: 'database' },
      { name: 'AWS', icon: 'Cloud', category: 'devops' },
      { name: 'Docker', icon: 'Container', category: 'devops' },
      { name: 'Kubernetes', icon: 'Settings', category: 'devops' },
      { name: 'Redis', icon: 'Database', category: 'database' },
      { name: 'GraphQL', icon: 'Code2', category: 'backend' },
      { name: 'TensorFlow', icon: 'Brain', category: 'ai' },
      { name: 'Flutter', icon: 'Smartphone', category: 'mobile' },
      { name: 'Swift', icon: 'Smartphone', category: 'mobile' },
      { name: 'Kotlin', icon: 'Smartphone', category: 'mobile' },
      { name: 'Rust', icon: 'Code2', category: 'backend' },
      { name: 'Go', icon: 'Code2', category: 'backend' },
      { name: 'Figma', icon: 'Palette', category: 'design' },
      { name: 'Blender', icon: 'Box', category: 'design' },
      { name: 'Unity', icon: 'Gamepad2', category: 'design' }
    ];

    await db.insert(technologies).values(technologiesData).onConflictDoNothing();

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}