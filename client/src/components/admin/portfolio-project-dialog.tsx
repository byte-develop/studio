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
        return apiRequest('PUT', `/api/portfolio-projects/${project.id}`, data);
      }
      return apiRequest('POST', '/api/portfolio-projects', data);
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
      <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 text-white max-w-2xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">
            {project ? 'Редактировать проект' : 'Добавить проект'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Название проекта</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20" />
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
                  <FormLabel className="text-slate-300">Описание</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 min-h-[120px]" />
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
                  <FormLabel className="text-slate-300">URL изображения</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20" />
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
                  <FormLabel className="text-slate-300">Технологии (через запятую)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="React, Node.js, PostgreSQL" className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20" />
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
                  <FormLabel className="text-slate-300">Ссылка на проект</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-4 border border-slate-600/50 rounded-xl bg-slate-800/30">
                  <div className="space-y-0.5">
                    <FormLabel className="text-slate-300">Рекомендуемый проект</FormLabel>
                    <p className="text-sm text-slate-400">
                      Отображать в топе портфолио
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border-slate-600/50"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
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