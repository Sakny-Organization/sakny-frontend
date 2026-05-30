import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
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

const MapPicker = ({ value, onChange }) => {
  const center = value?.lat && value?.lng ? [value.lat, value.lng] : defaultCenter;

  return (
    <div className="property-map-card">
      <div className="property-map-card__header">
        <strong>Select property location</strong>
        <span>Click anywhere on the map to drop a marker and save latitude and longitude.</span>
      </div>

      <div className="property-map-card__map">
        <MapContainer center={center} zoom={value ? 13 : 11} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={onChange} />
          {value?.lat && value?.lng ? <Marker position={[value.lat, value.lng]} /> : null}
        </MapContainer>
      </div>

      <div className="property-map-card__meta">
        <span>Latitude: {value?.lat ? value.lat.toFixed(5) : 'Not selected'}</span>
        <span>Longitude: {value?.lng ? value.lng.toFixed(5) : 'Not selected'}</span>
      </div>
    </div>
  );
};

export default MapPicker;