import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useAuth } from "@/contexts/auth-context";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const { isCollapsed } = useSidebar();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className={`${isCollapsed ? "w-16" : "w-64"}  shrink-0`}>
          <AppSidebar />
        </div>
        <div className="flex-1 overflow-x-hidden transition-all duration-300">
          <div className="w-full max-w-screen-xl mx-auto px-4">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
