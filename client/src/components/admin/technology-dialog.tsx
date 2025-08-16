import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { insertTechnologySchema, type Technology, type InsertTechnology } from '@shared/schema';

interface TechnologyDialogProps {
  children: React.ReactNode;
  technology?: Technology;
}

const categories = [
  'Frontend',
  'Backend', 
  'Database',
  'DevOps',
  'Mobile',
  'Tools',
  'Design',
  'Other'
];

export function TechnologyDialog({ children, technology }: TechnologyDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<InsertTechnology>({
    resolver: zodResolver(insertTechnologySchema),
    defaultValues: {
      name: technology?.name || '',
      category: technology?.category || '',
      icon: technology?.icon || 'Code',
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 text-white max-w-lg w-[95vw] md:w-full">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">
            {technology ? 'Редактировать технологию' : 'Добавить технологию'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {technology ? 'Обновите информацию о технологии' : 'Добавьте новую технологию в стек'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Название технологии</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-400/20" />
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
                  <FormLabel className="text-slate-300">Категория</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600/50 text-white focus:border-orange-400 focus:ring-orange-400/20">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="hover:bg-slate-700 focus:bg-slate-700">
                          {category}
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
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Иконка</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600/50 text-white focus:border-orange-400 focus:ring-orange-400/20">
                        <SelectValue placeholder="Выберите иконку" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-80 overflow-y-auto">
                      {/* Frontend Technologies */}
                      <SelectItem value="Code">💻 Code (универсальная)</SelectItem>
                      <SelectItem value="Globe">🌐 Globe (веб)</SelectItem>
                      <SelectItem value="Layout">📱 Layout (UI/UX)</SelectItem>
                      <SelectItem value="Palette">🎨 Palette (дизайн)</SelectItem>
                      <SelectItem value="Brush">🖌️ Brush (дизайн)</SelectItem>
                      <SelectItem value="Figma">🎯 Figma</SelectItem>
                      
                      {/* JavaScript/TypeScript */}
                      <SelectItem value="Zap">⚡ Zap (быстрые технологии)</SelectItem>
                      <SelectItem value="Coffee">☕ Coffee (JavaScript)</SelectItem>
                      <SelectItem value="FileText">📄 FileText (документы)</SelectItem>
                      
                      {/* Backend/Server */}
                      <SelectItem value="Server">🖥️ Server</SelectItem>
                      <SelectItem value="Database">💾 Database</SelectItem>
                      <SelectItem value="HardDrive">💿 HardDrive</SelectItem>
                      <SelectItem value="Cloud">☁️ Cloud</SelectItem>
                      <SelectItem value="Api">🔗 Api</SelectItem>
                      
                      {/* Mobile */}
                      <SelectItem value="Smartphone">📱 Smartphone</SelectItem>
                      <SelectItem value="Tablet">📱 Tablet</SelectItem>
                      <SelectItem value="Monitor">🖥️ Monitor</SelectItem>
                      
                      {/* DevOps/Tools */}
                      <SelectItem value="Settings">⚙️ Settings</SelectItem>
                      <SelectItem value="Cog">🔧 Cog</SelectItem>
                      <SelectItem value="Wrench">🔨 Wrench</SelectItem>
                      <SelectItem value="GitBranch">🌿 GitBranch</SelectItem>
                      <SelectItem value="Package">📦 Package</SelectItem>
                      <SelectItem value="Terminal">💻 Terminal</SelectItem>
                      <SelectItem value="Command">⌨️ Command</SelectItem>
                      
                      {/* Data/Analytics */}
                      <SelectItem value="BarChart">📊 BarChart</SelectItem>
                      <SelectItem value="PieChart">🥧 PieChart</SelectItem>
                      <SelectItem value="TrendingUp">📈 TrendingUp</SelectItem>
                      <SelectItem value="Activity">📊 Activity</SelectItem>
                      
                      {/* Security */}
                      <SelectItem value="Shield">🛡️ Shield</SelectItem>
                      <SelectItem value="Lock">🔒 Lock</SelectItem>
                      <SelectItem value="Key">🔑 Key</SelectItem>
                      
                      {/* AI/ML */}
                      <SelectItem value="Brain">🧠 Brain</SelectItem>
                      <SelectItem value="Bot">🤖 Bot</SelectItem>
                      <SelectItem value="Cpu">💾 CPU</SelectItem>
                      <SelectItem value="Zap">⚡ Zap (быстрые вычисления)</SelectItem>
                      
                      {/* Gaming/3D */}
                      <SelectItem value="Gamepad2">🎮 Gamepad</SelectItem>
                      <SelectItem value="Box">📦 Box (3D)</SelectItem>
                      <SelectItem value="Layers">📚 Layers</SelectItem>
                      
                      {/* Network/Communication */}
                      <SelectItem value="Wifi">📡 Wifi</SelectItem>
                      <SelectItem value="Radio">📻 Radio</SelectItem>
                      <SelectItem value="Satellite">🛰️ Satellite</SelectItem>
                      
                      {/* Other Common */}
                      <SelectItem value="Star">⭐ Star</SelectItem>
                      <SelectItem value="Heart">❤️ Heart</SelectItem>
                      <SelectItem value="Grid">⚏ Grid</SelectItem>
                      <SelectItem value="Target">🎯 Target</SelectItem>
                      <SelectItem value="Rocket">🚀 Rocket</SelectItem>
                      <SelectItem value="Tool">🔧 Tool</SelectItem>
                    </SelectContent>
                  </Select>
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
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg"
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