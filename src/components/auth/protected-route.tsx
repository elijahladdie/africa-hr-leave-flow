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
        <div className="md:basis-full  basis-[95%]">
          <AppSidebar />
        </div>
        <div className="flex-1 pl-4 pr-4 md:pl-8 md:pr-8 pt-4 pb-4 overflow-x-hidden transition-all duration-300">
          <div className="max-w-[1400px] mx-auto w-full">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
};
