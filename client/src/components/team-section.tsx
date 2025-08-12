import { motion } from 'framer-motion';
import { Code, Palette, Link2, Linkedin, Github, Twitter } from 'lucide-react';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';

const teamMembers = [
  {
    name: 'Алексей Волков',
    position: 'CTO & Lead Developer',
    bio: '10+ лет в разработке 3D веб-приложений. Эксперт в WebGL и Three.js. Создатель множества инновационных решений.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    icon: Code,
    socials: {
      linkedin: '#',
      github: '#',
      twitter: '#',
    },
  },
  {
    name: 'Мария Петрова',
    position: 'Lead UX/UI Designer',
    bio: 'Специалист по созданию интуитивных интерфейсов. Эксперт в области 3D дизайна и пользовательского опыта.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    icon: Palette,
    socials: {
      linkedin: '#',
      github: '#',
      twitter: '#',
    },
  },
  {
    name: 'Дмитрий Ковалев',
    position: 'Blockchain Developer',
    bio: 'Архитектор децентрализованных решений. Специализируется на Web3 технологиях и умных контрактах.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    icon: Link2,
    socials: {
      linkedin: '#',
      github: '#',
      twitter: '#',
    },
  },
];

export function TeamSection() {
  const { elementRef, hasTriggered } = useScrollTrigger();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section ref={elementRef} id="team" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-light mb-6 text-3d">
            Наша <span className="text-neon-cyan">Команда</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Эксперты, создающие технологии будущего
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={hasTriggered ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                y: -5,
              }}
              transition={{ duration: 0.3 }}
              className="glass-morphism rounded-3xl p-8 text-center group hover:shadow-lg hover:shadow-neon-cyan/10"
            >
              <div className="relative mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="w-32 h-32 mx-auto rounded-2xl overflow-hidden group-hover:shadow-lg group-hover:shadow-neon-cyan/20 transition-shadow duration-300"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-neon-cyan rounded-full flex items-center justify-center"
                >
                  <member.icon className="w-4 h-4 text-deep-black" />
                </motion.div>
              </div>
              
              <h3 className="text-2xl font-medium mb-2">{member.name}</h3>
              <p className="text-neon-cyan mb-4 font-medium">{member.position}</p>
              <p className="text-gray-400 text-sm mb-6">{member.bio}</p>
              
              <div className="flex justify-center space-x-4">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  href={member.socials.linkedin}
                  className="w-10 h-10 glass-morphism rounded-full flex items-center justify-center hover:bg-neon-cyan/20 transition-all"
                >
                  <Linkedin className="w-4 h-4 text-neon-cyan" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  href={member.socials.github}
                  className="w-10 h-10 glass-morphism rounded-full flex items-center justify-center hover:bg-neon-cyan/20 transition-all"
                >
                  <Github className="w-4 h-4 text-neon-cyan" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  href={member.socials.twitter}
                  className="w-10 h-10 glass-morphism rounded-full flex items-center justify-center hover:bg-neon-cyan/20 transition-all"
                >
                  <Twitter className="w-4 h-4 text-neon-cyan" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
