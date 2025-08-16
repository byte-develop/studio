import { motion } from 'framer-motion';
import { HeroScene } from './three/hero-scene';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';
import { useLanguage } from '@/contexts/language-context';

export function HeroSection() {
  const { elementRef } = useScrollTrigger();
  const { t } = useLanguage();

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const scrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={elementRef}
      id="hero"
      className="min-h-screen flex items-center justify-center relative hero-bg overflow-hidden"
    >
      {/* Background removed - no more floating particles */}

      {/* 3D Scene */}
      <HeroScene />

      {/* Central Morphing Element */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 glass-morphism rounded-full animate-morph relative">
          <div className="absolute inset-2 md:inset-4 bg-gradient-to-r from-neon-cyan/20 to-transparent rounded-full animate-rotate-slow"></div>
          <div className="absolute inset-4 md:inset-8 border border-neon-cyan/30 rounded-full animate-glow"></div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 relative z-10 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="hero-content text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light mb-6 text-3d"
        >
          <motion.span
            className="block"
          >
            {t('hero.title').split(' ')[0]}
          </motion.span>
          <motion.span
            className="block text-neon-cyan"
          >
            {t('hero.title').split(' ')[1]}
          </motion.span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="hero-content text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToServices}
            className="glass-morphism px-8 py-4 rounded-full hover:bg-neon-cyan/10 transition-all duration-300 group"
          >
            <span className="group-hover:text-neon-cyan transition-colors">
              {t('hero.ourWork')}
            </span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToContact}
            className="border border-neon-cyan px-8 py-4 rounded-full hover:bg-neon-cyan hover:text-deep-black transition-all duration-300"
          >
            {t('hero.getStarted')}
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
