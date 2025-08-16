import { QueryClientProvider } from '@tanstack/react-query';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { SocketProvider } from '@/contexts/socket-context';
import { AuthProvider } from '@/contexts/auth-context';
import { queryClient } from '@/lib/query-client';
import { Dashboard } from '@/pages/dashboard';
import { Project } from '@/pages/project';
import { Settings } from '@/pages/settings';
import { Login } from '@/pages/login';
import { NotFound } from '@/pages/not-found';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/login" component={Login} />
                <Route path="/project/:id" component={Project} />
                <Route path="/settings" component={Settings} />
                <Route component={NotFound} />
              </Switch>
              <Toaster />
            </div>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}