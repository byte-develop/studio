import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/language-context';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const isMobile = useIsMobile();
  const { language, setLanguage, t } = useLanguage();

  const services = [
    { title: t('services.webDevelopment'), link: '/services/web-development' },
    { title: t('services.3dWebgl'), link: '/services/3d-webgl' },
    { title: t('services.mobileDevelopment'), link: '/services/mobile-development' },
    { title: t('services.backendApi'), link: '/services/backend-api' },
    { title: t('services.aiMl'), link: '/services/ai-ml' },
    { title: t('services.devopsCloud'), link: '/services/devops-cloud' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#hero', label: t('nav.home'), type: 'scroll' },
    { href: '#services', label: t('nav.services'), type: 'dropdown' },
    { href: '#portfolio', label: t('nav.portfolio'), type: 'scroll' },
    { href: '#team', label: t('nav.team'), type: 'scroll' },
    { href: '#contact', label: t('nav.contacts'), type: 'scroll' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-4 md:top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-morphism' : 'glass-morphism'
        } px-4 md:px-8 py-3 md:py-4 rounded-full w-[calc(100%-2rem)] md:w-auto max-w-5xl`}
      >
        <div className="flex items-center space-x-8">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-neon-cyan font-jetbrains-mono font-bold text-xl cursor-pointer bg-gradient-to-r from-neon-cyan to-blue-400 bg-clip-text text-transparent"
            onClick={() => scrollToSection('#hero')}
          >
            HNS
          </motion.div>
          
          {!isMobile ? (
            <div className="flex items-center space-x-6">
              {navItems.map((item) => {
                if (item.type === 'dropdown') {
                  return (
                    <DropdownMenu key={item.href}>
                      <DropdownMenuTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="hover:text-neon-cyan transition-colors duration-300 text-sm font-medium flex items-center gap-1"
                        >
                          {item.label}
                          <ChevronDown className="w-4 h-4" />
                        </motion.button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="glass-morphism border-neon-cyan/20 min-w-[200px] text-white"
                        sideOffset={8}
                      >
                        {services.map((service) => (
                          <DropdownMenuItem 
                            key={service.link} 
                            asChild
                            className="focus:bg-neon-cyan/20 hover:bg-neon-cyan/20 text-white"
                          >
                            <Link href={service.link}>
                              <motion.div
                                whileHover={{ x: 5 }}
                                className="w-full cursor-pointer py-2 text-white hover:text-neon-cyan transition-colors duration-300"
                              >
                                {service.title}
                              </motion.div>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem 
                          asChild
                          className="focus:bg-neon-cyan/20 hover:bg-neon-cyan/20 text-white"
                        >
                          <motion.button
                            whileHover={{ x: 5 }}
                            onClick={() => scrollToSection('#services')}
                            className="w-full text-left cursor-pointer py-2 text-white hover:text-neon-cyan transition-colors duration-300 mt-2"
                          >
                            {t('nav.allServices')}
                          </motion.button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }
                return (
                  <motion.button
                    key={item.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(item.href)}
                    className="hover:text-neon-cyan transition-colors duration-300 text-sm font-medium"
                  >
                    {item.label}
                  </motion.button>
                );
              })}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hover:text-neon-cyan transition-colors duration-300 text-sm font-medium flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    {language.toUpperCase()}
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-morphism border-neon-cyan/20 text-white">
                  <DropdownMenuItem 
                    onClick={() => setLanguage('ru')}
                    className="focus:bg-neon-cyan/20 hover:bg-neon-cyan/20 text-white cursor-pointer"
                  >
                    🇷🇺 Русский
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setLanguage('en')}
                    className="focus:bg-neon-cyan/20 hover:bg-neon-cyan/20 text-white cursor-pointer"
                  >
                    🇺🇸 English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neon-cyan"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 left-4 right-4 z-40 glass-morphism rounded-2xl p-6 max-w-sm mx-auto"
          >
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => {
                if (item.type === 'dropdown') {
                  return (
                    <div key={item.href} className="space-y-2">
                      <motion.button
                        whileHover={{ x: 10 }}
                        onClick={() => {
                          setIsServicesOpen(!isServicesOpen);
                        }}
                        className="text-left hover:text-neon-cyan transition-colors duration-300 py-2 font-medium flex items-center justify-between w-full"
                      >
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                      </motion.button>
                      <AnimatePresence>
                        {isServicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="rounded-xl p-3 space-y-1 border border-neon-cyan/10">
                              {services.map((service) => (
                                <Link key={service.link} href={service.link}>
                                  <motion.div
                                    whileHover={{ x: 5 }}
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm hover:text-neon-cyan transition-colors duration-300 py-2 px-3 cursor-pointer text-gray-300 rounded-lg hover:bg-neon-cyan/10 break-words"
                                  >
                                    {service.title}
                                  </motion.div>
                                </Link>
                              ))}
                              <motion.button
                                whileHover={{ x: 5 }}
                                onClick={() => {
                                  scrollToSection('#services');
                                  setIsServicesOpen(false);
                                }}
                                className="text-sm hover:text-neon-cyan transition-colors duration-300 py-2 px-3 text-left w-full rounded-lg hover:bg-neon-cyan/10 text-gray-300 break-words"
                              >
                                {t('nav.allServices')}
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <motion.button
                    key={item.href}
                    whileHover={{ x: 10 }}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left hover:text-neon-cyan transition-colors duration-300 py-2 font-medium"
                  >
                    {item.label}
                  </motion.button>
                );
              })}
              
              {/* Language Switcher for Mobile */}
              <div className="border-t border-neon-cyan/20 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Language:</span>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setLanguage('ru')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        language === 'ru' 
                          ? 'bg-neon-cyan/20 text-neon-cyan' 
                          : 'text-gray-400 hover:text-neon-cyan'
                      }`}
                    >
                      🇷🇺 RU
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        language === 'en' 
                          ? 'bg-neon-cyan/20 text-neon-cyan' 
                          : 'text-gray-400 hover:text-neon-cyan'
                      }`}
                    >
                      🇺🇸 EN
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
