import { Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  showAddButton?: boolean;
}

const Header = ({ title, showAddButton = true }: HeaderProps) => {
  const handleAddShipment = () => {
    const event = new CustomEvent('openAddShipmentModal');
    window.dispatchEvent(event);
  };

  return (
    <header className="bg-primary py-4 px-6 flex justify-between items-center border-b border-gray-700">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center space-x-4">
        {showAddButton && (
          <Button 
            onClick={handleAddShipment}
            className="bg-accent hover:bg-teal-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Shipment
          </Button>
        )}
        <div className="relative">
          <button className="flex items-center text-gray-300 hover:text-white">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="ml-2 font-medium">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
