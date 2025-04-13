import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Supplier, Shipment, LocationType } from '@shared/schema';

// Import Leaflet types but use dynamic import for the library
import type { Map as LeafletMap, LatLngTuple, Polyline, DivIcon } from 'leaflet';

interface SupplyChainMapProps {
  suppliers: Supplier[];
  shipments: Shipment[];
  onRouteClick: (shipment: Shipment) => void;
}

const SupplyChainMap = ({ suppliers, shipments, onRouteClick }: SupplyChainMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [leafletMap, setLeafletMap] = useState<LeafletMap | null>(null);
  const polylineRefs = useRef<{ [key: string]: Polyline }>({});

  useEffect(() => {
    // Dynamically import Leaflet
    const initializeMap = async () => {
      if (!mapRef.current || leafletMap) return;

      try {
        const L = await import('leaflet');
        
        // Create map instance
        const map = L.map(mapRef.current).setView([52, 13], 4);
        
        // Add dark-themed tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);
        
        // Apply dark mode style to tiles
        const darkModeStyle = document.createElement('style');
        darkModeStyle.textContent = `
          .leaflet-container {
            background: #1E1E1E;
          }
          .leaflet-bar a {
            background-color: #2D2D2D;
            color: #F7FAFC;
            border-bottom: 1px solid #333;
          }
          .leaflet-bar a:hover {
            background-color: #38B2AC;
          }
          .leaflet-tile {
            filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
          }
        `;
        document.head.appendChild(darkModeStyle);
        
        setLeafletMap(map);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (leafletMap) {
        leafletMap.remove();
        setLeafletMap(null);
      }
    };
  }, []);

  useEffect(() => {
    const drawMarkersAndRoutes = async () => {
      if (!leafletMap) return;
      
      try {
        const L = await import('leaflet');
        
        // Clear existing markers and routes
        leafletMap.eachLayer((layer) => {
          if (layer.options && 
              (layer.options.pane === 'markerPane' || 
               layer.options.pane === 'overlayPane')) {
            leafletMap.removeLayer(layer);
          }
        });
        
        // Create custom icons for different location types
        const createCustomIcon = (type: string): DivIcon => {
          let bgColor: string;
          
          switch(type) {
            case LocationType.SUPPLIER:
              bgColor = '#38B2AC'; // teal
              break;
            case LocationType.WAREHOUSE:
              bgColor = '#4299E1'; // blue
              break;
            case LocationType.STORE:
              bgColor = '#F7FAFC'; // white
              break;
            default:
              bgColor = '#38B2AC';
          }
          
          return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${bgColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #FFF;"></div>`,
            iconSize: [15, 15],
            iconAnchor: [7, 7]
          });
        };
        
        // Add markers for suppliers
        suppliers.forEach(supplier => {
          const icon = createCustomIcon(supplier.locationType);
          
          L.marker([supplier.latitude, supplier.longitude], { icon })
            .bindTooltip(supplier.name)
            .addTo(leafletMap);
        });
        
        // Draw routes for shipments
        shipments.forEach(shipment => {
          const source = suppliers.find(s => s.id === shipment.sourceId);
          const destination = suppliers.find(s => s.id === shipment.destinationId);
          
          if (source && destination) {
            // Determine color based on source type or shipment status
            let color: string;
            
            switch(source.locationType) {
              case LocationType.SUPPLIER:
                color = '#38B2AC'; // teal
                break;
              case LocationType.WAREHOUSE:
                color = '#4299E1'; // blue
                break;
              default:
                color = '#4299E1';
            }
            
            const sourceLatLng: LatLngTuple = [source.latitude, source.longitude];
            const destLatLng: LatLngTuple = [destination.latitude, destination.longitude];
            
            const polyline = L.polyline([sourceLatLng, destLatLng], {
              color,
              weight: 2,
              opacity: 0.7
            }).addTo(leafletMap);
            
            // Store reference to polyline
            polylineRefs.current[shipment.id] = polyline;
            
            // Add click handler to show shipment details
            polyline.on('click', () => {
              onRouteClick(shipment);
            });
          }
        });
      } catch (error) {
        console.error('Error drawing map elements:', error);
      }
    };
    
    if (leafletMap && suppliers.length > 0) {
      drawMarkersAndRoutes();
    }
  }, [leafletMap, suppliers, shipments, onRouteClick]);

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Supply Chain Map</CardTitle>
      </CardHeader>
      <div className="p-0 h-[500px]">
        <div ref={mapRef} className="h-full w-full" />
      </div>
      <CardContent className="flex flex-wrap gap-4 p-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm text-muted-foreground">Supplier</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-muted-foreground">Warehouse</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-foreground"></div>
          <span className="text-sm text-muted-foreground">Store</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-[2px] bg-primary"></div>
          <span className="text-sm text-muted-foreground">In-transit</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplyChainMap;
