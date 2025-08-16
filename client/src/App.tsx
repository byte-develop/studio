import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/language-context";
import Home from "@/pages/home";
import { AdminPage } from "@/pages/admin";
import { AdminLoginPage } from "@/pages/admin-login";
import NotFound from "@/pages/not-found";
import { PortfolioPage } from "@/pages/portfolio";
import { TermsPage } from "@/pages/terms";
import { PrivacyPage } from "@/pages/privacy";
import WebDevelopmentPage from "@/pages/services/web-development";
import MobileDevelopmentPage from "@/pages/services/mobile-development";
import ThreeDWebGLPage from "@/pages/services/3d-webgl";
import BackendAPIPage from "@/pages/services/backend-api";
import AIMLPage from "@/pages/services/ai-ml";
import DevOpsCloudPage from "@/pages/services/devops-cloud";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/services/web-development" component={WebDevelopmentPage} />
      <Route path="/services/mobile-development" component={MobileDevelopmentPage} />
      <Route path="/services/3d-webgl" component={ThreeDWebGLPage} />
      <Route path="/services/backend-api" component={BackendAPIPage} />
      <Route path="/services/ai-ml" component={AIMLPage} />
      <Route path="/services/devops-cloud" component={DevOpsCloudPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="dark">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
