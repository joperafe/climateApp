import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import { useEffect } from "react";

export type HeatPoint = {
  lat: number;
  lng: number;
  intensity: number; // normalized 0–1
};

type HeatmapLayerProps = {
  points: HeatPoint[];
  radius?: number;
  blur?: number;
  maxZoom?: number;
};

export default function HeatmapLayer({ points, radius = 25, blur = 15, maxZoom = 17 }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    // Create Leaflet heat layer
    const heatLayer = (L as any).heatLayer(
      points.map((p) => [p.lat, p.lng, p.intensity]),
      { radius, blur, maxZoom }
    );

    heatLayer.addTo(map);

    // Cleanup on unmount or points change
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, radius, blur, maxZoom]);

  return null;
}
