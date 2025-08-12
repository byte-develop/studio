import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="py-16 relative border-t border-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotateZ: 360 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-jetbrains-mono font-bold text-neon-cyan mb-4 cursor-pointer"
          >
            VERTEX
          </motion.div>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Создаем будущее цифровых технологий сегодня
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <p>&copy; 2024 VERTEX Studio. Все права защищены.</p>
            <motion.a
              href="#"
              whileHover={{ color: '#00ffff' }}
              className="transition-colors"
            >
              Политика конфиденциальности
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ color: '#00ffff' }}
              className="transition-colors"
            >
              Пользовательское соглашение
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
