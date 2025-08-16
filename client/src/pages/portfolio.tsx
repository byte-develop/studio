import { motion } from 'framer-motion';
import { ExternalLink, ArrowLeft, Filter, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProjectModal } from '@/components/ui/project-modal';
import type { PortfolioProject } from '@shared/schema';

export function PortfolioPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Загружаем данные портфолио из базы данных
  const { data: portfolioItems = [], isLoading } = useQuery<PortfolioProject[]>({
    queryKey: ['/api/portfolio-projects'],
  });

  // Получаем все уникальные технологии для фильтрации
  const allTechnologies = Array.from(
    new Set(portfolioItems.flatMap(project => project.technologies || []))
  ).sort();

  // Фильтрация проектов
  const filteredProjects = portfolioItems.filter(project => {
    const title = language === 'ru' ? (project.title_ru || project.title) : (project.title_en || project.title);
    const description = language === 'ru' ? (project.description_ru || project.description) : (project.description_en || project.description);
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTech = !selectedTech || (project.technologies && project.technologies.includes(selectedTech));
    return matchesSearch && matchesTech;
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
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-dark-gray pt-20">
      {/* Header */}
      <section className="relative py-16 bg-gradient-to-br from-dark-gray via-dark-gray to-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Link href="/#portfolio">
              <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('allPortfolio.backToSite')}
              </Button>
            </Link>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-3d">
              {t('allPortfolio.title').split(' ').slice(0, -1).join(' ')} <span className="text-neon-cyan">{t('allPortfolio.title').split(' ').slice(-1)[0]}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              {t('allPortfolio.subtitle')}
            </p>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-4xl mx-auto mb-12 space-y-6"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder={t('allPortfolio.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-gray-400 focus:border-neon-cyan focus:ring-neon-cyan/20 h-12"
              />
            </div>

            {/* Technology Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTech === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTech(null)}
                className={`${
                  selectedTech === null 
                    ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-white" 
                    : "bg-slate-800/50 border-slate-600/50 text-gray-400 hover:text-white hover:border-gray-400"
                }`}
              >
                <Filter className="w-3 h-3 mr-1" />
                {t('allPortfolio.allProjects')}
              </Button>
              {allTechnologies.map((tech) => (
                <Button
                  key={tech}
                  variant={selectedTech === tech ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                  className={`${
                    selectedTech === tech 
                      ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-white" 
                      : "bg-slate-800/50 border-slate-600/50 text-gray-400 hover:text-white hover:border-gray-400"
                  }`}
                >
                  {tech}
                </Button>
              ))}
            </div>

            {/* Results Counter */}
            <div className="text-center">
              <p className="text-gray-400">
                {filteredProjects.length === portfolioItems.length 
                  ? `${t('allPortfolio.projectsShown')} ${filteredProjects.length} ${t('allPortfolio.projects')}`
                  : `${t('allPortfolio.projectsFound')} ${filteredProjects.length} ${t('allPortfolio.of')} ${portfolioItems.length} ${t('allPortfolio.projects')}`}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
              <p className="mt-4 text-gray-400 text-lg">{t('allPortfolio.loading')}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('allPortfolio.noResults')}</h3>
              <p className="text-gray-400 mb-8">
                {t('allPortfolio.noResultsDesc')}
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTech(null);
                }}
                className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80"
              >
                {t('allPortfolio.resetFilters')}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="group cursor-pointer"
                  onClick={() => openProjectModal(project)}
                  data-testid={`card-project-${project.id}`}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-neon-cyan/40 transition-all duration-500 hover:shadow-2xl hover:shadow-neon-cyan/20 hover:scale-[1.02]">
                    
                    {/* Project Image */}
                    <div className="relative overflow-hidden h-48">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1517077304055-6e89abbf09b0' : '1551288049-50d5da3c24f1'}?w=600&h=400&fit=crop&crop=entropy&auto=format&q=75`;
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <motion.div
                        initial={{ opacity: 0.3 }}
                        whileHover={{ opacity: 0.7 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                      />
                      
                      {/* Featured Badge */}
                      {project.featured && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-white border-0 shadow-lg text-xs">
                            {t('allPortfolio.topProject')}
                          </Badge>
                        </div>
                      )}

                      {/* External Link Icon */}
                      {project.link && (
                        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <ExternalLink className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors duration-300 line-clamp-2">
                        {language === 'ru' ? (project.title_ru || project.title) : (project.title_en || project.title)}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                        {language === 'ru' ? (project.description_ru || project.description) : (project.description_en || project.description)}
                      </p>
                      
                      {/* Technologies */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="text-xs bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 text-neon-cyan border border-neon-cyan/30 hover:from-neon-cyan/30 hover:to-neon-purple/30 transition-all duration-300"
                              >
                                {tech}
                              </Badge>
                            ))}
                            {project.technologies.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-white/10 text-gray-400 border border-white/20">
                                +{project.technologies.length - 3}
                              </Badge>
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
                          whileHover={{ x: 3 }}
                          className="inline-flex items-center text-neon-cyan hover:text-white text-sm font-medium transition-all duration-300 group/link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="mr-2">{t('allPortfolio.openProject')}</span>
                          <ExternalLink className="w-3 h-3 transform group-hover/link:translate-x-1 transition-transform duration-300" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Load More Button (for future pagination) */}
          {filteredProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-16"
            >
              <p className="text-gray-400 mb-6">
                {t('allPortfolio.allProjectsShown')}
              </p>
              <Link href="/#portfolio">
                <Button 
                  className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80 px-8 py-3"
                >
                  {t('allPortfolio.backToMain')}
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeProjectModal}
      />
    </div>
  );
}