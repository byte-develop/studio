import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Users, Briefcase, Code, Mail, LogOut, Settings, BarChart3, Menu, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { 
  Contact, 
  PortfolioProject, 
  TeamRole, 
  Technology 
} from '@shared/schema';

// Import dialog components
import { PortfolioProjectDialog } from '@/components/admin/portfolio-project-dialog';
import { TeamRoleDialog } from '@/components/admin/team-role-dialog';
import { TechnologyDialog } from '@/components/admin/technology-dialog';
import { ContactsTable } from '@/components/admin/contacts-table';

export function AdminPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Проверка аутентификации
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [setLocation]);
  
  // Загрузка данных
  const { data: contacts = [] } = useQuery<Contact[]>({ queryKey: ['/api/contacts'] });
  const { data: portfolioProjects = [] } = useQuery<PortfolioProject[]>({ queryKey: ['/api/portfolio-projects'] });
  const { data: teamRoles = [] } = useQuery<TeamRole[]>({ queryKey: ['/api/team-roles'] });
  const { data: technologies = [] } = useQuery<Technology[]>({ queryKey: ['/api/technologies'] });

  // Выход из админки
  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setLocation('/');
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из админ-панели",
    });
  };

  // Мутации для удаления
  const deletePortfolioProject = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/portfolio-projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio-projects'] });
      toast({
        title: "Проект удален",
        description: "Проект портфолио успешно удален",
      });
    },
  });

  const deleteTeamRole = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/team-roles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-roles'] });
      toast({
        title: "Роль удалена",
        description: "Роль команды успешно удалена",
      });
    },
  });

  const deleteTechnology = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/technologies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/technologies'] });
      toast({
        title: "Технология удалена",
        description: "Технология успешно удалена",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-10 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-full sm:w-80 md:w-64 lg:w-72 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700/50 shadow-2xl backdrop-blur-sm z-20 transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-4 md:p-6">
          {/* Mobile close button */}
          <div className="md:hidden flex justify-end mb-4">
            <Button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-white"
              size="sm"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Logo Section */}
          <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full border-2 border-slate-800"></div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white">Админ панель</h1>
              <p className="text-xs md:text-sm text-cyan-300 font-medium">VERTEX Studio</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-md">
              <BarChart3 className="w-5 h-5" />
              <span className="font-semibold">Дашборд</span>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/30"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Выйти</span>
            </Button>
          </nav>

          {/* Status Indicator */}
          <div className="mt-6 md:mt-8 p-3 md:p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs md:text-sm text-green-300 font-medium">Система активна</span>
            </div>
            <p className="text-xs text-slate-400">API отвечает, данные загружаются</p>
            <p className="text-xs text-slate-500 mt-1">Определяется автоматически</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64 lg:ml-72 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="md:hidden mb-6">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-white"
                  size="sm"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-lg font-bold text-white">Админ панель</h1>
                  <p className="text-sm text-slate-300">VERTEX Studio</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300">Online</span>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="mb-6 md:mb-10 hidden md:block">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Панель управления
                </h1>
                <p className="text-slate-300 text-sm md:text-lg">
                  Управление контентом и настройками сайта
                </p>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50 w-fit">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 font-medium text-sm">Online</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">Заявки</p>
                    <p className="text-2xl md:text-3xl font-bold text-white">{contacts.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Всего получено</p>
                  </div>
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Mail className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">Проекты</p>
                    <p className="text-3xl font-bold text-white">{portfolioProjects.length}</p>
                    <p className="text-xs text-slate-500 mt-1">В портфолио</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">Команда</p>
                    <p className="text-3xl font-bold text-white">{teamRoles.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Ролей</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">Технологии</p>
                    <p className="text-3xl font-bold text-white">{technologies.length}</p>
                    <p className="text-xs text-slate-500 mt-1">В стеке</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Code className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="contacts" className="space-y-8">
            <TabsList className="bg-slate-800/80 border border-slate-700/50 p-2 rounded-xl shadow-xl backdrop-blur-sm flex-wrap gap-2 h-auto">
              <TabsTrigger 
                value="contacts" 
                className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white text-sm md:text-base"
              >
                <Mail className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Заявки</span>
              </TabsTrigger>
              <TabsTrigger 
                value="portfolio" 
                className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white text-sm md:text-base"
              >
                <Briefcase className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Портфолио</span>
              </TabsTrigger>
              <TabsTrigger 
                value="team" 
                className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white text-sm md:text-base"
              >
                <Users className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Команда</span>
              </TabsTrigger>
              <TabsTrigger 
                value="technologies" 
                className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-white text-sm md:text-base"
              >
                <Code className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Технологии</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contacts">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 shadow-xl backdrop-blur-sm">
                <CardHeader className="border-b border-slate-700/50 bg-slate-800/50">
                  <CardTitle className="text-white flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold">Обращения клиентов</span>
                    {contacts.length > 0 && (
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 ml-auto">
                        {contacts.length} заявок
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-8">
                  <ContactsTable contacts={contacts} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 shadow-xl backdrop-blur-sm">
                <CardHeader className="border-b border-slate-700/50 bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-3 text-xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold">Портфолио проектов</span>
                    </CardTitle>
                    <PortfolioProjectDialog>
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-3 md:px-6 py-2">
                        <Plus className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="font-medium text-sm md:text-base">Добавить</span>
                      </Button>
                    </PortfolioProjectDialog>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  {portfolioProjects.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="mx-auto w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-6">
                        <Briefcase className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-slate-300 text-xl font-medium mb-2">Проектов пока нет</p>
                      <p className="text-slate-400">Добавьте первый проект в портфолио</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {portfolioProjects.map((project) => (
                        <div key={project.id} className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-white text-lg">{project.title}</h3>
                            <div className="flex gap-2">
                              {project.featured && (
                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                                  Рекомендуемый
                                </Badge>
                              )}
                              <PortfolioProjectDialog project={project}>
                                <Button size="sm" className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border-slate-600/50 transition-all duration-200">
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </PortfolioProjectDialog>
                              <Button 
                                size="sm" 
                                onClick={() => deletePortfolioProject.mutate(project.id)}
                                disabled={deletePortfolioProject.isPending}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-400/50 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-slate-300 mb-4 leading-relaxed">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies?.map((tech) => (
                              <Badge key={tech} className="bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 transition-colors">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 shadow-xl backdrop-blur-sm">
                <CardHeader className="border-b border-slate-700/50 bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-3 text-xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold">Роли команды</span>
                    </CardTitle>
                    <TeamRoleDialog>
                      <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2">
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="font-medium">Добавить роль</span>
                      </Button>
                    </TeamRoleDialog>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  {teamRoles.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="mx-auto w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-6">
                        <Users className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-slate-300 text-xl font-medium mb-2">Ролей пока нет</p>
                      <p className="text-slate-400">Добавьте первую роль для команды</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {teamRoles.map((role) => (
                        <div key={role.id} className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-white text-lg">{role.title}</h3>
                            <div className="flex gap-2">
                              <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 shadow-lg">
                                {role.count}
                              </Badge>
                              <TeamRoleDialog role={role}>
                                <Button size="sm" className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border-slate-600/50 transition-all duration-200">
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </TeamRoleDialog>
                              <Button 
                                size="sm" 
                                onClick={() => deleteTeamRole.mutate(role.id)}
                                disabled={deleteTeamRole.isPending}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-400/50 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{role.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technologies">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 shadow-xl backdrop-blur-sm">
                <CardHeader className="border-b border-slate-700/50 bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-3 text-xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold">Технологии</span>
                    </CardTitle>
                    <TechnologyDialog>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2">
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="font-medium">Добавить технологию</span>
                      </Button>
                    </TechnologyDialog>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  {technologies.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="mx-auto w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-6">
                        <Code className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-slate-300 text-xl font-medium mb-2">Технологий пока нет</p>
                      <p className="text-slate-400">Добавьте первую технологию в стек</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {technologies.map((tech) => (
                        <div key={tech.id} className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm text-center">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-white text-sm flex-1 text-left">{tech.name}</h3>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <TechnologyDialog technology={tech}>
                                <Button size="sm" className="h-6 w-6 p-0 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border-slate-600/50 transition-all duration-200">
                                  <Pencil className="w-3 h-3" />
                                </Button>
                              </TechnologyDialog>
                              <Button 
                                size="sm" 
                                onClick={() => deleteTechnology.mutate(tech.id)}
                                disabled={deleteTechnology.isPending}
                                className="h-6 w-6 p-0 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-400/50 transition-all duration-200"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 transition-colors text-xs">
                            {tech.category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}