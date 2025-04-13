import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import MapView from "@/pages/MapView";
import KPIDashboard from "@/pages/KPIDashboard";
import SupplierManagement from "@/pages/SupplierManagement";
import Shipments from "@/pages/Shipments";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={MapView} />
        <Route path="/dashboard" component={KPIDashboard} />
        <Route path="/suppliers" component={SupplierManagement} />
        <Route path="/shipments" component={Shipments} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
