import { useLocation } from "wouter";
import { 
  MapIcon, 
  LayoutDashboardIcon, 
  BuildingIcon, 
  TruckIcon, 
  SettingsIcon, 
  LogOutIcon,
  GlobeIcon
} from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  href: string;
  active: boolean;
}

const NavItem = ({ icon, text, href, active }: NavItemProps) => {
  const [, navigate] = useLocation();
  return (
    <li>
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          navigate(href);
        }}
        className={`flex items-center px-5 py-3 ${
          active
            ? "text-primary-foreground bg-primary bg-opacity-20 border-r-4 border-primary"
            : "text-muted-foreground hover:bg-muted/50"
        }`}
      >
        {icon}
        <span className="ml-3">{text}</span>
      </a>
    </li>
  );
};

const Sidebar = () => {
  const [location] = useLocation();

  return (
    <aside className="w-64 hidden md:flex flex-col bg-card border-r border-border">
      <div className="p-5 border-b border-border">
        <h1 className="text-xl font-semibold flex items-center gap-2 text-primary">
          <GlobeIcon className="h-5 w-5" />
          <span>SupplyViz</span>
        </h1>
      </div>
      <nav className="flex-grow py-5">
        <ul className="space-y-1">
          <NavItem
            icon={<MapIcon className="h-5 w-5" />}
            text="Map View"
            href="/"
            active={location === "/"}
          />
          <NavItem
            icon={<LayoutDashboardIcon className="h-5 w-5" />}
            text="KPI Dashboard"
            href="/dashboard"
            active={location === "/dashboard"}
          />
          <NavItem
            icon={<BuildingIcon className="h-5 w-5" />}
            text="Supplier Management"
            href="/suppliers"
            active={location === "/suppliers"}
          />
          <NavItem
            icon={<TruckIcon className="h-5 w-5" />}
            text="Shipments"
            href="/shipments"
            active={location === "/shipments"}
          />
          <NavItem
            icon={<SettingsIcon className="h-5 w-5" />}
            text="Settings"
            href="/settings"
            active={location === "/settings"}
          />
        </ul>
      </nav>
      <div className="p-5 border-t border-border">
        <a href="#" className="flex items-center text-muted-foreground hover:text-foreground">
          <LogOutIcon className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
