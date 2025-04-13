import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddShipmentForm } from "@/components/forms/add-shipment-form";
import { X } from "lucide-react";

export function AddShipmentModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener("openAddShipmentModal", handleOpenModal);
    
    return () => {
      window.removeEventListener("openAddShipmentModal", handleOpenModal);
    };
  }, []);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-secondary rounded-xl max-w-lg p-6 shadow-xl border-gray-700">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Add New Shipment</DialogTitle>
          <button 
            className="text-gray-400 hover:text-white" 
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>
        
        <AddShipmentForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
}
