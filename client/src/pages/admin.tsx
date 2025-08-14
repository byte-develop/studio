import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, Briefcase, Code, Mail, LogOut } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-deep-black via-gray-900 to-deep-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header с улучшенным дизайном */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div className="space-y-2">
                <h1 className="text-5xl font-light text-3d bg-gradient-to-r from-white via-neon-cyan to-white bg-clip-text text-transparent">
                  Панель <span className="text-neon-cyan font-semibold glow">Администратора</span>
                </h1>
                <p className="text-lg text-gray-400">Управление содержимым сайта VERTEX Studio</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Система активна
                  </div>
                  <div>Последнее обновление: {new Date().toLocaleTimeString('ru-RU')}</div>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="lg"
                className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400 backdrop-blur-sm bg-red-500/5 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Выйти
              </Button>
            </div>
          </div>

          {/* Улучшенные статистики */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/60 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Заявки</p>
                  <p className="text-2xl font-bold text-white">{contacts.length}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/60 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Портфолио</p>
                  <p className="text-2xl font-bold text-white">{portfolioProjects.length}</p>
                </div>
                <Briefcase className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/60 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Команда</p>
                  <p className="text-2xl font-bold text-white">{teamRoles.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/60 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Технологии</p>
                  <p className="text-2xl font-bold text-white">{technologies.length}</p>
                </div>
                <Code className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </div>

          <Tabs defaultValue="contacts" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-2">
              <TabsTrigger 
                value="contacts" 
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-cyan data-[state=active]:to-blue-400 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-neon-cyan/25 transition-all duration-300 text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Заявки</span>
              </TabsTrigger>
              <TabsTrigger 
                value="portfolio" 
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-cyan data-[state=active]:to-blue-400 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-neon-cyan/25 transition-all duration-300 text-sm font-medium"
              >
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Портфолио</span>
              </TabsTrigger>
              <TabsTrigger 
                value="team" 
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-cyan data-[state=active]:to-blue-400 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-neon-cyan/25 transition-all duration-300 text-sm font-medium"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Команда</span>
              </TabsTrigger>
              <TabsTrigger 
                value="technologies" 
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-cyan data-[state=active]:to-blue-400 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-neon-cyan/25 transition-all duration-300 text-sm font-medium"
              >
                <Code className="w-4 h-4" />
                <span className="hidden sm:inline">Технологии</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contacts" className="space-y-6">
              <Card className="bg-gray-800/30 backdrop-blur-md border-gray-700/50 rounded-2xl shadow-2xl hover:bg-gray-800/40 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-white flex items-center gap-3 text-xl">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        Заявки от клиентов
                      </CardTitle>
                      <p className="text-gray-400">Управление обращениями и заявками клиентов</p>
                    </div>
                    {contacts.length > 0 && (
                      <Badge variant="outline" className="px-3 py-1 text-sm border-blue-400/30 text-blue-400 bg-blue-400/10">
                        Всего: {contacts.length}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ContactsTable contacts={contacts} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <Card className="bg-gray-800/30 backdrop-blur-md border-gray-700/50 rounded-2xl shadow-2xl hover:bg-gray-800/40 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                      <CardTitle className="text-white flex items-center gap-3 text-xl">
                        <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        Проекты портфолио
                      </CardTitle>
                      <p className="text-gray-400">Управление проектами в портфолио компании</p>
                    </div>
                    <PortfolioProjectDialog>
                      <Button className="bg-gradient-to-r from-neon-cyan to-blue-400 hover:from-neon-cyan/80 hover:to-blue-400/80 text-black font-semibold shadow-lg shadow-neon-cyan/25 hover:shadow-neon-cyan/40 transition-all duration-300 px-6 py-2 rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить проект
                      </Button>
                    </PortfolioProjectDialog>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {portfolioProjects.map((project) => (
                      <div key={project.id} className="group bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl border border-gray-600/50 hover:border-neon-cyan/50 hover:bg-gray-700/50 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-white text-lg group-hover:text-neon-cyan transition-colors">{project.title}</h3>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {project.featured && (
                              <Badge className="bg-gradient-to-r from-neon-cyan to-blue-400 text-black font-medium shadow-md">
                                Рекомендуемый
                              </Badge>
                            )}
                            <PortfolioProjectDialog project={project}>
                              <Button size="sm" variant="outline" className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan rounded-lg transition-all duration-300">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </PortfolioProjectDialog>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => deletePortfolioProject.mutate(project.id)}
                              disabled={deletePortfolioProject.isPending}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 rounded-lg transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies?.map((tech) => (
                            <Badge 
                              key={tech} 
                              variant="outline" 
                              className="text-xs border-gray-500/50 text-gray-300 bg-gray-800/30 hover:bg-gray-700/50 transition-colors px-2 py-1"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card className="bg-gray-800/30 backdrop-blur-md border-gray-700/50 rounded-2xl shadow-2xl hover:bg-gray-800/40 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                      <CardTitle className="text-white flex items-center gap-3 text-xl">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                          <Users className="w-5 h-5" />
                        </div>
                        Роли команды
                      </CardTitle>
                      <p className="text-gray-400">Управление ролями и структурой команды</p>
                    </div>
                    <TeamRoleDialog>
                      <Button className="bg-gradient-to-r from-neon-cyan to-blue-400 hover:from-neon-cyan/80 hover:to-blue-400/80 text-black font-semibold shadow-lg shadow-neon-cyan/25 hover:shadow-neon-cyan/40 transition-all duration-300 px-6 py-2 rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить роль
                      </Button>
                    </TeamRoleDialog>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamRoles.map((role) => (
                      <div key={role.id} className="group bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl border border-gray-600/50 hover:border-neon-cyan/50 hover:bg-gray-700/50 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-white text-lg group-hover:text-neon-cyan transition-colors">{role.title}</h3>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge className="bg-gradient-to-r from-neon-cyan to-blue-400 text-black font-medium shadow-md">
                              {role.count}
                            </Badge>
                            <TeamRoleDialog role={role}>
                              <Button size="sm" variant="outline" className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan rounded-lg transition-all duration-300">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TeamRoleDialog>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => deleteTeamRole.mutate(role.id)}
                              disabled={deleteTeamRole.isPending}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 rounded-lg transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{role.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technologies" className="space-y-6">
              <Card className="bg-gray-800/30 backdrop-blur-md border-gray-700/50 rounded-2xl shadow-2xl hover:bg-gray-800/40 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                      <CardTitle className="text-white flex items-center gap-3 text-xl">
                        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                          <Code className="w-5 h-5" />
                        </div>
                        Технологии
                      </CardTitle>
                      <p className="text-gray-400">Управление технологиями и инструментами</p>
                    </div>
                    <TechnologyDialog>
                      <Button className="bg-gradient-to-r from-neon-cyan to-blue-400 hover:from-neon-cyan/80 hover:to-blue-400/80 text-black font-semibold shadow-lg shadow-neon-cyan/25 hover:shadow-neon-cyan/40 transition-all duration-300 px-6 py-2 rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить технологию
                      </Button>
                    </TechnologyDialog>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {technologies.map((tech) => (
                      <div key={tech.id} className="group bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 hover:border-neon-cyan/50 hover:bg-gray-700/50 transition-all duration-300 text-center">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-white text-sm flex-1 text-left group-hover:text-neon-cyan transition-colors">{tech.name}</h3>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <TechnologyDialog technology={tech}>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-neon-cyan hover:bg-neon-cyan/20 rounded-md transition-all duration-300">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </TechnologyDialog>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => deleteTechnology.mutate(tech.id)}
                              disabled={deleteTechnology.isPending}
                              className="h-6 w-6 p-0 text-red-400 hover:bg-red-500/20 rounded-md transition-all duration-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="text-xs border-gray-500/50 text-gray-300 bg-gray-800/30 hover:bg-gray-700/50 transition-colors px-2 py-1"
                        >
                          {tech.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}