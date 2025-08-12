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
      {/* Particle System Background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="particle animate-particle-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i}s`,
            }}
          />
        ))}
      </div>

      {/* 3D Scene */}
      <HeroScene />

      {/* Central Morphing Element */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 glass-morphism rounded-full animate-morph relative">
          <div className="absolute inset-4 bg-gradient-to-r from-neon-cyan/20 to-transparent rounded-full animate-rotate-slow"></div>
          <div className="absolute inset-8 border border-neon-cyan/30 rounded-full animate-glow"></div>
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
          className="text-6xl md:text-8xl font-light mb-6 text-3d"
        >
          <motion.span
            className="block animate-float"
            style={{ animationDelay: '0s' }}
          >
            ПЕРЕДОВАЯ
          </motion.span>
          <motion.span
            className="block animate-float text-neon-cyan"
            style={{ animationDelay: '0.5s' }}
          >
            РАЗРАБОТКА
          </motion.span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl font-light text-gray-300 mb-12 max-w-2xl mx-auto animate-float"
          style={{ animationDelay: '1s' }}
        >
          Превращаем идеи в революционные цифровые продукты с помощью инновационных технологий и креативного подхода
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center animate-float"
          style={{ animationDelay: '1.5s' }}
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToServices}
            className="glass-morphism px-8 py-4 rounded-full hover:bg-neon-cyan/10 transition-all duration-300 group"
          >
            <span className="group-hover:text-neon-cyan transition-colors">
              Посмотреть проекты
            </span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
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
