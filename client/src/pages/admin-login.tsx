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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-slate-800 animate-pulse"></div>
            </div>
            <CardTitle className="text-3xl text-white font-bold mb-3">
              Вход в админ-панель
            </CardTitle>
            <p className="text-slate-300 text-lg">
              Введите пароль для доступа к панели управления
            </p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900/50 border-slate-600/50 text-white pr-12 h-12 text-lg placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-700/50 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                  )}
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
              >
                Войти в систему
              </Button>
            </form>
            <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-cyan-300 font-semibold">Демонстрационный доступ</span>
              </div>
              <p className="text-slate-300 text-sm">
                Пароль: <span className="text-cyan-400 font-mono font-semibold bg-slate-900/50 px-2 py-1 rounded">vertex2024</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}