import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const defaultCenter = [30.0444, 31.2357];

const ClickHandler = ({ onChange }) => {
  useMapEvents({
    click(event) {
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
};

const RecenterMap = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);
  return null;
};

const InvalidateSize = () => {
  const map = useMap();
  React.useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
};

const MapPicker = ({ value, onChange }) => {
  const center = value?.lat && value?.lng ? [value.lat, value.lng] : defaultCenter;

  return (
    <div className="property-map-card">
      <div className="property-map-card__header">
        <strong>Select property location</strong>
        <span>Click anywhere on the map to drop a pin.</span>
      </div>

      <div className="property-map-card__map" style={{ height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
        <MapContainer
          center={center}
          zoom={value ? 14 : 11}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <ClickHandler onChange={onChange} />
          <InvalidateSize />
          {value?.lat && value?.lng && (
            <>
              <Marker position={[value.lat, value.lng]} />
              <RecenterMap center={[value.lat, value.lng]} />
            </>
          )}
        </MapContainer>
      </div>

      <div className="property-map-card__meta">
        <span>Lat: {value?.lat ? value.lat.toFixed(5) : '—'}</span>
        <span>Lng: {value?.lng ? value.lng.toFixed(5) : '—'}</span>
      </div>
    </div>
  );
};

export default MapPicker;
