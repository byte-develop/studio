import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';
import { useQuery } from '@tanstack/react-query';
import type { PortfolioProject } from '@shared/schema';

export function PortfolioSection() {
  const { elementRef, hasTriggered } = useScrollTrigger();
  
  // Загружаем данные портфолио из базы данных
  const { data: portfolioItems = [], isLoading } = useQuery<PortfolioProject[]>({
    queryKey: ['/api/portfolio-projects'],
  });

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
    <section ref={elementRef} id="portfolio" className="py-16 md:py-24 lg:py-32 relative bg-dark-gray">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-3d">
            Наше <span className="text-neon-cyan">Портфолио</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Проекты, которые определяют будущее цифровых технологий
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
            <p className="mt-4 text-gray-400">Загружаем проекты...</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={hasTriggered ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            {portfolioItems.filter(item => item.featured).map((project, index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="floating-card group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-3xl glass-morphism h-64 md:h-80 mb-4 md:mb-6">
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
                    Портфолио
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
        )}

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
