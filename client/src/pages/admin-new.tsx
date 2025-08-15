import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Briefcase, 
  Code, 
  Mail, 
  LogOut, 
  Menu, 
  X,
  Home,
  MessageCircle,
  UserPlus,
  FolderPlus,
  Settings
} from 'lucide-react';
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

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Authentication check
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  // Data queries
  const { data: contacts = [] } = useQuery<Contact[]>({ queryKey: ['/api/contacts'] });
  const { data: portfolioProjects = [] } = useQuery<PortfolioProject[]>({ queryKey: ['/api/portfolio-projects'] });
  const { data: teamRoles = [] } = useQuery<TeamRole[]>({ queryKey: ['/api/team-roles'] });
  const { data: technologies = [] } = useQuery<Technology[]>({ queryKey: ['/api/technologies'] });

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setLocation('/');
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из админ-панели",
    });
  };

  // Delete mutations
  const deletePortfolioProject = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/portfolio-projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio-projects'] });
      toast({ title: "Проект удален", description: "Проект портфолио успешно удален" });
    },
  });

  const deleteTeamRole = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/team-roles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-roles'] });
      toast({ title: "Роль удалена", description: "Роль команды успешно удалена" });
    },
  });

  const deleteTechnology = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/technologies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/technologies'] });
      toast({ title: "Технология удалена", description: "Технология успешно удалена" });
    },
  });

  const menuItems = [
    { id: 'overview', label: 'Обзор', icon: Home },
    { id: 'contacts', label: 'Заявки', icon: MessageCircle, count: contacts.length },
    { id: 'portfolio', label: 'Портфолио', icon: Briefcase, count: portfolioProjects.length },
    { id: 'team', label: 'Команда', icon: Users, count: teamRoles.length },
    { id: 'technologies', label: 'Технологии', icon: Code, count: technologies.length },
  ];

  const StatCard = ({ title, value, icon: Icon, color, description }: any) => (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ContactCard = ({ contact }: { contact: Contact }) => (
    <Card className="border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">{contact.name}</h3>
              <p className="text-slate-400 text-xs truncate max-w-40">{contact.email}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
            {contact.createdAt && new Date(contact.createdAt).toLocaleDateString('ru-RU')}
          </Badge>
        </div>
        {contact.message && (
          <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">{contact.message}</p>
        )}
      </CardContent>
    </Card>
  );

  const ProjectCard = ({ project }: { project: PortfolioProject }) => (
    <Card className="group border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm mb-2">{project.title}</h3>
            <p className="text-slate-400 text-xs line-clamp-2">{project.description}</p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <PortfolioProjectDialog project={project}>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                <Edit2 className="w-3 h-3 text-slate-400" />
              </Button>
            </PortfolioProjectDialog>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
              onClick={() => deletePortfolioProject.mutate(project.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs px-2 py-0 bg-white/10 text-slate-300 border-0">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0 bg-white/10 text-slate-300 border-0">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-slate-900/95 backdrop-blur-sm border-r border-slate-800 z-50 
        transform transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Админ панель</h1>
                <p className="text-xs text-slate-400">HNS</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden h-8 w-8 p-0 hover:bg-white/10"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-4 h-4 text-slate-400" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count !== undefined && (
                <Badge variant="secondary" className="bg-white/10 text-slate-300 border-0 text-xs">
                  {item.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-4 right-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsSidebarOpen(true)}
              className="h-8 w-8 p-0 hover:bg-white/10"
            >
              <Menu className="w-4 h-4 text-slate-400" />
            </Button>
            <h2 className="text-lg font-semibold text-white">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h2>
            <div className="w-8" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-8">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Обзор системы</h2>
                <p className="text-slate-400">Управление контентом и мониторинг активности</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Заявки"
                  value={contacts.length}
                  icon={MessageCircle}
                  color="from-blue-500 to-cyan-500"
                  description="Обращений клиентов"
                />
                <StatCard
                  title="Проекты"
                  value={portfolioProjects.length}
                  icon={Briefcase}
                  color="from-emerald-500 to-green-500"
                  description="В портфолио"
                />
                <StatCard
                  title="Команда"
                  value={teamRoles.length}
                  icon={Users}
                  color="from-purple-500 to-violet-500"
                  description="Ролей в команде"
                />
                <StatCard
                  title="Технологии"
                  value={technologies.length}
                  icon={Code}
                  color="from-orange-500 to-red-500"
                  description="В технологическом стеке"
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Последние заявки</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setActiveTab('contacts')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Все заявки
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {contacts.slice(0, 3).map((contact) => (
                      <ContactCard key={contact.id} contact={contact} />
                    ))}
                    {contacts.length === 0 && (
                      <div className="text-center py-8 text-slate-400">
                        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Заявок пока нет</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Проекты</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setActiveTab('portfolio')}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      Все проекты
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {portfolioProjects.slice(0, 3).map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                    {portfolioProjects.length === 0 && (
                      <div className="text-center py-8 text-slate-400">
                        <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Проектов пока нет</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contacts */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Заявки клиентов</h2>
                  <p className="text-slate-400">Обращения и запросы от потенциальных клиентов</p>
                </div>
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  {contacts.length} заявок
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{contact.name}</h3>
                            <p className="text-slate-400 text-sm">{contact.email}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                          {contact.createdAt && new Date(contact.createdAt).toLocaleDateString('ru-RU')}
                        </Badge>
                      </div>

                      {(contact.phone || contact.company || contact.service || contact.budget) && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {contact.phone && (
                            <div className="p-2 bg-white/5 rounded-lg">
                              <span className="text-slate-400">Телефон</span>
                              <p className="text-white font-medium">{contact.phone}</p>
                            </div>
                          )}
                          {contact.company && (
                            <div className="p-2 bg-white/5 rounded-lg">
                              <span className="text-slate-400">Компания</span>
                              <p className="text-white font-medium">{contact.company}</p>
                            </div>
                          )}
                          {contact.service && (
                            <div className="p-2 bg-white/5 rounded-lg">
                              <span className="text-slate-400">Услуга</span>
                              <p className="text-white font-medium">{contact.service}</p>
                            </div>
                          )}
                          {contact.budget && (
                            <div className="p-2 bg-white/5 rounded-lg">
                              <span className="text-slate-400">Бюджет</span>
                              <p className="text-white font-medium">{contact.budget}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {contact.message && (
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-slate-300 text-sm leading-relaxed">{contact.message}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {contacts.length === 0 && (
                <div className="text-center py-16">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">Заявок пока нет</h3>
                  <p className="text-slate-400">Новые обращения клиентов появятся здесь</p>
                </div>
              )}
            </div>
          )}

          {/* Portfolio */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Портфолио проектов</h2>
                  <p className="text-slate-400">Управление проектами в портфолио</p>
                </div>
                <PortfolioProjectDialog>
                  <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Добавить проект
                  </Button>
                </PortfolioProjectDialog>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {portfolioProjects.map((project) => (
                  <Card key={project.id} className="group border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-white text-lg leading-tight">{project.title}</h3>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <PortfolioProjectDialog project={project}>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                              <Edit2 className="w-4 h-4 text-slate-400" />
                            </Button>
                          </PortfolioProjectDialog>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                            onClick={() => deletePortfolioProject.mutate(project.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>

                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs bg-white/10 text-slate-300 border-0">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {project.featured && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                          Рекомендуемый
                        </Badge>
                      )}

                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block text-blue-400 hover:text-blue-300 text-sm transition-colors"
                        >
                          Посмотреть проект →
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {portfolioProjects.length === 0 && (
                <div className="text-center py-16">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">Проектов пока нет</h3>
                  <p className="text-slate-400">Добавьте первый проект в портфолио</p>
                </div>
              )}
            </div>
          )}

          {/* Team */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Команда</h2>
                  <p className="text-slate-400">Управление ролями в команде</p>
                </div>
                <TeamRoleDialog>
                  <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Добавить роль
                  </Button>
                </TeamRoleDialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamRoles.map((role) => (
                  <Card key={role.id} className="group border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{role.title}</h3>
                            <p className="text-sm text-slate-400">{role.count} человек</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <TeamRoleDialog role={role}>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                              <Edit2 className="w-4 h-4 text-slate-400" />
                            </Button>
                          </TeamRoleDialog>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                            onClick={() => deleteTeamRole.mutate(role.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{role.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {teamRoles.length === 0 && (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">Ролей пока нет</h3>
                  <p className="text-slate-400">Добавьте роли для команды</p>
                </div>
              )}
            </div>
          )}

          {/* Technologies */}
          {activeTab === 'technologies' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Технологии</h2>
                  <p className="text-slate-400">Управление технологическим стеком</p>
                </div>
                <TechnologyDialog>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить технологию
                  </Button>
                </TechnologyDialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {technologies.map((tech) => (
                  <Card key={tech.id} className="group border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <Code className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">{tech.name}</h3>
                            <p className="text-xs text-slate-400">{tech.category}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <TechnologyDialog technology={tech}>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-white/10">
                              <Edit2 className="w-3 h-3 text-slate-400" />
                            </Button>
                          </TechnologyDialog>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-400"
                            onClick={() => deleteTechnology.mutate(tech.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {technologies.length === 0 && (
                <div className="text-center py-16">
                  <Code className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">Технологий пока нет</h3>
                  <p className="text-slate-400">Добавьте технологии в стек</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}