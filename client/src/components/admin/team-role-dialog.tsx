import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
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
      title_ru: role?.title_ru || role?.title || '',
      title_en: role?.title_en || '',
      description_ru: role?.description_ru || role?.description || '',
      description_en: role?.description_en || '',
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
    // Set legacy fields for backward compatibility
    const submitData = {
      ...data,
      title: data.title_ru || data.title || '',
      description: data.description_ru || data.description || '',
    };
    mutation.mutate(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 text-white max-w-lg w-[95vw] md:w-full">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">
            {role ? 'Редактировать роль' : 'Добавить роль'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {role ? 'Измените информацию о роли в команде' : 'Создайте новую роль для команды'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title_ru"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Название роли (Русский)</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Название роли (English)</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="description_ru"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Описание (Русский)</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Описание (English)</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Количество человек</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="1"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20" 
                      />
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
                    <FormLabel className="text-slate-300">Иконка</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600/50 text-white focus:border-purple-400 focus:ring-purple-400/20">
                          <SelectValue placeholder="Выберите иконку" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="Users">👥 Users</SelectItem>
                        <SelectItem value="Code">💻 Code</SelectItem>
                        <SelectItem value="Palette">🎨 Palette</SelectItem>
                        <SelectItem value="Smartphone">📱 Smartphone</SelectItem>
                        <SelectItem value="Server">🖥️ Server</SelectItem>
                        <SelectItem value="Database">🗄️ Database</SelectItem>
                        <SelectItem value="Brain">🧠 Brain</SelectItem>
                        <SelectItem value="Shield">🛡️ Shield</SelectItem>
                        <SelectItem value="Target">🎯 Target</SelectItem>
                        <SelectItem value="Briefcase">💼 Briefcase</SelectItem>
                        <SelectItem value="Settings">⚙️ Settings</SelectItem>
                        <SelectItem value="Rocket">🚀 Rocket</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Цвет</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600/50 text-white focus:border-purple-400 focus:ring-purple-400/20">
                          <SelectValue placeholder="Выберите цвет" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="blue">🔵 Синий</SelectItem>
                        <SelectItem value="purple">🟣 Фиолетовый</SelectItem>
                        <SelectItem value="green">🟢 Зеленый</SelectItem>
                        <SelectItem value="orange">🟠 Оранжевый</SelectItem>
                        <SelectItem value="red">🔴 Красный</SelectItem>
                        <SelectItem value="pink">🩷 Розовый</SelectItem>
                        <SelectItem value="cyan">🔷 Голубой</SelectItem>
                        <SelectItem value="yellow">🟡 Желтый</SelectItem>
                        <SelectItem value="indigo">🟦 Индиго</SelectItem>
                        <SelectItem value="emerald">💚 Изумрудный</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                className="flex-1 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg"
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