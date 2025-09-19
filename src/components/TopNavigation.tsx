import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  DollarSign, 
  Settings,
  LogOut
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import kiliLogo from "@/assets/kili-logo.png";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Players", url: "/players", icon: Users },
  { title: "Bookings", url: "/bookings", icon: BookOpen },
  { title: "Finance", url: "/finance", icon: DollarSign },
  { title: "Sessions", url: "/sessions", icon: Calendar },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function TopNavigation() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-background w-full">
      {/* Top section with logo and club info */}
      <div className="w-full px-6 py-6">
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={kiliLogo} 
              alt="Kili Pickleball Club" 
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Kili Pickleball Club</h1>
              <p className="text-sm text-muted-foreground">Tanzania</p>
            </div>
          </div>
          {user && (
            <div className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation section */}
      <nav className="w-full px-6 pt-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end={item.url === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </NavLink>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>
    </header>
  );
}