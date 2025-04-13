import { useLocation, Link } from 'wouter';
import {
  LayoutDashboard,
  MapPin,
  Store,
  Truck,
  Plus,
  FileLineChart,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SidebarItem = ({ href, icon, label, onClick }: SidebarItemProps) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <div className="relative group">
      <Link href={href}>
        <a
          className={cn(
            "relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto",
            "shadow-lg bg-secondary text-accent hover:bg-accent hover:text-white",
            "rounded-xl transition-all duration-300 ease-linear",
            isActive && "bg-accent text-white"
          )}
          onClick={onClick}
        >
          {icon}
        </a>
      </Link>
      <span className="absolute w-auto p-2 m-2 min-w-max left-14 rounded-md shadow-md text-white bg-secondary text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-10">
        {label}
      </span>
    </div>
  );
};

const Sidebar = () => {
  const { toast } = useToast();
  
  const showAddShipmentModal = () => {
    const event = new CustomEvent('openAddShipmentModal');
    window.dispatchEvent(event);
  };
  
  const showComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature is not yet implemented.",
      duration: 3000,
    });
  };
  
  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-secondary text-white shadow-lg z-10">
      <SidebarItem
        href="/"
        icon={<LayoutDashboard className="h-6 w-6" />}
        label="Dashboard"
      />
      <SidebarItem
        href="/map"
        icon={<MapPin className="h-6 w-6" />}
        label="Map View"
      />
      <SidebarItem
        href="/suppliers"
        icon={<Store className="h-6 w-6" />}
        label="Suppliers"
      />
      <SidebarItem
        href="/shipments"
        icon={<Truck className="h-6 w-6" />}
        label="Shipments"
      />
      <hr className="bg-gray-600 border border-gray-600 rounded-full mx-2" />
      <SidebarItem
        href="#"
        icon={<Plus className="h-6 w-6" />}
        label="Add Shipment"
        onClick={showAddShipmentModal}
      />
      <SidebarItem
        href="#"
        icon={<FileLineChart className="h-6 w-6" />}
        label="Reports"
        onClick={showComingSoon}
      />
      <div className="mt-auto mb-10">
        <SidebarItem
          href="#"
          icon={<Settings className="h-6 w-6" />}
          label="Settings"
          onClick={showComingSoon}
        />
      </div>
    </div>
  );
};

export default Sidebar;
