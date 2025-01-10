import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import nationalData from './components/National.json'; // Import National.json
import provincialData from './components/Provincial.json';
import districtData from './components/District.json';
import tehsilData from './components/Tehsil.json';


const National_CENTER = [30.3753, 69.3451];
const DEFAULT_ZOOM = 5;

// Styles for different boundary levels
const boundaryStyles = {
  national: {
    color: '#ff0000',
    weight: 2.5,
    opacity: 0.9,
    fillOpacity: 0.15
  },
  provincial: {
    color: '#2563eb',
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.1
  },
  district: {
    color: '#059669',
    weight: 1.5,
    opacity: 0.7,
    fillOpacity: 0.05
  },
  tehsil: {
    color: '#7c3aed',
    weight: 1,
    opacity: 0.6,
    fillOpacity: 0.03
  }
};

interface NationalProps {
  activeLayers: {
    national: boolean;
    provincial: boolean;
    district: boolean;
    tehsil: boolean;
  };
}

export function PakistanBoundaryMap({ activeLayers }: NationalProps) {
  const [districtData, setDistrictData] = useState<any>(null);
  const [tehsilData, setTehsilData] = useState<any>(null);
  const [ufgLocations, setUfgLocations] = useState<any[]>([]);

  useEffect(() => {
    if (activeLayers.district) {
      fetch('/api/boundaries/district')
        .then(response => response.json())
        .then(data => setDistrictData(data))
        .catch(error => console.error('Error fetching district boundary data:', error));
    }
    if (activeLayers.tehsil) {
      fetch('/api/boundaries/tehsil')
        .then(response => response.json())
        .then(data => setTehsilData(data))
        .catch(error => console.error('Error fetching tehsil boundary data:', error));
    }
  }, [activeLayers]);

  useEffect(() => {
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      subdomains: ['a', 'b', 'c'],
    }).addTo(map);
  }, []);

  useEffect(() => {
    fetch('/path/to/UFG_Locations.csv')
      .then(response => response.text())
      .then(csvText => {
        const rows = csvText.split('\n').slice(1); // Skip header row
        const locations = rows.map(row => {
          const [name, mobile, address, googlePin] = row.split(',');
          return { name, mobile, address, googlePin };
        });
        setUfgLocations(locations);
      })
      .catch(error => console.error('Error fetching UFG locations:', error));
  }, []);

  return (
    <MapContainer
      center={National_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Add GeoJSON layers when data is available */}
      {activeLayers.national && (
        <GeoJSON 
          data={nationalData} 
          style={boundaryStyles.national}
        />
      )}
      
      {activeLayers.provincial && (
        <GeoJSON 
          data={provincialData} 
          style={boundaryStyles.provincial}
        />
      )}
      
      {districtData && (
        <GeoJSON 
          data={districtData} 
          style={boundaryStyles.district}
        />
      )}
      
      {tehsilData && (
        <GeoJSON 
          data={tehsilData} 
          style={boundaryStyles.tehsil}
        />
      )}
      
      {ufgLocations.map((location, index) => (
        <Marker key={index} position={/* extract lat/lng from googlePin */}>
          <Popup>
            <div>
              <h3>{location.name}</h3>
              <p>{location.address}</p>
              <a href={location.googlePin} target="_blank" rel="noopener noreferrer">View on Google Maps</a>
            </div>
          </Popup>
        </Marker>
      ))}

      <ZoomControl position="bottomright" />
    </MapContainer>
  );
}
