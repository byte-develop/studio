import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { insertTechnologySchema, type Technology, type InsertTechnology } from '@shared/schema';

interface TechnologyDialogProps {
  children: React.ReactNode;
  technology?: Technology;
}

export function TechnologyDialog({ children, technology }: TechnologyDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<InsertTechnology>({
    resolver: zodResolver(insertTechnologySchema),
    defaultValues: {
      name: technology?.name || '',
      icon: technology?.icon || 'Code',
      category: technology?.category || 'frontend',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertTechnology) => {
      if (technology) {
        return apiRequest('PUT', `/api/technologies/${technology.id}`, data);
      }
      return apiRequest('POST', '/api/technologies', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/technologies'] });
      setOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: InsertTechnology) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {technology ? 'Редактировать технологию' : 'Добавить технологию'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
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
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Иконка (Lucide React)</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Категория</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {mutation.isPending ? 'Сохранение...' : (technology ? 'Сохранить' : 'Добавить')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}