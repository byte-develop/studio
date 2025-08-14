import { motion } from 'framer-motion';
import { Box, Globe, Smartphone, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';
import { useEffect } from 'react';

export default function WebDevelopmentPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const features = [
    "Адаптивный дизайн для всех устройств",
    "Высокая производительность и SEO оптимизация", 
    "Современные технологии и фреймворки",
    "Интеграция с базами данных и API",
    "Безопасность и защита данных",
    "Поддержка и обновления после запуска"
  ];

  const technologies = [
    { name: "React", description: "Современная библиотека для создания пользовательских интерфейсов" },
    { name: "Vue.js", description: "Прогрессивный фреймворк для создания веб-приложений" },
    { name: "Next.js", description: "Полнофункциональный React фреймворк для продакшена" },
    { name: "TypeScript", description: "Типизированный JavaScript для больших проектов" },
    { name: "Node.js", description: "Серверная платформа для JavaScript" },
    { name: "MongoDB/PostgreSQL", description: "Современные базы данных для хранения данных" }
  ];



  return (
    <div className="min-h-screen bg-black text-white">
      {/* Навигация */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-neon-cyan cursor-pointer"
              >
                VERTEX Studio
              </motion.div>
            </Link>
            <Link href="/#services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-2 bg-neon-cyan/10 text-neon-cyan rounded-lg hover:bg-neon-cyan/20 transition-colors"
              >
                Назад к услугам
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Герой секция */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="w-24 h-24 bg-neon-cyan/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Box className="w-12 h-12 text-neon-cyan" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-neon-cyan to-white bg-clip-text text-transparent">
              Веб-Разработка
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed">
              Создаем современные веб-приложения от простых лендингов до сложных корпоративных систем 
              с использованием передовых технологий и лучших практик разработки
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 bg-neon-cyan text-black rounded-lg font-semibold"
              >
                От 150 000 ₽
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 bg-neon-cyan/10 text-neon-cyan rounded-lg border border-neon-cyan/30"
              >
                Срок: 2-8 недель
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Что вы получите
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <CheckCircle className="w-6 h-6 text-neon-cyan flex-shrink-0 mt-1" />
                <p className="text-gray-300">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Технологии */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Технологии и инструменты
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-morphism p-6 rounded-2xl"
              >
                <h3 className="text-xl font-semibold mb-3 text-neon-cyan">{tech.name}</h3>
                <p className="text-gray-400">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA секция */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Готовы начать проект?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Обсудим ваши задачи и предложим оптимальное решение для вашего бизнеса
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-neon-cyan text-black rounded-lg font-semibold text-lg"
                >
                  Обсудить проект
                </motion.button>
              </Link>
              
              <Link href="/#services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-neon-cyan/10 text-neon-cyan rounded-lg border border-neon-cyan/30 font-semibold text-lg"
                >
                  Другие услуги
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}