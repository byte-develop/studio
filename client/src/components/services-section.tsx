import { motion } from 'framer-motion';
import { Box, Smartphone, Brain, Cloud, Shield, Rocket } from 'lucide-react';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';
import { Link } from 'wouter';

const services = [
  {
    icon: Box,
    title: 'Веб-Разработка',
    description: 'Создание современных веб-приложений от лендингов до сложных корпоративных систем',
    technologies: ['React', 'Vue.js', 'Next.js'],
    link: '/services/web-development',
  },
  {
    icon: Brain,
    title: '3D и WebGL',
    description: 'Интерактивные 3D веб-приложения, игры и визуализации с использованием передовых технологий',
    technologies: ['Three.js', 'WebGL', 'Babylon.js'],
    link: '/services/3d-webgl',
  },
  {
    icon: Smartphone,
    title: 'Мобильная Разработка',
    description: 'Нативные и кроссплатформенные мобильные приложения с современным UX',
    technologies: ['React Native', 'Flutter', 'iOS/Android'],
    link: '/services/mobile-development',
  },
  {
    icon: Cloud,
    title: 'Backend & API',
    description: 'Надежные серверные решения, микросервисы и RESTful API',
    technologies: ['Node.js', 'Python', 'PostgreSQL'],
    link: '/services/backend-api',
  },
  {
    icon: Shield,
    title: 'ИИ и ML',
    description: 'Внедрение машинного обучения и искусственного интеллекта в бизнес-процессы',
    technologies: ['TensorFlow', 'OpenAI', 'Computer Vision'],
    link: '/services/ai-ml',
  },
  {
    icon: Rocket,
    title: 'DevOps & Cloud',
    description: 'Автоматизация развертывания, мониторинг и масштабирование в облаке',
    technologies: ['AWS', 'Docker', 'CI/CD'],
    link: '/services/devops-cloud',
  },
];

export function ServicesSection() {
  const { elementRef, hasTriggered } = useScrollTrigger();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section ref={elementRef} id="services" className="py-16 md:py-24 lg:py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-3d">
            Наши <span className="text-neon-cyan">Услуги</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Полный спектр разработки от концепции до запуска
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={hasTriggered ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                y: -5,
              }}
              transition={{ duration: 0.3 }}
              className="glass-morphism p-6 lg:p-8 rounded-3xl group cursor-pointer hover:shadow-lg hover:shadow-neon-cyan/10"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 bg-neon-cyan/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-neon-cyan/20 transition-colors duration-300"
              >
                <service.icon className="w-8 h-8 text-neon-cyan" />
              </motion.div>
              
              <h3 className="text-2xl font-medium mb-4">{service.title}</h3>
              <p className="text-gray-400 mb-6">{service.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {service.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-neon-cyan/10 text-neon-cyan rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <Link href={service.link}>
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center text-neon-cyan transition-transform cursor-pointer"
                >
                  <span className="mr-2">Подробнее</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
