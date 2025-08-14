import { motion } from 'framer-motion';
import { Code2, Palette, Server, Shield, Brain, Users, Target, Lightbulb, Monitor, Smartphone, Settings } from 'lucide-react';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';
import { useQuery } from '@tanstack/react-query';
import type { TeamRole } from '@shared/schema';

export function TeamSection() {
  const { elementRef, hasTriggered } = useScrollTrigger();

  // Загружаем данные команды из базы данных
  const { data: teamStructure = [], isLoading } = useQuery<TeamRole[]>({
    queryKey: ['/api/team-roles'],
  });

  // Карта иконок для рендеринга
  const iconMap: Record<string, any> = {
    Monitor, Code2, Palette, Server, Shield, Brain, Users, Target, Lightbulb, Smartphone, Settings
  };

  // Карта градиентов для цветов
  const colorGradients: Record<string, string> = {
    blue: "from-blue-500/20 to-cyan-500/20",
    green: "from-green-500/20 to-emerald-500/20", 
    purple: "from-purple-500/20 to-pink-500/20",
    orange: "from-orange-500/20 to-red-500/20",
    red: "from-red-500/20 to-pink-500/20",
    yellow: "from-yellow-500/20 to-orange-500/20",
    pink: "from-pink-500/20 to-purple-500/20",
    gray: "from-gray-500/20 to-slate-500/20"
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
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
    <section ref={elementRef} id="team" className="py-16 md:py-24 lg:py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-3d">
            Структура <span className="text-neon-cyan">Команды</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Сплоченная команда профессионалов с четким распределением ролей и ответственности
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
            <p className="mt-4 text-gray-400">Загружаем данные команды...</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={hasTriggered ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {teamStructure.map((role, index) => {
              const IconComponent = iconMap[role.icon] || Users;
              return (
              <motion.div
                key={role.title}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  y: -5,
                }}
                transition={{ duration: 0.3 }}
                className="glass-morphism rounded-3xl p-6 lg:p-8 text-center group hover:shadow-lg hover:shadow-neon-cyan/10 relative overflow-hidden"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colorGradients[role.color] || colorGradients.blue} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Count badge */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-neon-cyan rounded-full flex items-center justify-center text-deep-black font-semibold text-sm">
                    {role.count}
                  </div>

                  <div
                    className="w-16 h-16 mx-auto mb-6 bg-neon-cyan/10 rounded-2xl flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors duration-300"
                  >
                    <IconComponent className="w-8 h-8 text-neon-cyan" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-neon-cyan transition-colors duration-300">
                    {role.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </motion.div>
            );
            })}
          </motion.div>
        )}

        {/* Team philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="glass-morphism rounded-3xl p-8 lg:p-12 max-w-5xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-light mb-6 text-3d">
              Наша <span className="text-neon-cyan">философия работы</span>
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Мы верим в силу командной работы и четкого распределения ролей. Каждый участник команды 
              является экспертом в своей области и вносит уникальный вклад в успех проекта. 
              Прозрачная коммуникация и взаимная поддержка - основа нашего подхода.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-neon-cyan/10 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-neon-cyan" />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-neon-cyan">Командная работа</h4>
                <p className="text-gray-400 text-sm">Синергия экспертов разных областей</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-neon-cyan/10 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-neon-cyan" />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-neon-cyan">Фокус на качестве</h4>
                <p className="text-gray-400 text-sm">Каждый элемент проходит строгий контроль</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-neon-cyan/10 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-neon-cyan" />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-neon-cyan">Инновации</h4>
                <p className="text-gray-400 text-sm">Постоянно изучаем новые технологии</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}