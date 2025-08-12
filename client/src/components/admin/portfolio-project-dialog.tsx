import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { apiRequest } from '@/lib/queryClient';
import { insertPortfolioProjectSchema, type PortfolioProject, type InsertPortfolioProject } from '@shared/schema';
import { z } from 'zod';

interface PortfolioProjectDialogProps {
  children: React.ReactNode;
  project?: PortfolioProject;
}

const formSchema = insertPortfolioProjectSchema.extend({
  technologiesText: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function PortfolioProjectDialog({ children, project }: PortfolioProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      image: project?.image || '',
      technologiesText: project?.technologies?.join(', ') || '',
      link: project?.link || '',
      featured: project?.featured ?? false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertPortfolioProject) => {
      if (project) {
        return apiRequest(`/api/portfolio-projects/${project.id}`, 'PUT', data);
      }
      return apiRequest('/api/portfolio-projects', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio-projects'] });
      setOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: FormData) => {
    const technologies = data.technologiesText
      ? data.technologiesText.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    
    const { technologiesText, ...projectData } = data;
    mutation.mutate({ ...projectData, technologies });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {project ? 'Редактировать проект' : 'Добавить проект'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Название</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
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
                  <FormLabel className="text-white">Описание</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-gray-800 border-gray-600 text-white" />
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
                  <FormLabel className="text-white">URL изображения</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="technologiesText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Технологии (через запятую)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="React, Node.js, PostgreSQL" className="bg-gray-800 border-gray-600 text-white" />
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
                  <FormLabel className="text-white">Ссылка на проект</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} className="bg-gray-800 border-gray-600 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-white">Рекомендуемый проект</FormLabel>
                    <div className="text-gray-400 text-sm">Отображать на главной странице</div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {mutation.isPending ? 'Сохранение...' : (project ? 'Сохранить' : 'Добавить')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}