import { motion } from 'framer-motion';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/language-context';
import type { Technology } from '@shared/schema';
import * as LucideIcons from 'lucide-react';

export function TechnologiesSection() {
  const { elementRef, hasTriggered } = useScrollTrigger();
  const { t } = useLanguage();

  // Загружаем данные технологий из базы данных
  const { data: technologies = [], isLoading } = useQuery<Technology[]>({
    queryKey: ['/api/technologies'],
  });

  // Цветовые градиенты для разных категорий
  const categoryColors: Record<string, string> = {
    frontend: 'from-blue-400 to-cyan-400',
    backend: 'from-green-400 to-emerald-400',
    mobile: 'from-purple-400 to-pink-400',
    database: 'from-orange-400 to-yellow-400',
    devops: 'from-red-400 to-pink-400',
    design: 'from-pink-400 to-purple-400'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section ref={elementRef} id="technologies" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-light mb-6 text-3d">
            {t('technologies.title').split(' ').slice(0, -1).join(' ')} <span className="text-neon-cyan">{t('technologies.title').split(' ').slice(-1)[0]}</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('technologies.subtitle')}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
            <p className="mt-4 text-gray-400">{t('technologies.loading')}</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={hasTriggered ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8"
          >
            {technologies.map((tech, index) => {
              const IconComponent = (LucideIcons as any)[tech.icon] || LucideIcons.Code;
              return (
                <motion.div
                  key={tech.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                  }}
                  transition={{ duration: 0.3 }}
                  className="glass-morphism p-6 rounded-2xl group text-center cursor-pointer hover:shadow-lg hover:shadow-neon-cyan/10"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-16 h-16 mx-auto mb-4 bg-neon-cyan/10 rounded-xl flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors duration-300"
                  >
                    <IconComponent className="w-8 h-8 text-neon-cyan" />
                  </motion.div>
                  <h4 className="font-medium text-sm group-hover:text-neon-cyan transition-colors">
                    {tech.name}
                  </h4>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
