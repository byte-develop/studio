import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckSquare } from 'lucide-react';

const demoUsers = [
  { id: 1, name: 'Alex Johnson', email: 'alex@company.com', role: 'project_manager', avatar: '👨‍💼' },
  { id: 2, name: 'Sarah Chen', email: 'sarah@company.com', role: 'developer', avatar: '👩‍💻' },
  { id: 3, name: 'Mike Wilson', email: 'mike@company.com', role: 'designer', avatar: '👨‍🎨' },
  { id: 4, name: 'Lisa Park', email: 'lisa@company.com', role: 'admin', avatar: '👩‍💼' },
] as const;

export function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const handleLogin = async (userId: number) => {
    setIsLoading(true);
    setSelectedUser(userId);
    
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = demoUsers.find(u => u.id === userId);
    if (user) {
      login({
        ...user,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setLocation('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <CheckSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Task Management System</CardTitle>
          <CardDescription>
            Select a demo user to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {demoUsers.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="justify-start h-auto p-4 text-left"
                onClick={() => handleLogin(user.id)}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3 w-full">
                  <span className="text-2xl">{user.avatar}</span>
                  <div className="flex-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {user.role.replace('_', ' ')}
                    </div>
                  </div>
                  {isLoading && selectedUser === user.id && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
              </Button>
            ))}
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              This is a demo application. In production, you would integrate with your authentication system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}