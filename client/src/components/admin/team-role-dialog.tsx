import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
      count: role?.count || 1,
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
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(mutation.mutate)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Название роли</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20" />
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
                    <Textarea {...field} className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 min-h-[100px]" />
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