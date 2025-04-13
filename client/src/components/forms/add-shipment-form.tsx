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

// Extend the insert schema with client validation
const formSchema = insertShipmentSchema.extend({
  eta: z.string().min(1, { message: "Expected delivery date is required" }),
  cost: z.coerce.number().min(0, { message: "Cost must be a positive number" }),
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
      eta: new Date().toISOString().substring(0, 10),
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
      // Convert string date to ISO date string
      const formattedValues = {
        ...values,
        eta: new Date(values.eta).toISOString(),
        cost: parseFloat(values.cost.toString())
      };
      
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
            name="eta"
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
