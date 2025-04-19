
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

type MenuItem = {
  title: string;
  url: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  roles: string[];
};

const menuItems: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: Home, roles: ["Staff", "Manager", "Admin", "Department Head", "Executive"] },
  { title: "My Requests", url: "/my-requests", icon: FileText, roles: ["Staff", "Manager", "Admin", "Department Head", "Executive"] },
  { title: "Team Calendar", url: "/team-calendar", icon: Calendar, roles: ["Staff", "Manager", "Admin", "Department Head", "Executive"] },
  { title: "Approvals", url: "/approvals", icon: Clock, roles: ["Manager", "Admin", "Department Head", "Executive"] },
  { title: "Team Management", url: "/team", icon: Users, roles: ["Manager", "Admin", "Department Head", "Executive"] },
  { title: "Reports", url: "/reports", icon: BarChart4, roles: ["Admin", "Department Head", "Executive"] },
  { title: "Settings", url: "/settings", icon: Settings, roles: ["Admin"] },
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
    if (!user?.name) return "U";
    return user.name
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

  return (
    <Sidebar className="transition-all duration-300">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="font-semibold text-lg text-white">IST</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">IST Africa</span>
            <span className="text-xs text-muted-foreground">Leave Management</span>
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
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="truncate">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        
        {/* Notification Button */}
        <div className="mb-4 px-3">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            <span>Notifications</span>
            <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Button>
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
            <p>IST Africa Leave System</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
