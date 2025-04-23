import { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

// Define which routes are accessible to which roles
const roleBasedRoutes: {
  path: string;
  allowedRoles: string[];
}[] = [
  { path: "/", allowedRoles: ["STAFF", "MANAGER", "ADMIN"] },
  { path: "/my-requests", allowedRoles: ["STAFF", "MANAGER"] },
  { path: "/team-calendar", allowedRoles: ["STAFF", "MANAGER", "ADMIN"] },
  { path: "/apply", allowedRoles: ["STAFF", "MANAGER", "ADMIN"] },
  { path: "/profile-setup", allowedRoles: ["STAFF", "MANAGER", "ADMIN"] },
  { path: "/approvals", allowedRoles: ["MANAGER", "ADMIN"] },
  { path: "/team", allowedRoles: ["MANAGER", "ADMIN"] },
  { path: "/reports", allowedRoles: ["ADMIN"] },
  { path: "/settings", allowedRoles: ["ADMIN"] },
];

export const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuth();
  const { isCollapsed } = useSidebar();
  const location = useLocation();
  console.log(user, "user in protected route");
  // Check if the user is authenticated

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  

  if (user?.role && location.pathname !== "/profile-setup") {
    const currentRoute = roleBasedRoutes.find(
      (route) =>
        location.pathname === route.path ||
        (route.path !== "/" && location.pathname.startsWith(route.path))
    );

    if (currentRoute && !currentRoute.allowedRoles.includes(user.role)) {
      toast.error("Access denied", {
        description: "You don't have permission to access this page",
      });
      return <Navigate to="/" replace />;
    }
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
