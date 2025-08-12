import { motion } from 'framer-motion';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';

const technologies = [
  { name: 'React', icon: '⚛️', color: 'from-blue-400 to-cyan-400' },
  { name: 'Vue.js', icon: '💚', color: 'from-emerald-400 to-green-400' },
  { name: 'Next.js', icon: '▲', color: 'from-gray-400 to-white' },
  { name: 'TypeScript', icon: '📘', color: 'from-blue-400 to-indigo-400' },
  { name: 'Node.js', icon: '🟢', color: 'from-green-400 to-emerald-400' },
  { name: 'Python', icon: '🐍', color: 'from-blue-400 to-yellow-400' },
  { name: 'Three.js', icon: '🎲', color: 'from-yellow-400 to-orange-400' },
  { name: 'WebGL', icon: '🌐', color: 'from-purple-400 to-pink-400' },
  { name: 'PostgreSQL', icon: '🐘', color: 'from-blue-400 to-teal-400' },
  { name: 'MongoDB', icon: '🍃', color: 'from-green-400 to-teal-400' },
  { name: 'AWS', icon: '☁️', color: 'from-orange-400 to-yellow-400' },
  { name: 'Docker', icon: '🐳', color: 'from-blue-400 to-purple-400' },
  { name: 'Kubernetes', icon: '⚓', color: 'from-blue-400 to-cyan-400' },
  { name: 'Redis', icon: '🔴', color: 'from-red-400 to-pink-400' },
  { name: 'GraphQL', icon: '◆', color: 'from-pink-400 to-purple-400' },
  { name: 'TensorFlow', icon: '🧠', color: 'from-orange-400 to-red-400' },
  { name: 'Flutter', icon: '🐦', color: 'from-blue-400 to-teal-400' },
  { name: 'Swift', icon: '🍎', color: 'from-orange-400 to-red-400' },
  { name: 'Kotlin', icon: '🤖', color: 'from-purple-400 to-blue-400' },
  { name: 'Rust', icon: '🦀', color: 'from-orange-400 to-red-400' },
  { name: 'Go', icon: '🐹', color: 'from-cyan-400 to-blue-400' },
  { name: 'Figma', icon: '🎨', color: 'from-purple-400 to-pink-400' },
  { name: 'Blender', icon: '🌀', color: 'from-orange-400 to-yellow-400' },
  { name: 'Unity', icon: '🎮', color: 'from-gray-400 to-black' },
];

export function TechnologiesSection() {
  const { elementRef, hasTriggered } = useScrollTrigger();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section ref={elementRef} id="technologies" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-light mb-6 text-3d">
            Наши <span className="text-neon-cyan">Технологии</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Передовой стек технологий для создания инновационных решений
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={hasTriggered ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8"
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -5,
              }}
              transition={{ duration: 0.3 }}
              className="glass-morphism p-6 rounded-2xl group text-center cursor-pointer hover:shadow-lg hover:shadow-neon-cyan/10"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 mx-auto mb-4 bg-neon-cyan/10 rounded-xl flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors duration-300"
              >
                <span className="text-3xl">{tech.icon}</span>
              </motion.div>
              <h4 className="font-medium text-sm group-hover:text-neon-cyan transition-colors">
                {tech.name}
              </h4>

            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
