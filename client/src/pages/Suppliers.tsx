import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Star, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSupplierSchema, Supplier } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Suppliers() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Fetch suppliers
  const { data: suppliers, isLoading } = useQuery<Supplier[]>({
    queryKey: ['/api/suppliers'],
  });

  // Form setup
  const form = useForm({
    resolver: zodResolver(insertSupplierSchema),
    defaultValues: {
      name: "",
      location: { lat: 0, lng: 0 },
      type: "supplier",
      address: "",
      rating: 0,
      costIndex: 0,
    },
  });

  // Add supplier mutation
  const addSupplier = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      const res = await apiRequest("POST", "/api/suppliers", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/facilities'] });
      setOpen(false);
      form.reset();
      toast({
        title: "Supplier added",
        description: "The supplier has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add supplier",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    addSupplier.mutate(data);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Supplier Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter supplier name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location.lat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.0001"
                            placeholder="Latitude"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location.lng"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.0001"
                            placeholder="Longitude"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (1-5)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            placeholder="Rating"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="costIndex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Index</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Cost Index"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={addSupplier.isPending}>
                  {addSupplier.isPending ? "Adding..." : "Add Supplier"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers?.map((supplier) => (
            <Card key={supplier.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between">
                  {supplier.name}
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (supplier.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-400">Location</Label>
                    <p className="text-sm">
                      {supplier.address || `${supplier.location.lat.toFixed(4)}, ${supplier.location.lng.toFixed(4)}`}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-400">Cost Index</Label>
                    <p className="text-sm">{supplier.costIndex || "N/A"}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="w-full">
                      <Trash className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
