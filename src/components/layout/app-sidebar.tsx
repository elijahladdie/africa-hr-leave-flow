import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Calendar,
  FileText,
  Home,
  Users,
  Clock,
  Settings,
  BarChart4,
  ChevronRight,
  UserCircle,
  LogOut,
  Bell,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import NotificationPopup from "../dashboard/notification-popup";

type MenuItem = {
  title: string;
  url: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  roles: string[];
};

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    roles: ["STAFF", "MANAGER", "ADMIN"],
  },
  {
    title: "My Requests",
    url: "/my-requests",
    icon: FileText,
    roles: ["STAFF", "MANAGER"],
  },
  {
    title: "Team Calendar",
    url: "/team-calendar",
    icon: Calendar,
    roles: ["STAFF", "MANAGER", "ADMIN"],
  },
  {
    title: "Approvals",
    url: "/approvals",
    icon: Clock,
    roles: ["MANAGER", "ADMIN"],
  },
  {
    title: "Team Management",
    url: "/team",
    icon: Users,
    roles: ["MANAGER", "ADMIN"],
  },
  { title: "Reports", url: "/reports", icon: BarChart4, roles: ["ADMIN"] },
  { title: "Settings", url: "/settings", icon: Settings, roles: ["ADMIN"] },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const isMobile = useIsMobile();

  const filteredMenuItems = menuItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  useEffect(() => {
    if (isMobile && !isCollapsed) {
      setIsCollapsed(true);
    }
  }, [isMobile, isCollapsed, setIsCollapsed]);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  if (isCollapsed) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsCollapsed(false)}
          className="rounded-full p-2 border bg-background text-foreground shadow hover:bg-muted"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }
console.log(user, "user in app sidebar");
  return (
    <Sidebar className="transition-all duration-300">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="font-semibold text-lg text-white">LV</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">LV Africa</span>
            <span className="text-xs text-muted-foreground">
              Leave Management
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="absolute right-0 top-5 -mr-4 flex h-7 w-7 items-center justify-center rounded-full border bg-background text-foreground shadow-sm hover:bg-muted lg:block hidden"
        >
          {/* Collapse button */}
          <ChevronRight className="h-4 w-4" />
        </button>
      </SidebarHeader>
      <SidebarContent>
        {/* User info */}
        <div className="mb-6 px-3 py-2 flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarImage src={user?.profilePictureUrl} alt={user?.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="truncate">
            <p className="text-sm font-medium">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Notification Button */}
        <div className="mb-4 px-3">
          <NotificationPopup />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    variant="default"
                    asChild
                    className={
                      location.pathname === item.url
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : ""
                    }
                  >
                    <Link to={item.url} className="flex items-center">
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User actions */}
        <div className="mt-auto pt-4 px-3">
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton variant="ghost" asChild>
                    <Link to="/profile" className="flex items-center">
                      <UserCircle className="h-4 w-4 mr-2" />
                      <span>My Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sign Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="mt-6 text-xs text-muted-foreground text-center">
            <p>LV Africa Leave System</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
