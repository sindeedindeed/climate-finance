import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { formatCurrency } from '../../utils/formatters';

// Fix default marker icon issue in Leaflet with Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom purple marker icon
const purpleMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// 7 major divisions of Bangladesh with approximate lat/lng
const DIVISIONS = [
  { name: 'Dhaka', lat: 23.8103, lng: 90.4125 },
  { name: 'Chattogram', lat: 22.3569, lng: 91.7832 },
  { name: 'Khulna', lat: 22.8456, lng: 89.5403 },
  { name: 'Barisal', lat: 22.7010, lng: 90.3535 },
  { name: 'Sylhet', lat: 24.8949, lng: 91.8687 },
  { name: 'Rajshahi', lat: 24.3745, lng: 88.6042 },
  { name: 'Rangpur', lat: 25.7439, lng: 89.2752 },
];

// Normalization map for division names
const REGION_NAME_MAP = {
  'Dhaka': ['Dhaka'],
  'Chattogram': ['Chattogram', 'Chittagong'],
  'Khulna': ['Khulna'],
  'Barisal': ['Barisal', 'Barishal'],
  'Sylhet': ['Sylhet'],
  'Rajshahi': ['Rajshahi'],
  'Rangpur': ['Rangpur']
};

const BangladeshMapComponent = ({ data = [], title = 'Regional Distribution Map', height = 400 }) => {
  // Map data by region name for quick lookup (case-insensitive)
  const regionData = {};
  data.forEach(item => {
    regionData[item.region?.toLowerCase()] = item;
  });

  // Helper to find data for a division, considering possible name variants
  const getDivisionData = (divisionName) => {
    const variants = REGION_NAME_MAP[divisionName] || [divisionName];
    for (const variant of variants) {
      const key = variant.toLowerCase();
      if (regionData[key]) return regionData[key];
    }
    return null;
  };

  // Center of Bangladesh
  const center = [23.685, 90.3563];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div style={{ width: '100%', height: height, minHeight: 350 }}>
        <MapContainer center={center} zoom={7} style={{ width: '100%', height: '100%', borderRadius: '12px', minHeight: 350 }} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {DIVISIONS.map((div) => {
            const data = getDivisionData(div.name);
            return (
              <Marker key={div.name} position={[div.lat, div.lng]} icon={purpleMarker}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-bold mb-1">{div.name}</div>
                    {data ? (
                      <>
                        <div>Adaptation: {formatCurrency(data.adaptation)}</div>
                        <div>Mitigation: {formatCurrency(data.mitigation)}</div>
                        <div className="font-medium">Total: {formatCurrency((data.adaptation || 0) + (data.mitigation || 0))}</div>
                      </>
                    ) : (
                      <div>No data available</div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default BangladeshMapComponent; 