import { motion } from 'framer-motion';
import { HeroScene } from './three/hero-scene';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';

export function HeroSection() {
  const { elementRef } = useScrollTrigger();

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

      {/* Removed Central Morphing Element with spinning rings */}

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
            ПЕРЕДОВАЯ
          </motion.span>
          <motion.span
            className="block text-neon-cyan"
          >
            РАЗРАБОТКА
          </motion.span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="hero-content text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto"
        >
          Превращаем идеи в революционные цифровые продукты с помощью инновационных технологий и креативного подхода
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
              Посмотреть проекты
            </span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToContact}
            className="border border-neon-cyan px-8 py-4 rounded-full hover:bg-neon-cyan hover:text-deep-black transition-all duration-300"
          >
            Связаться с нами
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
