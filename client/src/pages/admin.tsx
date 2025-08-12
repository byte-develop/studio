import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, Briefcase, Code, Mail } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { 
  Contact, 
  PortfolioProject, 
  ServiceProject, 
  TeamRole, 
  Technology 
} from '@shared/schema';

// Import dialog components
import { PortfolioProjectDialog } from '@/components/admin/portfolio-project-dialog';
import { ServiceProjectDialog } from '@/components/admin/service-project-dialog';
import { TeamRoleDialog } from '@/components/admin/team-role-dialog';
import { TechnologyDialog } from '@/components/admin/technology-dialog';
import { ContactsTable } from '@/components/admin/contacts-table';

export function AdminPage() {
  const queryClient = useQueryClient();
  
  // Загрузка данных
  const { data: contacts = [] } = useQuery<Contact[]>({ queryKey: ['/api/contacts'] });
  const { data: portfolioProjects = [] } = useQuery<PortfolioProject[]>({ queryKey: ['/api/portfolio-projects'] });
  const { data: serviceProjects = [] } = useQuery<ServiceProject[]>({ queryKey: ['/api/service-projects'] });
  const { data: teamRoles = [] } = useQuery<TeamRole[]>({ queryKey: ['/api/team-roles'] });
  const { data: technologies = [] } = useQuery<Technology[]>({ queryKey: ['/api/technologies'] });

  // Мутации для удаления
  const deletePortfolioProject = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/portfolio-projects/${id}`, 'DELETE'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/portfolio-projects'] }),
  });

  const deleteServiceProject = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/service-projects/${id}`, 'DELETE'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/service-projects'] }),
  });

  const deleteTeamRole = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/team-roles/${id}`, 'DELETE'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/team-roles'] }),
  });

  const deleteTechnology = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/technologies/${id}`, 'DELETE'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/technologies'] }),
  });

  return (
    <div className="min-h-screen bg-deep-black text-white p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-light mb-4 text-3d">
            Панель <span className="text-neon-cyan">Администратора</span>
          </h1>
          <p className="text-gray-400">Управление содержимым сайта VERTEX Studio</p>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Заявки
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Портфолио
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Услуги
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Команда
            </TabsTrigger>
            <TabsTrigger value="technologies" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Технологии
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Заявки от клиентов ({contacts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContactsTable contacts={contacts} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Проекты портфолио ({portfolioProjects.length})
                </CardTitle>
                <PortfolioProjectDialog>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить проект
                  </Button>
                </PortfolioProjectDialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolioProjects.map((project) => (
                    <div key={project.id} className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">{project.title}</h3>
                        <div className="flex gap-2">
                          {project.featured && <Badge variant="secondary">Рекомендуемый</Badge>}
                          <PortfolioProjectDialog project={project}>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </PortfolioProjectDialog>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => deletePortfolioProject.mutate(project.id)}
                            disabled={deletePortfolioProject.isPending}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
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

          <TabsContent value="services">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Проекты услуг ({serviceProjects.length})
                </CardTitle>
                <ServiceProjectDialog>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить проект
                  </Button>
                </ServiceProjectDialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceProjects.map((project) => (
                    <div key={project.id} className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">{project.title}</h3>
                        <div className="flex gap-2">
                          <Badge variant="outline">{project.serviceType}</Badge>
                          <ServiceProjectDialog project={project}>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </ServiceProjectDialog>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => deleteServiceProject.mutate(project.id)}
                            disabled={deleteServiceProject.isPending}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
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
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Роли команды ({teamRoles.length})
                </CardTitle>
                <TeamRoleDialog>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить роль
                  </Button>
                </TeamRoleDialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamRoles.map((role) => (
                    <div key={role.id} className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">{role.title}</h3>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{role.count}</Badge>
                          <TeamRoleDialog role={role}>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TeamRoleDialog>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => deleteTeamRole.mutate(role.id)}
                            disabled={deleteTeamRole.isPending}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">{role.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technologies">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Технологии ({technologies.length})
                </CardTitle>
                <TechnologyDialog>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить технологию
                  </Button>
                </TechnologyDialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {technologies.map((tech) => (
                    <div key={tech.id} className="bg-gray-900 p-3 rounded-lg border border-gray-600 text-center">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">{tech.category}</Badge>
                        <div className="flex gap-1">
                          <TechnologyDialog technology={tech}>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </TechnologyDialog>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0"
                            onClick={() => deleteTechnology.mutate(tech.id)}
                            disabled={deleteTechnology.isPending}
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      <h4 className="font-medium text-white text-sm">{tech.name}</h4>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}