
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Wallet, 
  MenuIcon, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="w-5 h-5 mr-2" />,
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: <Receipt className="w-5 h-5 mr-2" />,
    },
    {
      title: "Categories",
      href: "/categories",
      icon: <PieChart className="w-5 h-5 mr-2" />,
    },
    {
      title: "Budgets",
      href: "/budgets",
      icon: <Wallet className="w-5 h-5 mr-2" />,
    },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-4">
        <div className="flex items-center mb-6 mt-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-finance-secondary to-finance-primary bg-clip-text text-transparent">
            FinFlow
          </span>
        </div>
        <nav className="space-y-1 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                location.pathname === link.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {link.icon}
              {link.title}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-border">
          <div className="px-4 py-2 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} FinFlow</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleMobileMenu}
      >
        {mobileMenuOpen ? <X /> : <MenuIcon />}
      </Button>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden bg-background/80 backdrop-blur-sm transition-opacity",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-card shadow-lg p-4">
          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-finance-secondary to-finance-primary bg-clip-text text-transparent">
              FinFlow
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={toggleMobileMenu}
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};
