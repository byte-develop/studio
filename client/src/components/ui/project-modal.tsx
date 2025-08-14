import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Calendar, Tag } from "lucide-react";
import { type PortfolioProject } from "@shared/schema";

interface ProjectModalProps {
  project: PortfolioProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/10">
              
              {/* Header with Image */}
              <div className="relative">
                <div className="h-64 md:h-80 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop&crop=entropy&auto=format&q=75`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors group"
                  data-testid="button-close-modal"
                >
                  <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm rounded-full text-white text-xs font-medium shadow-lg">
                      ⭐ Топ проект
                    </div>
                  </div>
                )}

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2" data-testid="text-project-title">
                    {project.title}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
                
                {/* Project Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Calendar className="w-5 h-5 text-neon-cyan" />
                    <span className="text-sm">
                      {project.createdAt ? new Date(project.createdAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Дата не указана'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-slate-300">
                    <Tag className="w-5 h-5 text-neon-purple" />
                    <span className="text-sm">{project.technologies.length} технологий</span>
                  </div>
                  

                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Описание проекта</h3>
                  <p className="text-slate-300 leading-relaxed text-lg" data-testid="text-project-description">
                    {project.description}
                  </p>
                </div>

                {/* Technologies */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Технологии</h3>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-white/10 rounded-full text-white text-sm hover:border-neon-cyan/30 transition-colors"
                        data-testid={`tech-${tech.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                {project.link && project.link !== "#" && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => window.open(project.link || '', '_blank')}
                      className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-xl text-white font-medium hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
                      data-testid="button-view-demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Посмотреть демо
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}