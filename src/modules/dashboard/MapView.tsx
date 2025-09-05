import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { settings } from "../../config/config";
import { useEffect, useState } from "react";
import type { Sensor } from "../../types/sensor";
import type { GreenZone } from "../../types/greenzone";
import { fetchSensors } from "../../services/sensorService";
import { fetchGreenZones } from "../../services/greenZonesService";
import L from "leaflet";
import "leaflet.heat";
import HeatmapLayer from "./HeatmapLayer";
import MapControls from "./MapControls";

// Cuxstom Heatmap Layer with Leaflet.heat
// function HeatmapLayer({ points }: { points: { lat: number; lng: number; intensity: number }[] }) {
//   const map = useMap();

//   useEffect(() => {
//     if (!map || points.length === 0) return;

//     const heatLayer = (L as any).heatLayer(
//       points.map((p) => [p.lat, p.lng, p.intensity]),
//       {
//         radius: 25,
//         blur: 15,
//         maxZoom: 17,
//       }
//     );
//     heatLayer.addTo(map);

//     return () => {
//       map.removeLayer(heatLayer);
//     };
//   }, [map, points]);

//   return null;
// }

export default function MapView() {
  const [bol, setBol] = useState(false);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [greenZones, setGreenZones] = useState<GreenZone[]>([]);
  const [layerVisibility, setLayerVisibility] = useState({
    heatmap: true,
    greenzones: true,
    sensors: true,
  });

  useEffect(() => {
    fetchSensors()
      .then(data => {
        // Ensure data is an array
        setSensors(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Failed to fetch sensors:', error);
        setSensors([]); // Set to empty array on error
      });
      
    fetchGreenZones()
      .then(data => {
        // Ensure data is an array
        setGreenZones(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Failed to fetch green zones:', error);
        setGreenZones([]); // Set to empty array on error
      });
  }, []);

  const handleLayerToggle = (layerName: string, visible: boolean) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerName]: visible,
    }));
  };

  const heatPoints = Array.isArray(sensors)
    ? sensors
        .filter((s) => typeof s.data.temperature === "number")
        .map((s) => ({
          lat: s.coordinates[0],
          lng: s.coordinates[1],
          intensity: (s.data.temperature ?? 0) / 40, // normalize temperature (0–40 °C)
        }))
    : [];

  return (
    <MapContainer center={settings.map.defaultCenter as any} zoom={settings.map.defaultZoom} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Map Controls */}
      <MapControls onLayerToggle={handleLayerToggle} layerVisibility={layerVisibility} />

      {settings.features.enableHeatmap && layerVisibility.heatmap && heatPoints.length > 0 && (
        <HeatmapLayer points={heatPoints} radius={30} blur={20} maxZoom={18} />
      )}

      {/* Heatmap Layer */}
      {/* {settings.features.enableHeatmap && heatPoints.length > 0 && <HeatmapLayer points={heatPoints} />} */}

      {/* Green Zones */}
      {settings.features.enableGreenZones && layerVisibility.greenzones &&
        greenZones.map((gz) => (
          <Polygon key={gz.id} positions={gz.polygon as any} pathOptions={{ color: "green", fillOpacity: 0.3 }} />
        ))}

      {/* Sensor Markers */}
      {layerVisibility.sensors && Array.isArray(sensors) && sensors.map((s) => (
        <Marker key={s.id} position={s.coordinates as any}>
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{s.name}</div>
              <div>Temp: {s.data.temperature ?? "—"} °C</div>
              <div>Humidity: {s.data.humidity ?? "—"} %</div>
              <div>AQI: {s.data.airQualityIndex ?? "—"}</div>
              <div>Noise: {s.data.noiseLevel ?? "—"} dB</div>
              <div className="text-xs text-gray-500 mt-1">Updated: {new Date(s.lastUpdated).toLocaleString()}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
