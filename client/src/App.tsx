import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import MapView from "./pages/MapView";
import KPIDashboard from "./pages/KPIDashboard";
import Suppliers from "./pages/Suppliers";
import Shipments from "./pages/Shipments";
import AddShipment from "./pages/AddShipment";

function Router() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-primary pt-5 lg:ml-64">
        <div className="container mx-auto px-4 pb-8">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/map" component={MapView} />
            <Route path="/kpi" component={KPIDashboard} />
            <Route path="/suppliers" component={Suppliers} />
            <Route path="/shipments" component={Shipments} />
            <Route path="/add-shipment" component={AddShipment} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
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
