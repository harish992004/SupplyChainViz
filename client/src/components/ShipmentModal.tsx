import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Printer, X } from "lucide-react";
import { Shipment } from "@shared/schema";

interface ShipmentModalProps {
  shipment: Shipment;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShipmentModal({ shipment, isOpen, onClose }: ShipmentModalProps) {
  // Format shipment status for display
  const formatStatus = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      "on-time": { label: "On Time", className: "bg-green-100 text-green-800" },
      "in-transit": { label: "In Transit", className: "bg-yellow-100 text-yellow-800" },
      "delayed": { label: "Delayed", className: "bg-red-100 text-red-800" },
      "delivered": { label: "Delivered", className: "bg-blue-100 text-blue-800" },
      "pending": { label: "Pending", className: "bg-gray-100 text-gray-800" }
    };

    return statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
  };

  const statusInfo = formatStatus(shipment.status);

  // Format dates
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="border-b border-gray-700 pb-2">
          <DialogTitle className="text-lg">Shipment Details</DialogTitle>
          <Button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Shipment ID</p>
            <p className="text-white">{shipment.shipmentId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Status</p>
            <p>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Product</p>
            <p className="text-white">{shipment.product}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Cost</p>
            <p className="text-white">${shipment.cost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Estimated Arrival</p>
            <p className="text-white">{formatDate(shipment.eta)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Created</p>
            <p className="text-white">{formatDate(shipment.createdAt || new Date())}</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-white font-medium mb-3">Shipment Progress</h4>
          <div className="relative">
            <div className="absolute h-full w-0.5 bg-gray-700 left-2.5 top-0"></div>
            <div className="ml-5 space-y-4">
              <div className="relative">
                <div className="absolute -left-5 mt-1.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white">Departed from Supplier</p>
                  <p className="text-sm text-gray-400">{formatDate(new Date(shipment.createdAt || new Date()))}</p>
                </div>
              </div>
              
              {shipment.status === "in-transit" && (
                <div className="relative">
                  <div className="absolute -left-5 mt-1.5 w-5 h-5 rounded-full bg-accent-light flex items-center justify-center animate-pulse">
                    <svg className="h-3 w-3 text-white animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white">In Transit to Destination</p>
                    <p className="text-sm text-gray-400">Current</p>
                  </div>
                </div>
              )}
              
              <div className="relative">
                <div className="absolute -left-5 mt-1.5 w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
                  <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400">Expected Delivery</p>
                  <p className="text-sm text-gray-500">{formatDate(shipment.eta)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-700 pt-4">
          <Button variant="outline" className="mr-2">
            <QrCode className="mr-2 h-4 w-4" /> Generate QR
          </Button>
          <Button>
            <Printer className="mr-2 h-4 w-4" /> Print Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
