import { Chart } from "@/components/ui/chart";
import { useState, useEffect } from "react";

export default function CostHeatmap() {
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    // Use an SVG map of Europe with cost heatmap
    const europeSvg = `
      <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="costGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#0f766e" stop-opacity="0.3" />
            <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.5" />
            <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.7" />
          </linearGradient>
        </defs>
        
        <!-- European outline (simplified) -->
        <path d="M400,100 C500,120 550,150 600,200 C650,250 680,300 700,400 C720,500 710,550 650,580 C590,610 500,600 400,580 C300,560 200,550 150,500 C100,450 80,400 100,300 C120,200 150,150 200,120 C250,90 300,80 400,100 Z" 
          fill="url(#costGradient)" 
          stroke="hsl(var(--border))" 
          stroke-width="2"
          opacity="0.8"
        />
        
        <!-- Country boundaries (simplified) -->
        <path d="M300,200 L350,300 L450,350 L500,250 L450,150 Z" 
          fill="none" 
          stroke="hsl(var(--border))" 
          stroke-width="1"
          opacity="0.5"
        />
        <path d="M350,300 L300,400 L400,450 L500,400 L450,350 Z" 
          fill="none" 
          stroke="hsl(var(--border))" 
          stroke-width="1"
          opacity="0.5"
        />
        <path d="M450,150 L550,200 L600,300 L500,250 Z" 
          fill="none" 
          stroke="hsl(var(--border))" 
          stroke-width="1"
          opacity="0.5"
        />
        
        <!-- High cost hotspots -->
        <circle cx="450" cy="200" r="30" fill="#f43f5e" opacity="0.6" />
        <circle cx="350" cy="350" r="25" fill="#f43f5e" opacity="0.5" />
        
        <!-- Medium cost areas -->
        <circle cx="500" cy="320" r="40" fill="#f59e0b" opacity="0.4" />
        <circle cx="400" cy="250" r="35" fill="#f59e0b" opacity="0.3" />
        
        <!-- Low cost areas -->
        <circle cx="550" cy="250" r="30" fill="#0f766e" opacity="0.4" />
        <circle cx="300" cy="300" r="25" fill="#0f766e" opacity="0.5" />
      </svg>
    `;

    // Create a blob from the SVG string
    const blob = new Blob([europeSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    setImagePath(url);

    // Clean up the URL when component unmounts
    return () => URL.revokeObjectURL(url);
  }, []);

  return (
    <Chart>
      {imagePath ? (
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={imagePath} 
            alt="Europe cost heatmap" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ) : (
        <div className="w-full h-full bg-card flex items-center justify-center">
          <p className="text-muted-foreground">Loading cost heatmap...</p>
        </div>
      )}
    </Chart>
  );
}
