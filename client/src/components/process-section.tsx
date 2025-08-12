import { motion } from 'framer-motion';
import { Search, PenTool, Code, Rocket } from 'lucide-react';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';

const processSteps = [
  {
    number: '01',
    title: 'Анализ и Планирование',
    description: 'Глубокое изучение требований, создание технического задания и архитектуры проекта',
    icon: Search,
    side: 'left',
  },
  {
    number: '02',
    title: 'Дизайн и Прототипирование',
    description: 'Создание UX/UI дизайна, интерактивных прототипов и 3D концепций',
    icon: PenTool,
    side: 'right',
  },
  {
    number: '03',
    title: 'Разработка',
    description: 'Программирование функционала, интеграция 3D элементов и создание API',
    icon: Code,
    side: 'left',
  },
  {
    number: '04',
    title: 'Тестирование и Запуск',
    description: 'Комплексное тестирование, оптимизация производительности и развертывание',
    icon: Rocket,
    side: 'right',
  },
];

export function ProcessSection() {
  const { elementRef, hasTriggered } = useScrollTrigger();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section ref={elementRef} id="process" className="py-16 md:py-24 lg:py-32 relative bg-dark-gray">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-3d">
            Процесс <span className="text-neon-cyan">Разработки</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Структурированный подход к созданию инновационных решений
          </p>
        </motion.div>

        <div className="relative">
          {/* Central Timeline - Hidden on mobile */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-neon-cyan via-neon-cyan/50 to-transparent"></div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={hasTriggered ? "visible" : "hidden"}
            className="space-y-12 lg:space-y-24"
          >
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="flex flex-col lg:flex-row items-center lg:items-center"
              >
                {/* Mobile Layout - Single Column */}
                <div className="lg:hidden w-full">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-morphism p-6 rounded-3xl floating-card"
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="w-12 h-12 bg-neon-cyan rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <step.icon className="w-5 h-5 text-deep-black" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-medium mb-2 text-neon-cyan">
                          {step.number}. {step.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Desktop Layout - Timeline */}
                <div className="hidden lg:flex w-full items-center">
                  {step.side === 'left' ? (
                    <>
                      <div className="w-1/2 pr-12 text-right">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="glass-morphism p-8 rounded-3xl floating-card"
                        >
                          <h3 className="text-2xl font-medium mb-4 text-neon-cyan">
                            {step.number}. {step.title}
                          </h3>
                          <p className="text-gray-300">{step.description}</p>
                        </motion.div>
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          className="w-16 h-16 bg-neon-cyan rounded-full flex items-center justify-center"
                        >
                          <step.icon className="w-6 h-6 text-deep-black" />
                        </motion.div>
                      </div>
                      <div className="w-1/2 pl-12"></div>
                    </>
                  ) : (
                    <>
                      <div className="w-1/2 pr-12"></div>
                      <div className="absolute left-1/2 transform -translate-x-1/2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          className="w-16 h-16 bg-neon-cyan rounded-full flex items-center justify-center"
                        >
                          <step.icon className="w-6 h-6 text-deep-black" />
                        </motion.div>
                      </div>
                      <div className="w-1/2 pl-12">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="glass-morphism p-8 rounded-3xl floating-card"
                        >
                          <h3 className="text-2xl font-medium mb-4 text-neon-cyan">
                            {step.number}. {step.title}
                          </h3>
                          <p className="text-gray-300">{step.description}</p>
                        </motion.div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
