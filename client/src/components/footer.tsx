import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';
import { Link } from 'wouter';

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="py-8 md:py-12 lg:py-16 relative border-t border-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="text-4xl font-jetbrains-mono font-bold bg-gradient-to-r from-neon-cyan via-blue-400 to-neon-cyan bg-clip-text text-transparent mb-4 tracking-wider">
            HNS
          </div>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            {t('footer.description')}
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-gray-500">
            <p className="text-center">&copy; 2024 HNS (Hidden Network Service). {t('footer.rights')}</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
              <Link href="/privacy">
                <motion.span
                  whileHover={{ color: '#00ffff' }}
                  className="transition-colors text-center hover:underline cursor-pointer"
                >
                  {t('footer.privacy')}
                </motion.span>
              </Link>
              <Link href="/terms">
                <motion.span
                  whileHover={{ color: '#00ffff' }}
                  className="transition-colors text-center hover:underline cursor-pointer"
                >
                  {t('footer.terms')}
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
