import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="py-8 md:py-12 lg:py-16 relative border-t border-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="text-3xl font-jetbrains-mono font-bold text-neon-cyan mb-4">
            HNS Studio
          </div>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Создаем будущее цифровых технологий сегодня
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-gray-500">
            <p className="text-center">&copy; 2024 HNS Studio (Hidden Network Service). Все права защищены.</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
              <motion.a
                href="#"
                whileHover={{ color: '#00ffff' }}
                className="transition-colors text-center hover:underline"
              >
                Политика конфиденциальности
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ color: '#00ffff' }}
                className="transition-colors text-center hover:underline"
              >
                Пользовательское соглашение
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
