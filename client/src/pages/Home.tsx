import { useEffect } from "react";
import { useLocation } from "wouter";
import MapView from "./MapView";

export default function Home() {
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to map view for the home page
    setLocation("/map");
  }, [setLocation]);

  return <MapView />;
}
