import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { createRoot } from 'react-dom/client';
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

// JSX Components for Controls
const ControlButton: React.FC<{
  icon: string;
  title: string;
  onClick: () => void;
  className?: string;
}> = ({ icon, title, onClick, className }) => (
  <div className="leaflet-bar leaflet-control">
    <a
      href="#"
      className={className || 'control-button'}
      title={title}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {icon}
    </a>
  </div>
);

const LayerToggleControl: React.FC<{
  onLayerToggle?: (layerName: string, visible: boolean) => void;
  layerVisibility?: Record<string, boolean>;
}> = ({ onLayerToggle, layerVisibility = { heatmap: true, greenzones: true, sensors: true } }) => {
  const handleToggle = (layerKey: string, checked: boolean) => {
    onLayerToggle?.(layerKey, checked);
  };

  return (
    <div className="leaflet-bar leaflet-control layer-toggle-control">
      <div className="control-title">
        <strong>Layers</strong>
      </div>
      
      {settings.features.enableHeatmap && (
        <label className="control-item">
          <input
            type="checkbox"
            checked={layerVisibility.heatmap}
            onChange={(e) => handleToggle('heatmap', e.target.checked)}
          />
          <span>Heatmap</span>
        </label>
      )}
      
      {settings.features.enableGreenZones && (
        <label className="control-item">
          <input
            type="checkbox"
            checked={layerVisibility.greenzones}
            onChange={(e) => handleToggle('greenzones', e.target.checked)}
          />
          <span>Green Zones</span>
        </label>
      )}
      
      <label className="control-item">
        <input
          type="checkbox"
          checked={layerVisibility.sensors}
          onChange={(e) => handleToggle('sensors', e.target.checked)}
        />
        <span>Sensors</span>
      </label>
    </div>
  );
};

// Utility function to create control from JSX
const createControlFromJSX = (jsxElement: React.ReactElement, position: L.ControlPosition = 'topright') => {
  class JSXControl extends L.Control {
    private container: HTMLDivElement | null = null;
    private root: any = null;

    constructor() {
      super({ position });
    }

    onAdd() {
      this.container = L.DomUtil.create('div', '');
      this.root = createRoot(this.container);
      this.root.render(jsxElement);
      
      L.DomEvent.disableClickPropagation(this.container);
      return this.container;
    }

    onRemove() {
      if (this.root) {
        this.root.unmount();
      }
    }
  }

  return new JSXControl();
};

// Control factory registry
const CONTROL_FACTORIES: Record<string, (options?: any, layerVisibility?: Record<string, boolean>) => L.Control> = {
  layerToggle: (onLayerToggle, layerVisibility) => createControlFromJSX(<LayerToggleControl onLayerToggle={onLayerToggle} layerVisibility={layerVisibility} />),
  draw: (config = {}) => createControlFromJSX(
    <ControlButton
      icon={config.icon || '✏️'}
      title={config.title || 'Drawing Tools'}
      onClick={() => {
        if (config.onClick) {
          config.onClick();
        } else {
          alert('Drawing tools would be implemented here');
        }
      }}
    />
  ),
  measurement: (config = {}) => createControlFromJSX(
    <ControlButton
      icon={config.icon || '📏'}
      title={config.title || 'Measurement Tools'}
      onClick={() => {
        if (config.onClick) {
          config.onClick();
        } else {
          alert('Measurement tools would be implemented here');
        }
      }}
    />
  ),
  fullscreen: (config = {}) => createControlFromJSX(
    <ControlButton
      icon={config.icon || '⛶'}
      title={config.title || 'Fullscreen'}
      onClick={() => {
        if (config.onClick) {
          config.onClick();
        } else {
          const mapContainer = document.querySelector('.leaflet-container')?.parentElement;
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            mapContainer?.requestFullscreen();
          }
        }
      }}
    />
  ),
  custom: (config) => createControlFromJSX(
    <ControlButton
      icon={config.icon || '⚙️'}
      title={config.title || 'Custom Control'}
      onClick={() => {
        if (config.onClick) {
          config.onClick();
        }
      }}
    />
  ),
};

interface MapControlsProps {
  onLayerToggle?: (layerName: string, visible: boolean) => void;
  layerVisibility?: Record<string, boolean>;
}

export default function MapControls({ onLayerToggle, layerVisibility }: MapControlsProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !settings.mapControls) return;

    const controls: L.Control[] = [];
    const position = CONTROL_POSITIONS[settings.mapControls.position] || 'topright';

    // Handle zoom controls
    if (settings.mapControls.enableZoomControls) {
      map.zoomControl.setPosition(position);
    } else {
      map.removeControl(map.zoomControl);
    }

    // Create controls dynamically from configuration
    settings.mapControls.controls?.forEach((controlConfig: any) => {
      if (!controlConfig.enabled) return;

      const factory = CONTROL_FACTORIES[controlConfig.type];
      if (!factory) return;

      let control: L.Control;
      
      // Pass appropriate options based on control type
      if (controlConfig.type === 'layerToggle') {
        control = factory(onLayerToggle, layerVisibility);
      } else if (controlConfig.type === 'custom') {
        control = factory(controlConfig.config);
      } else {
        control = factory(controlConfig.config);
      }

      control.setPosition(position);
      controls.push(control);
      map.addControl(control);
    });

    // Cleanup function
    return () => {
      controls.forEach(control => {
        if (map && control) {
          try {
            map.removeControl(control);
          } catch (e) {
            // Control might already be removed
          }
        }
      });
    };
  }, [map, onLayerToggle]);

  return null; // This component doesn't render anything directly
}
