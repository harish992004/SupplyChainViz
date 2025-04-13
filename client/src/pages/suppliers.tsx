import { useState } from 'react';
import Header from '@/components/layout/header';
import { useSuppliers } from '@/hooks/use-suppliers';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Star, DollarSign } from 'lucide-react';
import { locationType } from '@shared/schema';

export default function Suppliers() {
  const { data: suppliers = [], isLoading } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getTypeColor = (type: string) => {
    switch(type) {
      case locationType.SUPPLIER:
        return 'bg-teal-100 text-teal-800';
      case locationType.WAREHOUSE:
        return 'bg-blue-100 text-blue-800';
      case locationType.STORE:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div>
        <Header title="Suppliers" />
        <main className="p-6">
          <div className="flex items-center justify-center h-[calc(100vh-120px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header title="Suppliers" showAddButton={false} />
      <main className="p-6">
        <Card className="bg-secondary rounded-xl shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">All Suppliers</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search suppliers..."
                    className="bg-gray-700 text-white text-sm rounded-lg pl-8 pr-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-accent"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <Button className="bg-accent text-white hover:bg-teal-600">
                  Add Supplier
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-400">ID</TableHead>
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Type</TableHead>
                    <TableHead className="text-gray-400">Location</TableHead>
                    <TableHead className="text-gray-400">Rating</TableHead>
                    <TableHead className="text-gray-400">Cost Index</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="hover:bg-gray-700">
                      <TableCell>#{supplier.id}</TableCell>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(supplier.type)}>
                          {supplier.type.charAt(0).toUpperCase() + supplier.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <span>
                            {supplier.location.lat.toFixed(2)}, {supplier.location.lng.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{supplier.rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-400 mr-1" />
                          <span>{supplier.costIndex.toFixed(1)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
