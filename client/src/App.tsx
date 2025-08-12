import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
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
      <Route path="/services/web-development" component={WebDevelopmentPage} />
      <Route path="/services/mobile-development" component={MobileDevelopmentPage} />
      <Route path="/services/3d-webgl" component={ThreeDWebGLPage} />
      <Route path="/services/backend-api" component={BackendAPIPage} />
      <Route path="/services/ai-ml" component={AIMLPage} />
      <Route path="/services/devops-cloud" component={DevOpsCloudPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
