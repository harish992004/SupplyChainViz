import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertShipmentSchema, ShipmentStatus } from "@shared/schema";
import { useSuppliers } from "@/hooks/use-suppliers";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Create a modified schema for the form
const formSchema = z.object({
  productId: z.string().min(1, { message: "Product ID is required" }),
  source: z.string().min(1, { message: "Source is required" }),
  destination: z.string().min(1, { message: "Destination is required" }),
  cost: z.coerce.number().min(0, { message: "Cost must be a positive number" }),
  etaString: z.string().min(1, { message: "Expected delivery date is required" }),
  status: z.string().min(1, { message: "Status is required" }),
});

interface AddShipmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddShipmentForm({ onSuccess, onCancel }: AddShipmentFormProps) {
  const { data: suppliers = [] } = useSuppliers();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      source: "",
      destination: "",
      cost: 0,
      etaString: new Date().toISOString().substring(0, 10),
      status: ShipmentStatus.PROCESSING
    },
  });
  
  // Group suppliers by type
  const sourceOptions = suppliers
    .filter(s => s.type !== 'store')
    .map(s => s.name.split(' ')[1]);
  
  const destinationOptions = suppliers
    .filter(s => s.type !== 'supplier')
    .map(s => s.name.split(' ')[1]);
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Form values:", values);
      
      // Make sure etaString has a proper time component
      let etaDate = new Date(values.etaString);
      if (isNaN(etaDate.getTime())) {
        throw new Error("Invalid date format for ETA");
      }
      
      // Convert string date to ISO date string
      const formattedValues = {
        productId: values.productId,
        source: values.source,
        destination: values.destination,
        cost: values.cost,
        eta: etaDate.toISOString(), // Send as ISO string
        status: values.status
      };
      
      console.log("Sending to server:", formattedValues);
      
      await apiRequest('POST', '/api/shipments', formattedValues);
      
      toast({
        title: "Shipment created",
        description: `Shipment from ${values.source} to ${values.destination} has been created.`,
      });
      
      // Invalidate shipments queries
      queryClient.invalidateQueries({ queryKey: ['/api/shipments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/kpi'] });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create shipment. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create shipment", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">Product ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter product ID" 
                    className="bg-gray-700 text-white focus:ring-accent"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">Shipment Cost</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="Enter cost" 
                    className="bg-gray-700 text-white focus:ring-accent"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">Source</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-700 text-white focus:ring-accent">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    {sourceOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">Destination</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-700 text-white focus:ring-accent">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    {destinationOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="etaString"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">Expected Delivery Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    className="bg-gray-700 text-white focus:ring-accent"
                    {...field} 
                  />
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
                <FormLabel className="text-gray-400">Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-700 text-white focus:ring-accent">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    <SelectItem value={ShipmentStatus.PROCESSING}>Processing</SelectItem>
                    <SelectItem value={ShipmentStatus.IN_TRANSIT}>In Transit</SelectItem>
                    <SelectItem value={ShipmentStatus.DELIVERED}>Delivered</SelectItem>
                    <SelectItem value={ShipmentStatus.DELAYED}>Delayed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            type="button" 
            variant="outline"
            className="bg-gray-700 text-white hover:bg-gray-600" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-accent text-white hover:bg-teal-600"
          >
            Add Shipment
          </Button>
        </div>
      </form>
    </Form>
  );
}
