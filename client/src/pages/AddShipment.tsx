import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertShipmentSchema, Supplier, Warehouse, Store, Facility } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function AddShipment() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  // Get all facilities for source and destination selection
  const { data: facilities } = useQuery<Facility[]>({
    queryKey: ['/api/facilities'],
  });

  // Form setup
  const form = useForm({
    resolver: zodResolver(insertShipmentSchema),
    defaultValues: {
      shipmentId: `SHP-${Math.floor(1000 + Math.random() * 9000)}`,
      product: "",
      source: { lat: 0, lng: 0 },
      destination: { lat: 0, lng: 0 },
      sourceId: 0,
      destinationId: 0,
      cost: 0,
      eta: new Date(),
      status: "pending"
    },
  });

  // Filter facilities by type
  const suppliers = facilities?.filter(f => f.type === 'supplier') || [];
  const warehouses = facilities?.filter(f => f.type === 'warehouse') || [];
  const stores = facilities?.filter(f => f.type === 'store') || [];

  // Add shipment mutation
  const addShipment = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/shipments", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shipments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/kpi'] });
      toast({
        title: "Shipment added",
        description: "The shipment has been added successfully",
      });
      setLocation("/shipments");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add shipment",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    // Find source and destination coordinates based on selected IDs
    if (data.sourceId) {
      const sourceFacility = facilities?.find(f => f.id === parseInt(data.sourceId));
      if (sourceFacility) {
        data.source = sourceFacility.location;
      }
    }
    
    if (data.destinationId) {
      const destFacility = facilities?.find(f => f.id === parseInt(data.destinationId));
      if (destFacility) {
        data.destination = destFacility.location;
      }
    }
    
    // Convert cost to number
    data.cost = parseFloat(data.cost);
    
    // Format date
    if (typeof data.eta === 'string') {
      data.eta = new Date(data.eta);
    }
    
    addShipment.mutate(data);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Add New Shipment</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shipmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipment ID</FormLabel>
                      <FormControl>
                        <Input readOnly {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name or description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sourceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0" disabled>Select source</SelectItem>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                              {supplier.name} (Supplier)
                            </SelectItem>
                          ))}
                          {warehouses.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                              {warehouse.name} (Warehouse)
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
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0" disabled>Select destination</SelectItem>
                          {warehouses.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                              {warehouse.name} (Warehouse)
                            </SelectItem>
                          ))}
                          {stores.map((store) => (
                            <SelectItem key={store.id} value={store.id.toString()}>
                              {store.name} (Store)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                        />
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
                      <FormLabel>Estimated Arrival Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          value={field.value instanceof Date 
                            ? field.value.toISOString().split('T')[0]
                            : field.value
                          }
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
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-transit">In Transit</SelectItem>
                          <SelectItem value="on-time">On Time</SelectItem>
                          <SelectItem value="delayed">Delayed</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setLocation("/shipments")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addShipment.isPending}>
                  {addShipment.isPending ? "Adding..." : "Add Shipment"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
