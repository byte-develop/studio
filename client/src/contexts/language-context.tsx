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
      title: 'Создаем цифровые решения будущего',
      subtitle: 'Современная веб-студия, специализирующаяся на передовых технологиях и инновационных решениях',
      getStarted: 'Начать проект',
      ourWork: 'Наши работы'
    },
    portfolio: {
      title: 'Наше Портфолио',
      subtitle: 'Проекты, которыми мы гордимся',
      viewProject: 'Посмотреть проект',
      technologies: 'Технологии'
    },
    team: {
      title: 'Наша Команда',
      subtitle: 'Опытные специалисты которые воплощают ваши идеи в реальность'
    },
    process: {
      title: 'Наш Процесс',
      subtitle: 'От идеи до готового продукта',
      step1: 'Анализ',
      step1Desc: 'Изучаем вашу бизнес задачу и целевую аудиторию',
      step2: 'Планирование',
      step2Desc: 'Создаем детальный план разработки и архитектуру',
      step3: 'Разработка',
      step3Desc: 'Воплощаем решение с постоянным контролем качества',
      step4: 'Запуск',
      step4Desc: 'Разворачиваем и обеспечиваем надежную работу'
    },
    contact: {
      title: 'Связаться с Нами',
      subtitle: 'Готовы обсудить ваш проект?',
      name: 'Имя',
      email: 'Email',
      company: 'Компания',
      message: 'Сообщение',
      send: 'Отправить'
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
      title: 'Creating digital solutions of the future',
      subtitle: 'Modern web studio specializing in cutting-edge technologies and innovative solutions',
      getStarted: 'Start Project',
      ourWork: 'Our Work'
    },
    portfolio: {
      title: 'Our Portfolio',
      subtitle: 'Projects we are proud of',
      viewProject: 'View Project',
      technologies: 'Technologies'
    },
    team: {
      title: 'Our Team',
      subtitle: 'Experienced specialists who bring your ideas to life'
    },
    process: {
      title: 'Our Process',
      subtitle: 'From idea to ready product',
      step1: 'Analysis',
      step1Desc: 'We study your business challenge and target audience',
      step2: 'Planning',
      step2Desc: 'Create detailed development plan and architecture',
      step3: 'Development',
      step3Desc: 'Implement solution with constant quality control',
      step4: 'Launch',
      step4Desc: 'Deploy and ensure reliable operation'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Ready to discuss your project?',
      name: 'Name',
      email: 'Email',
      company: 'Company',
      message: 'Message',
      send: 'Send'
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
    }
  }
};