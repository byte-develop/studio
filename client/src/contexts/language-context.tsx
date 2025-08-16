import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ru';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  ru: {
    nav: {
      home: 'Главная',
      services: 'Услуги',
      portfolio: 'Портфолио',
      team: 'Команда',
      contacts: 'Контакты',
      allServices: 'Все услуги'
    },
    services: {
      webDevelopment: 'Веб-Разработка',
      webDevelopmentDesc: 'Создание современных веб-приложений от лендингов до сложных корпоративных систем',
      '3dWebgl': '3D и WebGL',
      '3dWebglDesc': 'Интерактивные 3D веб-приложения, игры и визуализации с использованием передовых технологий',
      mobileDevelopment: 'Мобильная Разработка',
      mobileDevelopmentDesc: 'Нативные и кроссплатформенные мобильные приложения с современным UX',
      backendApi: 'Backend & API',
      backendApiDesc: 'Надежные серверные решения, микросервисы и RESTful API',
      aiMl: 'ИИ и ML',
      aiMlDesc: 'Внедрение машинного обучения и искусственного интеллекта в бизнес-процессы',
      devopsCloud: 'DevOps & Cloud',
      devopsCloudDesc: 'Автоматизация развертывания, мониторинг и масштабирование в облаке',
      title: 'Наши Услуги',
      subtitle: 'Полный спектр разработки от концепции до запуска',
      learnMore: 'Подробнее'
    },
    hero: {
      title: 'ПЕРЕДОВАЯ РАЗРАБОТКА',
      subtitle: 'Превращаем идеи в революционные цифровые продукты с помощью инновационных технологий и креативного подхода',
      getStarted: 'Связаться с нами',
      ourWork: 'Посмотреть проекты'
    },
    portfolio: {
      title: 'Наше Портфолио',
      subtitle: 'Проекты, которые определяют будущее цифровых технологий',
      viewProject: 'Посмотреть проект',
      technologies: 'Технологии',
      loading: 'Загружаем проекты...',
      viewAllProjects: 'Посмотреть все проекты',
      topProject: 'Топ проект'
    },
    team: {
      title: 'Структура Команды',
      subtitle: 'Сплоченная команда профессионалов с четким распределением ролей и ответственности',
      loading: 'Загружаем данные команды...',
      philosophy: 'Наша философия работы',
      philosophyDesc: 'Мы верим в силу командной работы и четкого распределения ролей. Каждый участник команды является экспертом в своей области и вносит уникальный вклад в успех проекта. Прозрачная коммуникация и взаимная поддержка - основа нашего подхода.',
      teamwork: 'Командная работа',
      teamworkDesc: 'Синергия экспертов разных областей',
      qualityFocus: 'Фокус на качестве',
      qualityFocusDesc: 'Каждый элемент проходит строгий контроль',
      innovation: 'Инновации',
      innovationDesc: 'Постоянно изучаем новые технологии'
    },
    process: {
      title: 'Процесс Разработки',
      subtitle: 'Структурированный подход к созданию инновационных решений',
      step1: 'Анализ и Планирование',
      step1Desc: 'Глубокое изучение требований, создание технического задания и архитектуры проекта',
      step2: 'Дизайн и Прототипирование',
      step2Desc: 'Создание UX/UI дизайна, интерактивных прототипов и 3D концепций',
      step3: 'Разработка',
      step3Desc: 'Программирование функционала, интеграция 3D элементов и создание API',
      step4: 'Тестирование и Запуск',
      step4Desc: 'Комплексное тестирование, оптимизация производительности и развертывание'
    },
    contact: {
      title: 'Свяжитесь с Нами',
      subtitle: 'Готовы воплотить ваши идеи в передовые цифровые решения',
      name: 'Имя',
      email: 'Email',
      company: 'Компания',
      phone: 'Телефон',
      service: 'Услуга',
      budget: 'Бюджет проекта',
      message: 'Сообщение',
      send: 'Отправить сообщение',
      sending: 'Отправляется...',
      followUs: 'Следите за нами',
      quickResponse: 'Быстрый отклик',
      quickResponseDesc: 'Отвечаем на все заявки в течение 2 часов в рабочее время. Приоритет отдаем срочным проектам и важным задачам.',
      personalManager: 'Персональный менеджер',
      personalManagerDesc: 'За каждым проектом закрепляется персональный менеджер для постоянной связи и контроля качества.',
      selectService: 'Выберите услугу',
      selectBudget: 'Выберите диапазон',
      yourName: 'Ваше имя',
      companyName: 'Название компании',
      projectMessage: 'Расскажите о вашем проекте...',
      privacyAgree: 'Я согласен с',
      privacyPolicy: 'политикой конфиденциальности',
      userAgreement: 'пользовательским соглашением',
      sendSuccess: 'Сообщение отправлено!',
      sendSuccessDesc: 'Мы свяжемся с вами в ближайшее время.',
      sendError: 'Ошибка отправки',
      sendErrorDesc: 'Попробуйте еще раз позже.'
    },
    technologies: {
      title: 'Наши Технологии',
      subtitle: 'Современные инструменты для создания лучших решений'
    },
    footer: {
      company: 'Компания',
      services: 'Услуги',
      legal: 'Правовая информация',
      contact: 'Контакты',
      privacy: 'Политика конфиденциальности',
      terms: 'Пользовательское соглашение',
      rights: 'Все права защищены.'
    },
    modal: {
      topProject: 'Топ проект',
      projectDescription: 'Описание проекта',
      technologies: 'Технологии',
      technologiesCount: 'технологий',
      viewDemo: 'Посмотреть демо',
      dateNotSpecified: 'Дата не указана'
    },
    privacy: {
      title: 'Политика конфиденциальности',
      subtitle: 'Защита и обработка персональных данных в HNS',
      backToHome: 'Вернуться на главную',
      lastUpdated: 'Дата последнего обновления'
    },
    terms: {
      title: 'Пользовательское соглашение',
      subtitle: 'Условия использования услуг HNS',
      backToHome: 'Вернуться на главную',
      lastUpdated: 'Дата последнего обновления'
    }
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      portfolio: 'Portfolio',
      team: 'Team',
      contacts: 'Contacts',
      allServices: 'All Services'
    },
    services: {
      webDevelopment: 'Web Development',
      webDevelopmentDesc: 'Creating modern web applications from landing pages to complex corporate systems',
      '3dWebgl': '3D & WebGL',
      '3dWebglDesc': 'Interactive 3D web applications, games and visualizations using cutting-edge technologies',
      mobileDevelopment: 'Mobile Development',
      mobileDevelopmentDesc: 'Native and cross-platform mobile applications with modern UX',
      backendApi: 'Backend & API',
      backendApiDesc: 'Reliable server solutions, microservices and RESTful APIs',
      aiMl: 'AI & ML',
      aiMlDesc: 'Implementation of machine learning and artificial intelligence in business processes',
      devopsCloud: 'DevOps & Cloud',
      devopsCloudDesc: 'Deployment automation, monitoring and cloud scaling',
      title: 'Our Services',
      subtitle: 'Full development cycle from concept to launch',
      learnMore: 'Learn More'
    },
    hero: {
      title: 'CUTTING-EDGE DEVELOPMENT',
      subtitle: 'We turn ideas into revolutionary digital products using innovative technologies and creative approach',
      getStarted: 'Contact Us',
      ourWork: 'View Projects'
    },
    portfolio: {
      title: 'Our Portfolio',
      subtitle: 'Projects that define the future of digital technologies',
      viewProject: 'View Project',
      technologies: 'Technologies',
      loading: 'Loading projects...',
      viewAllProjects: 'View All Projects',
      topProject: 'Top Project'
    },
    team: {
      title: 'Team Structure',
      subtitle: 'A cohesive team of professionals with clear role distribution and responsibilities',
      loading: 'Loading team data...',
      philosophy: 'Our Work Philosophy',
      philosophyDesc: 'We believe in the power of teamwork and clear role distribution. Each team member is an expert in their field and contributes uniquely to project success. Transparent communication and mutual support are the foundation of our approach.',
      teamwork: 'Teamwork',
      teamworkDesc: 'Synergy of experts from different fields',
      qualityFocus: 'Quality Focus',
      qualityFocusDesc: 'Every element undergoes strict quality control',
      innovation: 'Innovation',
      innovationDesc: 'Constantly learning new technologies'
    },
    process: {
      title: 'Development Process',
      subtitle: 'Structured approach to creating innovative solutions',
      step1: 'Analysis and Planning',
      step1Desc: 'Deep study of requirements, creating technical specifications and project architecture',
      step2: 'Design and Prototyping',
      step2Desc: 'Creating UX/UI design, interactive prototypes and 3D concepts',
      step3: 'Development',
      step3Desc: 'Programming functionality, integrating 3D elements and creating APIs',
      step4: 'Testing and Launch',
      step4Desc: 'Comprehensive testing, performance optimization and deployment'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Ready to bring your ideas to cutting-edge digital solutions',
      name: 'Name',
      email: 'Email',
      company: 'Company',
      phone: 'Phone',
      service: 'Service',
      budget: 'Project Budget',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      followUs: 'Follow Us',
      quickResponse: 'Quick Response',
      quickResponseDesc: 'We respond to all requests within 2 hours during business hours. Priority is given to urgent projects and important tasks.',
      personalManager: 'Personal Manager',
      personalManagerDesc: 'Each project is assigned a personal manager for constant communication and quality control.',
      selectService: 'Select Service',
      selectBudget: 'Select Range',
      yourName: 'Your Name',
      companyName: 'Company Name',
      projectMessage: 'Tell us about your project...',
      privacyAgree: 'I agree with',
      privacyPolicy: 'privacy policy',
      userAgreement: 'terms of service',
      sendSuccess: 'Message sent!',
      sendSuccessDesc: 'We will contact you shortly.',
      sendError: 'Sending error',
      sendErrorDesc: 'Please try again later.'
    },
    technologies: {
      title: 'Our Technologies',
      subtitle: 'Modern tools for creating the best solutions'
    },
    footer: {
      company: 'Company',
      services: 'Services',
      legal: 'Legal Information',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      rights: 'All rights reserved.'
    },
    modal: {
      topProject: 'Top Project',
      projectDescription: 'Project Description',
      technologies: 'Technologies',
      technologiesCount: 'technologies',
      viewDemo: 'View Demo',
      dateNotSpecified: 'Date not specified'
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Protection and processing of personal data at HNS',
      backToHome: 'Back to Home',
      lastUpdated: 'Last updated'
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Terms and conditions for using HNS services',
      backToHome: 'Back to Home',
      lastUpdated: 'Last updated'
    }
  }
};