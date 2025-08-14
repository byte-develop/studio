import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';
import { useQuery } from '@tanstack/react-query';
import type { PortfolioProject } from '@shared/schema';
import { ProjectModal } from '@/components/ui/project-modal';
import { useState } from 'react';

export function PortfolioSection() {
  const { elementRef, hasTriggered } = useScrollTrigger();
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Загружаем данные портфолио из базы данных
  const { data: portfolioItems = [], isLoading } = useQuery<PortfolioProject[]>({
    queryKey: ['/api/portfolio-projects'],
  });

  const openProjectModal = (project: PortfolioProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 200);
  };

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
    <section ref={elementRef} id="portfolio" className="py-16 md:py-24 lg:py-32 relative bg-dark-gray">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-3d">
            Наше <span className="text-neon-cyan">Портфолио</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Проекты, которые определяют будущее цифровых технологий
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
            <p className="mt-4 text-gray-400">Загружаем проекты...</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={hasTriggered ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            {portfolioItems.filter(item => item.featured).map((project, index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="floating-card group cursor-pointer relative"
              onClick={() => openProjectModal(project)}
              data-testid={`card-project-${project.id}`}
            >
              <div className="relative overflow-hidden rounded-3xl glass-morphism bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-neon-cyan/30 transition-all duration-500 hover:shadow-2xl hover:shadow-neon-cyan/20">
                
                {/* Project Image */}
                <div className="relative overflow-hidden h-56 md:h-64">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop&crop=entropy&auto=format&q=75`;
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <motion.div
                    initial={{ opacity: 0.4 }}
                    whileHover={{ opacity: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                  />
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm rounded-full text-white text-xs font-medium shadow-lg">
                      ⭐ Топ проект
                    </div>
                  </div>

                  {/* External Link Icon */}
                  {project.link && (
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm md:text-base mb-6 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech, techIndex) => (
                          <motion.span 
                            key={tech}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: techIndex * 0.1 }}
                            className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 text-neon-cyan rounded-full border border-neon-cyan/30 backdrop-blur-sm hover:from-neon-cyan/30 hover:to-neon-purple/30 transition-all duration-300"
                          >
                            {tech}
                          </motion.span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="px-3 py-1.5 text-xs font-medium bg-white/10 text-gray-300 rounded-full border border-white/20">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Project Link */}
                  {project.link && (
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="inline-flex items-center text-neon-cyan hover:text-white font-medium transition-all duration-300 group/link"
                    >
                      <span className="mr-2">Посмотреть проект</span>
                      <ExternalLink className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300" />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.a
            href="/portfolio"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block glass-morphism px-8 py-4 rounded-full hover:bg-neon-cyan/10 transition-all duration-300 group cursor-pointer"
          >
            <span className="group-hover:text-neon-cyan transition-colors">
              Посмотреть все проекты
            </span>
          </motion.a>
        </motion.div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeProjectModal}
      />
    </section>
  );
}
