import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Supplier, locationType } from '@shared/schema';
import { useShipments } from '@/hooks/use-shipments';

// Workaround for the Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  suppliers: Supplier[];
  onRouteClick?: (shipmentId: number) => void;
}

// Component to apply dark mode to map tiles
const DarkModeMapTiles = () => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      const mapContainer = map.getContainer();
      if (mapContainer) {
        // Apply a MutationObserver to handle dynamically loaded tiles
        const observer = new MutationObserver(() => {
          const tiles = mapContainer.querySelectorAll('.leaflet-tile');
          tiles.forEach((tile: any) => {
            if (!tile.style.filter) {
              tile.style.filter = 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)';
            }
          });
        });
        
        observer.observe(mapContainer, { 
          childList: true, 
          subtree: true 
        });
        
        return () => observer.disconnect();
      }
    }
  }, [map]);
  
  return null;
};

const Map = ({ suppliers, onRouteClick }: MapProps) => {
  const { data: shipments } = useShipments();
  const [routes, setRoutes] = useState<any[]>([]);

  // Create custom icon for different location types
  const createCustomIcon = (type: string) => {
    let color = '#14B8A6'; // Default: supplier (teal)
    
    if (type === locationType.WAREHOUSE) {
      color = '#60A5FA'; // Blue
    } else if (type === locationType.STORE) {
      color = '#10B981'; // Green
    }
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%;"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

  // Generate routes between suppliers based on shipments
  useEffect(() => {
    if (!shipments || !suppliers) return;

    // Create a mapping of supplier names to their locations
    const supplierMap = new Map<string, { lat: number; lng: number }>();
    suppliers.forEach(supplier => {
      supplierMap.set(supplier.name.split(' ')[1], supplier.location);
    });

    // Create routes based on shipments
    const shipmentRoutes = shipments.map(shipment => {
      const sourceLocation = supplierMap.get(shipment.source);
      const destLocation = supplierMap.get(shipment.destination);
      
      if (!sourceLocation || !destLocation) return null;
      
      return {
        id: shipment.id,
        from: sourceLocation,
        to: destLocation,
        status: shipment.status
      };
    }).filter(route => route !== null);

    setRoutes(shipmentRoutes);
  }, [shipments, suppliers]);

  return (
    <div className="h-full">
      <MapContainer 
        center={[55, 10]} 
        zoom={4} 
        className="h-full"
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        <DarkModeMapTiles />
        
        {suppliers.map((supplier) => (
          <Marker
            key={supplier.id}
            position={[supplier.location.lat, supplier.location.lng]}
            icon={createCustomIcon(supplier.type)}
          >
            <Popup>
              <div className="text-gray-900">
                <p className="font-semibold">{supplier.name}</p>
                <p>Type: {supplier.type}</p>
                <p>Rating: {supplier.rating}/5</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {routes.map((route) => (
          route && (
            <Polyline
              key={route.id}
              positions={[[route.from.lat, route.from.lng], [route.to.lat, route.to.lng]]}
              pathOptions={{
                color: "#FFFFFF",
                weight: 2,
                opacity: route.status === 'in_transit' ? 1 : 0.5
              }}
              eventHandlers={{
                click: () => onRouteClick && onRouteClick(route.id),
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({ weight: 4, color: "#14B8A6" });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle({ 
                    weight: 2, 
                    color: "#FFFFFF", 
                    opacity: route.status === 'in_transit' ? 1 : 0.5 
                  });
                }
              }}
            />
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
