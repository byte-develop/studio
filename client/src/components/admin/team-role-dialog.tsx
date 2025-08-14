import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { insertTeamRoleSchema, type TeamRole, type InsertTeamRole } from '@shared/schema';

interface TeamRoleDialogProps {
  children: React.ReactNode;
  role?: TeamRole;
}

export function TeamRoleDialog({ children, role }: TeamRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<InsertTeamRole>({
    resolver: zodResolver(insertTeamRoleSchema),
    defaultValues: {
      title: role?.title || '',
      description: role?.description || '',
      icon: role?.icon || 'Users',
      count: role?.count || 1,
      color: role?.color || 'blue',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertTeamRole) => {
      if (role) {
        return apiRequest('PUT', `/api/team-roles/${role.id}`, data);
      }
      return apiRequest('POST', '/api/team-roles', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-roles'] });
      setOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: InsertTeamRole) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white text-xl font-semibold">
            {role ? 'Редактировать роль' : 'Добавить роль'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-900 dark:text-white">Название роли</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
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
                  <FormLabel className="text-slate-900 dark:text-white">Описание</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" />
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
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Количество участников</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number"
                      min="1"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      className="bg-gray-800 border-gray-600 text-white" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Цвет</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Выберите цвет" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="blue">Синий</SelectItem>
                      <SelectItem value="green">Зеленый</SelectItem>
                      <SelectItem value="purple">Фиолетовый</SelectItem>
                      <SelectItem value="orange">Оранжевый</SelectItem>
                      <SelectItem value="red">Красный</SelectItem>
                      <SelectItem value="yellow">Желтый</SelectItem>
                      <SelectItem value="pink">Розовый</SelectItem>
                      <SelectItem value="gray">Серый</SelectItem>
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
              {mutation.isPending ? 'Сохранение...' : (role ? 'Сохранить' : 'Добавить')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}