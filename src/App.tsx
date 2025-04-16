
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LeaveApplication from "./pages/LeaveApplication";
import LeaveHistory from "./pages/LeaveHistory";
import ApprovalDashboard from "./pages/ApprovalDashboard";
import TeamCalendarPage from "./pages/TeamCalendarPage";
import AdminSettings from "./pages/AdminSettings";
import Login from "./pages/Login";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AuthProvider } from "@/contexts/auth-context";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/apply" 
                element={
                  <ProtectedRoute>
                    <LeaveApplication />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/my-requests" 
                element={
                  <ProtectedRoute>
                    <LeaveHistory />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/approvals" 
                element={
                  <ProtectedRoute>
                    <ApprovalDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/team-calendar" 
                element={
                  <ProtectedRoute>
                    <TeamCalendarPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
