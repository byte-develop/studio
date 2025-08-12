import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ADMIN_PASSWORD = 'vertex2024';

export function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setLocation('/admin');
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в админ-панель!",
      });
    } else {
      toast({
        title: "Неверный пароль",
        description: "Проверьте правильность введенного пароля",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-neon-cyan/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-neon-cyan" />
            </div>
            <CardTitle className="text-2xl text-white">
              Вход в админ-панель
            </CardTitle>
            <p className="text-gray-400">
              Введите пароль для доступа к панели управления
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-900 border-gray-600 text-white pr-12"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full bg-neon-cyan hover:bg-neon-cyan/80 text-black font-semibold"
              >
                Войти
              </Button>
            </form>
            <div className="mt-6 p-4 bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-400 text-center">
                Пароль для демонстрации: <span className="text-neon-cyan font-mono">vertex2024</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}