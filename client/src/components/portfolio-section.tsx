import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';

const portfolioItems = [
  {
    title: 'Корпоративная CRM Система',
    description: 'Полнофункциональная система управления клиентами с интерактивной аналитикой и автоматизацией',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    category: 'Web App',
  },
  {
    title: 'E-commerce Платформа',
    description: 'Масштабируемый интернет-магазин с микросервисной архитектурой и современным UI/UX',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['Vue.js', 'Python', 'Redis'],
    category: 'E-commerce',
  },
  {
    title: '3D Визуализатор Недвижимости',
    description: 'Интерактивная платформа для просмотра объектов недвижимости с WebGL и виртуальными турами',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['Three.js', 'WebGL', 'TypeScript'],
    category: '3D/WebGL',
  },
  {
    title: 'Мобильное Фитнес Приложение',
    description: 'Кроссплатформенное приложение для фитнеса с AI тренером и социальными функциями',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['Flutter', 'Firebase', 'TensorFlow'],
    category: 'Mobile App',
  },
];

export function PortfolioSection() {
  const { elementRef, hasTriggered } = useScrollTrigger();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section ref={elementRef} id="portfolio" className="py-32 relative bg-dark-gray">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-light mb-6 text-3d">
            Наше <span className="text-neon-cyan">Портфолио</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Проекты, которые определяют будущее цифровых технологий
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={hasTriggered ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {portfolioItems.map((project, index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="floating-card group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-3xl glass-morphism h-80 mb-6">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.7 }}
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-t from-neon-cyan/20 to-transparent"
                />
                <div className="absolute top-4 right-4 glass-morphism px-4 py-2 rounded-full">
                  <span className="text-neon-cyan text-sm font-medium">
                    {project.category}
                  </span>
                </div>
              </div>
              
              <h3 className="text-2xl font-medium mb-3">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-neon-cyan/10 text-neon-cyan rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-center text-neon-cyan transition-transform"
              >
                <span className="mr-2">Посмотреть проект</span>
                <ExternalLink className="w-4 h-4" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="glass-morphism px-8 py-4 rounded-full hover:bg-neon-cyan/10 transition-all duration-300 group"
          >
            <span className="group-hover:text-neon-cyan transition-colors">
              Посмотреть все проекты
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
