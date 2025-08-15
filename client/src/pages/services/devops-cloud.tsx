import { motion } from 'framer-motion';
import { Rocket, Server, Shield, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';
import { useEffect } from 'react';

export default function DevOpsCloudPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const features = [
    "CI/CD автоматизация развертывания",
    "Контейнеризация с Docker и Kubernetes",
    "Мониторинг и логирование системы", 
    "Масштабирование в облачных сервисах",
    "Безопасность инфраструктуры",
    "Бэкапы и восстановление данных"
  ];

  const technologies = [
    { name: "AWS", description: "Полный спектр облачных сервисов Amazon Web Services" },
    { name: "Docker", description: "Контейнеризация приложений для удобного развертывания" },
    { name: "CI/CD", description: "Автоматическая интеграция и развертывание кода" },
    { name: "Kubernetes", description: "Оркестрация контейнеров для масштабируемых приложений" },
    { name: "Terraform", description: "Инфраструктура как код для управления ресурсами" },
    { name: "Grafana", description: "Мониторинг и визуализация метрик приложений" }
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
                className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-blue-400 bg-clip-text text-transparent cursor-pointer font-jetbrains-mono tracking-wide"
              >
                HNS
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
              <Rocket className="w-12 h-12 text-neon-cyan" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-neon-cyan to-white bg-clip-text text-transparent">
              DevOps & Cloud
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed">
              Автоматизируем развертывание, настраиваем мониторинг и обеспечиваем 
              масштабирование в облачных сервисах
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 bg-neon-cyan text-black rounded-lg font-semibold"
              >
                От 120 000 ₽
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
            Возможности DevOps решений
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
            DevOps технологии и инструменты
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
              Оптимизируем вашу инфраструктуру
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Настроим автоматизацию и мониторинг для стабильной работы ваших сервисов
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