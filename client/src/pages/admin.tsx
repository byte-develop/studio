import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Database, 
  FolderOpen, 
  Users, 
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { 
  Technology, 
  PortfolioProject, 
  ServiceProject, 
  TeamRole, 
  Contact 
} from '@shared/schema';
import { TechnologyDialog } from '@/components/admin/technology-dialog';
import { PortfolioProjectDialog } from '@/components/admin/portfolio-project-dialog';
import { ServiceProjectDialog } from '@/components/admin/service-project-dialog';
import { TeamRoleDialog } from '@/components/admin/team-role-dialog';
import { ContactsTable } from '@/components/admin/contacts-table';

export default function AdminPage() {
  const [selectedTab, setSelectedTab] = useState("technologies");
  const queryClient = useQueryClient();

  // Queries
  const { data: technologies = [], isLoading: loadingTech } = useQuery<Technology[]>({
    queryKey: ['/api/technologies'],
  });

  const { data: portfolioProjects = [], isLoading: loadingPortfolio } = useQuery<PortfolioProject[]>({
    queryKey: ['/api/portfolio-projects'],
  });

  const { data: serviceProjects = [], isLoading: loadingService } = useQuery<ServiceProject[]>({
    queryKey: ['/api/service-projects'],
  });

  const { data: teamRoles = [], isLoading: loadingTeam } = useQuery<TeamRole[]>({
    queryKey: ['/api/team-roles'],
  });

  const { data: contacts = [], isLoading: loadingContacts } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
  });

  // Delete mutations
  const deleteTechMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/technologies/${id}`, 'DELETE'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/technologies'] }),
  });

  const deletePortfolioMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/portfolio-projects/${id}`, 'DELETE'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/portfolio-projects'] }),
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/service-projects/${id}`, 'DELETE'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/service-projects'] }),
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/team-roles/${id}`, 'DELETE'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/team-roles'] }),
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Панель администратора
          </h1>
          <p className="text-gray-400">Управление контентом сайта VERTEX Studio</p>
        </motion.div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900">
            <TabsTrigger value="technologies" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Технологии
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Портфолио
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Услуги
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Команда
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Заявки
            </TabsTrigger>
          </TabsList>

          {/* Technologies Tab */}
          <TabsContent value="technologies" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Технологии</CardTitle>
                  <CardDescription>Управление технологиями для отображения на сайте</CardDescription>
                </div>
                <TechnologyDialog>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </Button>
                </TechnologyDialog>
              </CardHeader>
              <CardContent>
                {loadingTech ? (
                  <div className="text-center py-8">Загрузка...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {technologies.map((tech) => (
                      <div key={tech.id} className="p-4 bg-gray-800 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{tech.category}</Badge>
                          <span>{tech.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TechnologyDialog technology={tech}>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TechnologyDialog>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => deleteTechMutation.mutate(tech.id)}
                            disabled={deleteTechMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Проекты портфолио</CardTitle>
                  <CardDescription>Управление проектами для отображения в портфолио</CardDescription>
                </div>
                <PortfolioProjectDialog>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </Button>
                </PortfolioProjectDialog>
              </CardHeader>
              <CardContent>
                {loadingPortfolio ? (
                  <div className="text-center py-8">Загрузка...</div>
                ) : (
                  <div className="space-y-4">
                    {portfolioProjects.map((project) => (
                      <div key={project.id} className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{project.title}</h3>
                            <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                            <div className="flex items-center gap-2 mb-2">
                              {project.technologies.map((tech, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                            {project.featured && (
                              <Badge className="bg-yellow-600">Рекомендуемый</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <PortfolioProjectDialog project={project}>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </PortfolioProjectDialog>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => deletePortfolioMutation.mutate(project.id)}
                              disabled={deletePortfolioMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Проекты услуг</CardTitle>
                  <CardDescription>Управление проектами для страниц услуг</CardDescription>
                </div>
                <ServiceProjectDialog>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </Button>
                </ServiceProjectDialog>
              </CardHeader>
              <CardContent>
                {loadingService ? (
                  <div className="text-center py-8">Загрузка...</div>
                ) : (
                  <div className="space-y-4">
                    {serviceProjects.map((project) => (
                      <div key={project.id} className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{project.title}</h3>
                              <Badge variant="secondary">{project.serviceType}</Badge>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                            <div className="flex items-center gap-2">
                              {project.technologies.map((tech, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <ServiceProjectDialog project={project}>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </ServiceProjectDialog>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => deleteServiceMutation.mutate(project.id)}
                              disabled={deleteServiceMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Структура команды</CardTitle>
                  <CardDescription>Управление ролями и количеством участников команды</CardDescription>
                </div>
                <TeamRoleDialog>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </Button>
                </TeamRoleDialog>
              </CardHeader>
              <CardContent>
                {loadingTeam ? (
                  <div className="text-center py-8">Загрузка...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamRoles.map((role) => (
                      <div key={role.id} className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{role.title}</h3>
                            <p className="text-gray-400 text-sm mb-2">{role.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge className={`bg-${role.color}-600`}>
                                {role.count} участников
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <TeamRoleDialog role={role}>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TeamRoleDialog>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => deleteTeamMutation.mutate(role.id)}
                              disabled={deleteTeamMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Заявки от клиентов</CardTitle>
                <CardDescription>Просмотр всех поступивших заявок</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingContacts ? (
                  <div className="text-center py-8">Загрузка...</div>
                ) : (
                  <ContactsTable contacts={contacts} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}