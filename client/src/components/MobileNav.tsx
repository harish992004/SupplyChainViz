import { useLocation } from "wouter";
import { 
  MapIcon, 
  LayoutDashboardIcon, 
  BuildingIcon, 
  TruckIcon, 
  SettingsIcon,
  XIcon,
  GlobeIcon
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const [location, navigate] = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex justify-around">
          <button 
            className={`p-4 ${location === "/" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => handleNavigation("/")}
          >
            <MapIcon className="h-5 w-5" />
          </button>
          <button 
            className={`p-4 ${location === "/dashboard" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => handleNavigation("/dashboard")}
          >
            <LayoutDashboardIcon className="h-5 w-5" />
          </button>
          <button 
            className={`p-4 ${location === "/suppliers" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => handleNavigation("/suppliers")}
          >
            <BuildingIcon className="h-5 w-5" />
          </button>
          <button 
            className={`p-4 ${location === "/shipments" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => handleNavigation("/shipments")}
          >
            <TruckIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <SheetHeader className="p-5 border-b border-border">
            <SheetTitle className="flex items-center gap-2 text-primary">
              <GlobeIcon className="h-5 w-5" />
              <span>SupplyViz</span>
              <button 
                onClick={onClose} 
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <nav>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleNavigation("/")}
                    className={`w-full text-left flex items-center px-5 py-3 ${
                      location === "/" 
                        ? "text-primary-foreground bg-primary bg-opacity-20 border-l-4 border-primary" 
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <MapIcon className="h-5 w-5 mr-3" />
                    <span>Map View</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/dashboard")}
                    className={`w-full text-left flex items-center px-5 py-3 ${
                      location === "/dashboard" 
                        ? "text-primary-foreground bg-primary bg-opacity-20 border-l-4 border-primary" 
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <LayoutDashboardIcon className="h-5 w-5 mr-3" />
                    <span>KPI Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/suppliers")}
                    className={`w-full text-left flex items-center px-5 py-3 ${
                      location === "/suppliers" 
                        ? "text-primary-foreground bg-primary bg-opacity-20 border-l-4 border-primary" 
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <BuildingIcon className="h-5 w-5 mr-3" />
                    <span>Supplier Management</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/shipments")}
                    className={`w-full text-left flex items-center px-5 py-3 ${
                      location === "/shipments" 
                        ? "text-primary-foreground bg-primary bg-opacity-20 border-l-4 border-primary" 
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <TruckIcon className="h-5 w-5 mr-3" />
                    <span>Shipments</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/settings")}
                    className={`w-full text-left flex items-center px-5 py-3 ${
                      location === "/settings" 
                        ? "text-primary-foreground bg-primary bg-opacity-20 border-l-4 border-primary" 
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <SettingsIcon className="h-5 w-5 mr-3" />
                    <span>Settings</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileNav;
