import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertServiceProjectSchema, type ServiceProject } from '@shared/schema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const formSchema = insertServiceProjectSchema.extend({
  technologiesInput: z.string().optional(),
});

interface ServiceProjectDialogProps {
  children: React.ReactNode;
  project?: ServiceProject;
}

const serviceTypes = [
  { value: 'web-development', label: 'Веб-разработка' },
  { value: 'mobile-development', label: 'Мобильная разработка' },
  { value: '3d-webgl', label: '3D/WebGL' },
  { value: 'backend-api', label: 'Backend/API' },
  { value: 'ai-ml', label: 'AI/ML' },
  { value: 'devops-cloud', label: 'DevOps/Cloud' },
];

export function ServiceProjectDialog({ children, project }: ServiceProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: project?.serviceType || 'web-development',
      title: project?.title || '',
      description: project?.description || '',
      image: project?.image || '',
      technologies: project?.technologies || [],
      technologiesInput: project?.technologies?.join(', ') || '',
      link: project?.link || undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const { technologiesInput, ...projectData } = data;
      const processedData = {
        ...projectData,
        technologies: technologiesInput 
          ? technologiesInput.split(',').map(t => t.trim()).filter(t => t)
          : [],
      };

      if (project) {
        return apiRequest(`/api/service-projects/${project.id}`, 'PUT', {
          body: JSON.stringify(processedData),
        });
      } else {
        return apiRequest('/api/service-projects', 'POST', {
          body: JSON.stringify(processedData),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/service-projects'] });
      toast({
        title: 'Успешно',
        description: project ? 'Проект обновлен' : 'Проект добавлен',
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить проект',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Редактировать проект услуги' : 'Добавить проект услуги'}
          </DialogTitle>
          <DialogDescription>
            {project ? 'Изменить данные проекта' : 'Добавить новый проект для страницы услуги'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип услуги</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-600" data-testid="select-service-type">
                        <SelectValue placeholder="Выберите тип услуги" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {serviceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название проекта</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Название проекта"
                      className="bg-gray-800 border-gray-600"
                      {...field}
                      data-testid="input-service-project-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Описание проекта"
                      className="bg-gray-800 border-gray-600 min-h-[100px]"
                      {...field}
                      data-testid="textarea-service-project-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL изображения</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      className="bg-gray-800 border-gray-600"
                      {...field}
                      data-testid="input-service-project-image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technologiesInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Технологии</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="React, Node.js, TypeScript (через запятую)"
                      className="bg-gray-800 border-gray-600"
                      {...field}
                      data-testid="input-service-project-technologies"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ссылка (необязательно)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      className="bg-gray-800 border-gray-600"
                      {...field}
                      data-testid="input-service-project-link"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                data-testid="button-cancel"
              >
                Отмена
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-save-service-project"
              >
                {mutation.isPending ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}