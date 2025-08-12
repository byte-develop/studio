import { motion } from 'framer-motion';
import { Code2, Palette, Server, Shield, Brain, Smartphone, Globe, Database } from 'lucide-react';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';

export function TeamSection() {
  const { elementRef, hasTriggered } = useScrollTrigger();

  const competencies = [
    {
      title: "Frontend разработка",
      description: "Создаем современные интерфейсы с использованием React, Vue, Angular",
      icon: Code2,
      technologies: ["React", "TypeScript", "Next.js", "Vue.js", "Tailwind"],
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "UI/UX Дизайн",
      description: "Проектируем интуитивные пользовательские интерфейсы и опыт",
      icon: Palette,
      technologies: ["Figma", "Adobe XD", "Sketch", "Prototyping", "Design Systems"],
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Backend разработка",
      description: "Строим надежные серверные решения и API",
      icon: Server,
      technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Redis"],
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: "DevOps и инфраструктура",
      description: "Автоматизируем развертывание и обеспечиваем стабильность",
      icon: Shield,
      technologies: ["Docker", "Kubernetes", "AWS", "CI/CD", "Monitoring"],
      color: "from-orange-500/20 to-red-500/20"
    },
    {
      title: "Мобильная разработка",
      description: "Разрабатываем кроссплатформенные мобильные приложения",
      icon: Smartphone,
      technologies: ["React Native", "Flutter", "iOS", "Android", "Expo"],
      color: "from-indigo-500/20 to-blue-500/20"
    },
    {
      title: "Веб-разработка",
      description: "Создаем полнофункциональные веб-приложения",
      icon: Globe,
      technologies: ["Full-stack", "JAMstack", "PWA", "SSR", "SPA"],
      color: "from-teal-500/20 to-cyan-500/20"
    },
    {
      title: "Базы данных",
      description: "Проектируем и оптимизируем структуры данных",
      icon: Database,
      technologies: ["PostgreSQL", "MongoDB", "Redis", "GraphQL", "Prisma"],
      color: "from-violet-500/20 to-purple-500/20"
    },
    {
      title: "AI/ML интеграция",
      description: "Интегрируем искусственный интеллект в проекты",
      icon: Brain,
      technologies: ["OpenAI", "TensorFlow", "PyTorch", "ML APIs", "AutoML"],
      color: "from-yellow-500/20 to-orange-500/20"
    }
  ];

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
            Наши <span className="text-neon-cyan">Компетенции</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Полный спектр технологических решений для цифровой трансформации вашего бизнеса
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={hasTriggered ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {competencies.map((competency, index) => (
            <motion.div
              key={competency.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                y: -5,
              }}
              transition={{ duration: 0.3 }}
              className="glass-morphism rounded-3xl p-6 lg:p-8 text-center group hover:shadow-lg hover:shadow-neon-cyan/10 relative overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${competency.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotateY: 180 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mx-auto mb-6 bg-neon-cyan/10 rounded-2xl flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors duration-300"
                >
                  <competency.icon className="w-8 h-8 text-neon-cyan" />
                </motion.div>
                
                <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-neon-cyan transition-colors duration-300">
                  {competency.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {competency.description}
                </p>
                
                {/* Technologies */}
                <div className="flex flex-wrap justify-center gap-2">
                  {competency.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-neon-cyan/10 text-neon-cyan rounded-lg border border-neon-cyan/20 group-hover:bg-neon-cyan/20 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="glass-morphism rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-light mb-6 text-3d">
              Команда <span className="text-neon-cyan">профессионалов</span>
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Наша команда состоит из опытных специалистов с многолетним стажем разработки. 
              Мы объединяем глубокие технические знания с креативным подходом для создания 
              инновационных решений, которые превосходят ожидания клиентов.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-light text-neon-cyan mb-2">50+</div>
                <div className="text-gray-400 text-sm">Проектов реализовано</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-neon-cyan mb-2">5+</div>
                <div className="text-gray-400 text-sm">Лет опыта</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-neon-cyan mb-2">20+</div>
                <div className="text-gray-400 text-sm">Технологий</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-neon-cyan mb-2">24/7</div>
                <div className="text-gray-400 text-sm">Поддержка</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}