
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useAuth } from "@/contexts/auth-context";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 overflow-x-hidden transition-all duration-300">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
