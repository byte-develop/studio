import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertTeamRoleSchema, type TeamRole } from '@shared/schema';
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

const formSchema = insertTeamRoleSchema;

interface TeamRoleDialogProps {
  children: React.ReactNode;
  role?: TeamRole;
}

const colors = [
  { value: 'blue', label: 'Синий' },
  { value: 'purple', label: 'Фиолетовый' },
  { value: 'green', label: 'Зеленый' },
  { value: 'orange', label: 'Оранжевый' },
  { value: 'red', label: 'Красный' },
  { value: 'yellow', label: 'Желтый' },
  { value: 'pink', label: 'Розовый' },
  { value: 'indigo', label: 'Индиго' },
];

const icons = [
  'Code', 'Palette', 'Settings', 'Users', 'Monitor', 'Smartphone', 'Bot',
  'Shield', 'Zap', 'Globe', 'Database', 'Terminal', 'Layout', 'Camera',
  'Headphones', 'Briefcase', 'Target', 'TrendingUp'
];

export function TeamRoleDialog({ children, role }: TeamRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: role?.title || '',
      description: role?.description || '',
      icon: role?.icon || 'Users',
      count: role?.count || 1,
      color: role?.color || 'blue',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (role) {
        return apiRequest(`/api/team-roles/${role.id}`, 'PUT', {
          body: JSON.stringify(data),
        });
      } else {
        return apiRequest('/api/team-roles', 'POST', {
          body: JSON.stringify(data),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-roles'] });
      toast({
        title: 'Успешно',
        description: role ? 'Роль обновлена' : 'Роль добавлена',
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить роль',
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
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>
            {role ? 'Редактировать роль' : 'Добавить роль команды'}
          </DialogTitle>
          <DialogDescription>
            {role ? 'Изменить данные роли' : 'Добавить новую роль в команду'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название роли</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Разработчики, Дизайнеры..."
                      className="bg-gray-800 border-gray-600"
                      {...field}
                      data-testid="input-role-title"
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
                      placeholder="Описание роли"
                      className="bg-gray-800 border-gray-600 min-h-[80px]"
                      {...field}
                      data-testid="textarea-role-description"
                    />
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
                  <FormLabel>Количество участников</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      className="bg-gray-800 border-gray-600"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                      data-testid="input-role-count"
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
                  <FormLabel>Иконка</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-600" data-testid="select-role-icon">
                        <SelectValue placeholder="Выберите иконку" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {icons.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
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
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цвет</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-600" data-testid="select-role-color">
                        <SelectValue placeholder="Выберите цвет" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {colors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          {color.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                data-testid="button-save-role"
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