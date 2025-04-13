import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  TruckIcon,
  MapIcon,
  BarChart3Icon,
  Factory,
  PackageIcon,
  WarehouseIcon,
  UserIcon,
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle resizing of window
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { href: "/map", label: "Map View", icon: <MapIcon className="w-5 mr-3" /> },
    { href: "/kpi", label: "KPI Dashboard", icon: <BarChart3Icon className="w-5 mr-3" /> },
    { href: "/suppliers", label: "Supplier Management", icon: <Factory className="w-5 mr-3" /> },
    { href: "/shipments", label: "Shipments", icon: <PackageIcon className="w-5 mr-3" /> },
    { href: "/warehouses", label: "Warehouse Management", icon: <WarehouseIcon className="w-5 mr-3" /> },
  ];

  return (
    <>
      {/* Mobile menu toggle button */}
      <div className="lg:hidden fixed top-0 left-0 z-30 p-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-card text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside 
        className={cn(
          "sidebar bg-sidebar z-20 h-full w-64 fixed left-0 top-0 overflow-y-auto flex-shrink-0 transition-all duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-4 flex items-center justify-center border-b border-gray-700">
          <h1 className="text-xl font-bold text-white flex items-center">
            <TruckIcon className="mr-3 text-accent" />
            SupplyViz
          </h1>
        </div>
        <nav className="mt-5">
          <ul>
            {links.map(link => (
              <li key={link.href}>
                <Link href={link.href}>
                  <a 
                    className={cn(
                      "flex items-center px-4 py-3",
                      location === link.href 
                        ? "text-white bg-gray-800" 
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    {React.cloneElement(link.icon, {
                      className: cn(
                        link.icon.props.className,
                        location === link.href ? "text-accent" : ""
                      )
                    })}
                    <span>{link.label}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-4 py-3 mt-auto border-t border-gray-700 fixed bottom-0 w-64 bg-sidebar">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-gray-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">admin@supplyviz.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
