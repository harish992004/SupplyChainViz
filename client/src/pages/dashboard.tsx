import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import KPISection from '@/components/dashboard/kpi-section';
import ShipmentsChart from '@/components/dashboard/shipments-chart';
import CostHeatmap from '@/components/dashboard/cost-heatmap';
import SupplierNetwork from '@/components/dashboard/supplier-network';
import RecentShipments from '@/components/dashboard/recent-shipments';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useShipments } from '@/hooks/use-shipments';
import { useDashboardKPI } from '@/hooks/use-dashboard-kpi';

export default function Dashboard() {
  const { data: kpiData, isLoading: isLoadingKPI } = useDashboardKPI();
  const { data: suppliers = [], isLoading: isLoadingSupppliers } = useSuppliers();
  const { data: shipments = [], isLoading: isLoadingShipments } = useShipments();
  
  const handleShipmentClick = (shipmentId: number) => {
    const event = new CustomEvent('openShipmentDetailsModal', { detail: shipmentId });
    window.dispatchEvent(event);
  };
  
  if (isLoadingKPI || isLoadingSupppliers || isLoadingShipments) {
    return (
      <div>
        <Header title="Supply Chain Map" />
        <main className="p-6">
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        </main>
      </div>
    );
  }
  
  if (!kpiData) {
    return (
      <div>
        <Header title="Supply Chain Map" />
        <main className="p-6">
          <div className="bg-secondary rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
            <p className="mt-2">Could not load dashboard data. Please try again later.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header title="Supply Chain Map" />
      <main className="p-6">
        <KPISection data={kpiData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ShipmentsChart data={kpiData} />
          <CostHeatmap />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <SupplierNetwork suppliers={suppliers} />
          <div className="lg:col-span-2">
            <RecentShipments 
              shipments={shipments} 
              onShipmentClick={handleShipmentClick} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
