import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Facility, Shipment } from "@shared/schema";
import ShipmentModal from "./ShipmentModal";

interface SupplierMapProps {
  facilities: Facility[];
  shipments: Shipment[];
}

export default function SupplierMap({ facilities, shipments }: SupplierMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([50.0, 15.0], 4);

      // Add dark-themed map tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Clear existing markers and routes
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          mapRef.current?.removeLayer(layer);
        }
      });

      // Add facility markers
      facilities.forEach((facility) => {
        const markerColor = 
          facility.type === "supplier" 
            ? "hsl(var(--chart-1))" 
            : facility.type === "warehouse" 
              ? "hsl(var(--chart-2))" 
              : "hsl(var(--chart-3))";

        const marker = L.circleMarker([facility.location.lat, facility.location.lng], {
          radius: 6,
          fillColor: markerColor,
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(mapRef.current!);

        marker.bindTooltip(
          `<strong>${facility.name}</strong><br>Type: ${facility.type.charAt(0).toUpperCase() + facility.type.slice(1)}`
        );
      });

      // Add shipment routes
      shipments.forEach((shipment) => {
        // Define line options based on status
        let lineOptions: L.PolylineOptions = {
          color: "hsl(var(--chart-1))",
          weight: 2,
          opacity: 0.7,
          dashArray: "5, 5",
        };

        if (shipment.status === "delayed") {
          lineOptions.color = "hsl(var(--chart-5))";
        } else if (shipment.status === "on-time") {
          lineOptions.color = "hsl(var(--chart-4))";
          lineOptions.dashArray = undefined;
        }

        // Create the polyline
        const route = L.polyline(
          [
            [shipment.source.lat, shipment.source.lng],
            [shipment.destination.lat, shipment.destination.lng],
          ],
          lineOptions
        ).addTo(mapRef.current!);

        // Add tooltip
        route.bindTooltip(
          `Shipment: ${shipment.shipmentId}<br>Status: ${shipment.status}<br>ETA: ${new Date(shipment.eta).toLocaleDateString()}`
        );

        // Add click handler to show modal
        route.on("click", function () {
          setSelectedShipment(shipment);
          setIsModalOpen(true);
        });
      });
    }

    return () => {
      // No need to destroy the map on cleanup
    };
  }, [facilities, shipments]);

  return (
    <>
      <div ref={mapContainerRef} className="h-full"></div>
      {selectedShipment && (
        <ShipmentModal
          shipment={selectedShipment}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
