import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X, Loader2 } from "lucide-react";
import { Supplier, ShipmentStatus, insertShipmentSchema } from "@shared/schema";

// Extend the shipment schema for the form
const shipmentFormSchema = insertShipmentSchema.extend({
  sourceId: z.string().min(1, "Source is required"),
  destinationId: z.string().min(1, "Destination is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  eta: z.string().min(1, "ETA is required"),
});

type ShipmentFormValues = z.infer<typeof shipmentFormSchema>;

interface AddShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
}

const AddShipmentModal = ({ isOpen, onClose, suppliers }: AddShipmentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate unique shipment ID
  const generateShipmentId = () => {
    return `SH-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  // Set default values
  const defaultValues: Partial<ShipmentFormValues> = {
    shipmentId: generateShipmentId(),
    sourceId: "",
    destinationId: "",
    productName: "",
    cost: "0.00",
    departureDate: new Date().toISOString().split("T")[0],
    eta: "",
    status: ShipmentStatus.PENDING
  };

  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: ShipmentFormValues) => {
    // Ensure the source and destination are different
    if (data.sourceId === data.destinationId) {
      form.setError("destinationId", {
        type: "manual",
        message: "Destination must be different from source"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert string IDs to numbers and dates to Date objects
      const submissionData = {
        ...data,
        sourceId: parseInt(data.sourceId),
        destinationId: parseInt(data.destinationId),
        cost: parseFloat(data.cost),
        departureDate: new Date(data.departureDate),
        eta: new Date(data.eta),
        actualDeliveryDate: null
      };

      await apiRequest("POST", "/api/shipments", submissionData);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/shipments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/kpi'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/shipments-over-time'] });
      
      toast({
        title: "Shipment created",
        description: `Shipment ${data.shipmentId} has been created successfully.`,
      });
      
      form.reset(defaultValues);
      onClose();
    } catch (error) {
      console.error("Error creating shipment:", error);
      toast({
        title: "Error",
        description: "Failed to create shipment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch source ID to filter out destination options
  const sourceId = form.watch("sourceId");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center justify-between">
            Add New Shipment
            <Button variant="ghost" size="icon" onClick={onClose} className="-mt-2 -mr-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shipmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipment ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter product name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sourceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destinationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers
                          .filter(supplier => supplier.id.toString() !== sourceId)
                          .map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                              {supplier.name}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ETA</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input {...field} type="number" step="0.01" min="0" className="pl-7" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ShipmentStatus.PENDING}>Pending</SelectItem>
                        <SelectItem value={ShipmentStatus.IN_TRANSIT}>In Transit</SelectItem>
                        <SelectItem value={ShipmentStatus.DELIVERED}>On Time</SelectItem>
                        <SelectItem value={ShipmentStatus.DELAYED}>Delayed</SelectItem>
                        <SelectItem value={ShipmentStatus.CRITICAL}>Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Shipment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddShipmentModal;
