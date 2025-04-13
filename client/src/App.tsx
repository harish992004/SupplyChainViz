import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import MapView from "@/pages/map-view";
import Suppliers from "@/pages/suppliers";
import Shipments from "@/pages/shipments";
import { AddShipmentModal } from "@/components/modals/add-shipment-modal";
import { ShipmentDetailsModal } from "@/components/modals/shipment-details-modal";

function Router() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-16 overflow-y-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/map" component={MapView} />
          <Route path="/suppliers" component={Suppliers} />
          <Route path="/shipments" component={Shipments} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <AddShipmentModal />
      <ShipmentDetailsModal />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
