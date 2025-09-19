import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  DollarSign, 
  Settings 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import kiliLogo from "@/assets/kili-logo.png";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Players", url: "/players", icon: Users },
  { title: "Sessions", url: "/sessions", icon: Calendar },
  { title: "Bookings", url: "/bookings", icon: BookOpen },
  { title: "Finance", url: "/finance", icon: DollarSign },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    return isActive(path) 
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-sidebar-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-primary transition-colors";
  };

  return (
    <Sidebar
      className={`transition-all duration-300 ${state === "collapsed" ? "w-16" : "w-64"}`}
      collapsible="icon"
    >
      <SidebarContent>
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img 
              src={kiliLogo} 
              alt="Kili Pickleball Club" 
              className="h-8 w-auto"
            />
            {state !== "collapsed" && (
              <div>
                <h2 className="font-bold text-sidebar-foreground">Kili Pickleball</h2>
                <p className="text-xs text-sidebar-foreground/70">Club Management</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80 font-medium">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavClass(item.url)}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {state !== "collapsed" && (
                        <span className="ml-3 font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}