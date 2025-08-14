import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, Briefcase, Code, Mail, LogOut, Settings, BarChart3 } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Админ панель</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">VERTEX Studio</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Дашборд</span>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5" />
              Выйти
            </Button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Панель управления
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Управление контентом и настройками сайта
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Заявки</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{contacts.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Проекты</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{portfolioProjects.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Команда</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{teamRoles.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Технологии</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{technologies.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Code className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="contacts" className="space-y-6">
            <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1">
              <TabsTrigger 
                value="contacts" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Mail className="w-4 h-4" />
                Заявки
              </TabsTrigger>
              <TabsTrigger 
                value="portfolio" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Briefcase className="w-4 h-4" />
                Портфолио
              </TabsTrigger>
              <TabsTrigger 
                value="team" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Users className="w-4 h-4" />
                Команда
              </TabsTrigger>
              <TabsTrigger 
                value="technologies" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Code className="w-4 h-4" />
                Технологии
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contacts">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-slate-900 dark:text-white">Заявки от клиентов</CardTitle>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Управление обращениями и заявками
                      </p>
                    </div>
                    {contacts.length > 0 && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        {contacts.length} заявок
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ContactsTable contacts={contacts} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-slate-900 dark:text-white">Проекты портфолио</CardTitle>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Управление проектами в портфолио
                      </p>
                    </div>
                    <PortfolioProjectDialog>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить проект
                      </Button>
                    </PortfolioProjectDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {portfolioProjects.map((project) => (
                      <div key={project.id} className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{project.title}</h3>
                          <div className="flex gap-2">
                            {project.featured && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                Рекомендуемый
                              </Badge>
                            )}
                            <PortfolioProjectDialog project={project}>
                              <Button size="sm" variant="ghost" className="text-slate-600 hover:text-blue-600">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </PortfolioProjectDialog>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => deletePortfolioProject.mutate(project.id)}
                              disabled={deletePortfolioProject.isPending}
                              className="text-slate-600 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies?.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
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

            <TabsContent value="team">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-slate-900 dark:text-white">Роли команды</CardTitle>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Управление структурой команды
                      </p>
                    </div>
                    <TeamRoleDialog>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить роль
                      </Button>
                    </TeamRoleDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamRoles.map((role) => (
                      <div key={role.id} className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{role.title}</h3>
                          <div className="flex gap-2">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                              {role.count}
                            </Badge>
                            <TeamRoleDialog role={role}>
                              <Button size="sm" variant="ghost" className="text-slate-600 hover:text-blue-600">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TeamRoleDialog>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => deleteTeamRole.mutate(role.id)}
                              disabled={deleteTeamRole.isPending}
                              className="text-slate-600 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">{role.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technologies">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-slate-900 dark:text-white">Технологии</CardTitle>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Управление технологиями и инструментами
                      </p>
                    </div>
                    <TechnologyDialog>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить технологию
                      </Button>
                    </TechnologyDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {technologies.map((tech) => (
                      <div key={tech.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-center group">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-slate-900 dark:text-white text-sm flex-1 text-left">{tech.name}</h3>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <TechnologyDialog technology={tech}>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-600 hover:text-blue-600">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </TechnologyDialog>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => deleteTechnology.mutate(tech.id)}
                              disabled={deleteTechnology.isPending}
                              className="h-6 w-6 p-0 text-slate-600 hover:text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
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