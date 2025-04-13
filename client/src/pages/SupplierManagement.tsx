import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Supplier, LocationType } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, SearchIcon, MoreHorizontalIcon, Loader2 } from 'lucide-react';
import AddSupplierModal from '@/components/modals/AddSupplierModal';

const SupplierManagement = () => {
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: suppliers = [], isLoading } = useQuery<Supplier[]>({
    queryKey: ['/api/suppliers'],
  });

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.country && supplier.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helper function to get color based on location type
  const getLocationTypeColor = (type: string) => {
    switch(type) {
      case LocationType.SUPPLIER: return 'bg-teal-500 hover:bg-teal-600';
      case LocationType.WAREHOUSE: return 'bg-blue-500 hover:bg-blue-600';
      case LocationType.STORE: return 'bg-slate-500 hover:bg-slate-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Display a formatted string for coordinates
  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Supplier Management</h2>
          <p className="text-muted-foreground mt-1">View and manage all your suppliers, warehouses, and stores</p>
        </div>
        <Button onClick={() => setIsAddSupplierOpen(true)} className="mt-4 md:mt-0">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-0">
          <CardTitle>Location Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-muted-foreground mb-1">Suppliers</div>
              <div className="text-3xl font-bold">
                {suppliers.filter(s => s.locationType === LocationType.SUPPLIER).length}
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-muted-foreground mb-1">Warehouses</div>
              <div className="text-3xl font-bold">
                {suppliers.filter(s => s.locationType === LocationType.WAREHOUSE).length}
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-muted-foreground mb-1">Stores</div>
              <div className="text-3xl font-bold">
                {suppliers.filter(s => s.locationType === LocationType.STORE).length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle>All Locations</CardTitle>
            <div className="relative w-full md:w-64 mt-4 md:mt-0">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search locations..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Coordinates</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Cost Index</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No locations found matching your search
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map(supplier => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.city}{supplier.country ? `, ${supplier.country}` : ''}</TableCell>
                    <TableCell>
                      <Badge className={getLocationTypeColor(supplier.locationType)}>
                        {supplier.locationType.charAt(0).toUpperCase() + supplier.locationType.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCoordinates(supplier.latitude, supplier.longitude)}</TableCell>
                    <TableCell>{supplier.rating ? `${supplier.rating}/5` : 'N/A'}</TableCell>
                    <TableCell>{supplier.costIndex ? supplier.costIndex.toFixed(1) : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Location</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddSupplierModal
        isOpen={isAddSupplierOpen}
        onClose={() => setIsAddSupplierOpen(false)}
      />
    </div>
  );
};

export default SupplierManagement;
