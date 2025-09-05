import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { settings } from '../../config/config';
import './MapControls.css';

// Control positions mapping
const CONTROL_POSITIONS: Record<string, L.ControlPosition> = {
  topleft: 'topleft',
  topright: 'topright',
  bottomleft: 'bottomleft',
  bottomright: 'bottomright',
};

interface MapControlsProps {
  onLayerToggle?: (layerName: string, visible: boolean) => void;
  layerVisibility?: Record<string, boolean>;
}

export default function MapControls({ onLayerToggle, layerVisibility = {} }: MapControlsProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !settings.mapControls) return;

    const controls: L.Control[] = [];
    const position = CONTROL_POSITIONS[settings.mapControls.position] || 'topright';

    // Handle zoom controls
    if (settings.mapControls.enableZoomControls) {
      map.zoomControl.setPosition(position);
    } else {
      try {
        map.removeControl(map.zoomControl);
      } catch (e) {
        // Zoom control might not exist
      }
    }

    // Create controls based on configuration
    settings.mapControls.controls?.forEach((controlConfig: any) => {
      if (!controlConfig.enabled) return;

      let control: L.Control | null = null;

      switch (controlConfig.type) {
        case 'layerToggle':
          control = createLayerControl(onLayerToggle, layerVisibility);
          break;
        case 'draw':
          control = createButtonControl('✏️', controlConfig.title || 'Drawing Tools', () => {
            alert('Drawing tools would be implemented here');
          });
          break;
        case 'measurement':
          control = createButtonControl('📏', controlConfig.title || 'Measurement Tools', () => {
            alert('Measurement tools would be implemented here');
          });
          break;
        case 'fullscreen':
          control = createButtonControl('⛶', controlConfig.title || 'Fullscreen', () => {
            const mapContainer = map.getContainer().parentElement;
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              mapContainer?.requestFullscreen();
            }
          });
          break;
      }

      if (control) {
        control.setPosition(position);
        controls.push(control);
        map.addControl(control);
      }
    });

    // Cleanup
    return () => {
      controls.forEach(control => {
        try {
          map.removeControl(control);
        } catch (e) {
          // Control might already be removed
        }
      });
    };
  }, [map, onLayerToggle, layerVisibility]);

  return null;
}

// Simple button control factory
function createButtonControl(icon: string, title: string, onClick: () => void) {
  return new (L.Control.extend({
    onAdd() {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      const button = L.DomUtil.create('a', 'control-button', container);
      
      button.innerHTML = icon;
      button.href = '#';
      button.title = title;
      
      L.DomEvent.on(button, 'click', (e) => {
        L.DomEvent.preventDefault(e);
        onClick();
      });
      
      L.DomEvent.disableClickPropagation(container);
      return container;
    }
  }))();
}

// Layer control factory
function createLayerControl(onLayerToggle?: (layerName: string, visible: boolean) => void, layerVisibility: Record<string, boolean> = {}) {
  return new (L.Control.extend({
    onAdd() {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control layer-toggle-control');
      
      // Title
      const title = L.DomUtil.create('div', 'control-title', container);
      title.innerHTML = '<strong>Layers</strong>';
      
      // Helper to create toggles
      const createToggle = (layerKey: string, label: string) => {
        const toggle = L.DomUtil.create('label', 'control-item', container);
        const checkbox = L.DomUtil.create('input', '', toggle);
        const span = L.DomUtil.create('span', '', toggle);
        
        checkbox.type = 'checkbox';
        checkbox.checked = layerVisibility[layerKey] !== false; // Default to true
        span.textContent = label;
        
        L.DomEvent.on(checkbox, 'change', () => {
          onLayerToggle?.(layerKey, checkbox.checked);
        });
      };

      // Create toggles based on enabled features
      if (settings.features.enableHeatmap) {
        createToggle('heatmap', 'Heatmap');
      }
      if (settings.features.enableGreenZones) {
        createToggle('greenzones', 'Green Zones');
      }
      createToggle('sensors', 'Sensors');
      
      L.DomEvent.disableClickPropagation(container);
      return container;
    }
  }))();
}
