import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Settings, Users } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useSocket } from '@/contexts/socket-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { useToast } from '@/hooks/use-toast';
import type { ProjectWithRelations, TaskWithRelations } from '@shared/schema';

export function Project() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  if (!user) {
    setLocation('/login');
    return null;
  }

  const projectId = parseInt(id || '0');

  // Fetch project data with tasks
  const { data: project, isLoading, error } = useQuery<ProjectWithRelations>({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      return response.json();
    },
    enabled: !!projectId,
  });

  // Task update mutation
  const taskUpdateMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: number; updates: any }) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update task');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
      toast({
        title: 'Task updated',
        description: 'Task has been updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    },
  });

  const handleTaskUpdate = (taskId: number, updates: any) => {
    taskUpdateMutation.mutate({ taskId, updates });
  };

  const handleTaskCreate = (columnId: string) => {
    // TODO: Open create task dialog
    console.log('Create task for column:', columnId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Project not found</h3>
              <p className="text-muted-foreground mb-4">
                The project you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => setLocation('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setLocation('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <div>
                  <h1 className="text-xl font-bold">{project.name}</h1>
                  {project.description && (
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                {project.members?.length || 0} members
              </Button>
              
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              
              <Button size="sm" onClick={() => handleTaskCreate('todo')}>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          projectId={projectId}
          tasks={project.tasks as TaskWithRelations[] || []}
          onTaskUpdate={handleTaskUpdate}
          onTaskCreate={handleTaskCreate}
        />
      </div>
    </div>
  );
}