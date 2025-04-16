
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LeaveApplication from "./pages/LeaveApplication";
import LeaveHistory from "./pages/LeaveHistory";
import ApprovalDashboard from "./pages/ApprovalDashboard";
import TeamCalendarPage from "./pages/TeamCalendarPage";
import AdminSettings from "./pages/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 ml-[240px] transition-all duration-300">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/apply" element={<LeaveApplication />} />
                <Route path="/my-requests" element={<LeaveHistory />} />
                <Route path="/approvals" element={<ApprovalDashboard />} />
                <Route path="/team-calendar" element={<TeamCalendarPage />} />
                <Route path="/settings" element={<AdminSettings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
