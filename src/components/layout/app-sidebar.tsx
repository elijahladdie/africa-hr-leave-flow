
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
} from "@/components/ui/sidebar";
import { 
  Calendar, 
  FileText, 
  Home, 
  Users, 
  Clock, 
  Bell, 
  Settings,
  BarChart4,
  UserCog
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type MenuItem = {
  title: string;
  url: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  roles: ('staff' | 'manager' | 'admin')[];
}

// Menu items with role-based visibility
const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    roles: ["staff", "manager", "admin"],
  },
  {
    title: "My Requests",
    url: "/my-requests",
    icon: FileText,
    roles: ["staff", "manager", "admin"],
  },
  {
    title: "Team Calendar",
    url: "/team-calendar",
    icon: Calendar,
    roles: ["staff", "manager", "admin"],
  },
  {
    title: "Approvals",
    url: "/approvals",
    icon: Clock,
    roles: ["manager", "admin"],
  },
  {
    title: "Team Management",
    url: "/team",
    icon: Users,
    roles: ["manager", "admin"],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart4,
    roles: ["admin"],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export function AppSidebar() {
  // In a real app, this would come from auth context or API
  const [userRole, setUserRole] = useState<'staff' | 'manager' | 'admin'>('staff');
  const [activePage, setActivePage] = useState('/');
  
  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );
  
  // Temporary function to change roles (for demo purposes)
  const changeRole = () => {
    if (userRole === 'staff') setUserRole('manager');
    else if (userRole === 'manager') setUserRole('admin');
    else setUserRole('staff');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="font-semibold text-lg text-white">AHR</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">Africa HR</span>
            <span className="text-xs text-muted-foreground">Leave Management</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    variant="default"
                    asChild
                    className={activePage === item.url ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" : ""}
                    onClick={() => setActivePage(item.url)}
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
        
        {/* User role controls (just for demo) */}
        <div className="mt-4 px-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Current Role:</span>
            <span className="font-medium capitalize">{userRole}</span>
          </div>
          <button 
            onClick={changeRole} 
            className="mt-1 text-xs bg-sidebar-accent w-full rounded-md py-1 hover:bg-sidebar-accent/80 transition-colors"
          >
            Switch Role (Demo)
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
