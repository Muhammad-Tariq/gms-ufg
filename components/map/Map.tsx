import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Control, DomEvent, DomUtil, Map as LeafletMap } from 'leaflet'; // Import necessary Leaflet modules
import { BoundaryControls } from './BoundaryControls';
import { MapControls } from './MapControls';

interface MapProps {
    boundaryData: any[];
}

// Custom Zoom and Measure Controls
const ZoomControls = () => {
    const map = useMap();
    return (
        <div className="leaflet-control leaflet-bar">
            <a
                className="leaflet-control-zoom-in"
                href="#"
                title="Zoom in"
                onClick={(e) => {
                    e.preventDefault();
                    map.zoomIn();
                }}
            >
                +
            </a>
            <a
                className="leaflet-control-zoom-out"
                href="#"
                title="Zoom out"
                onClick={(e) => {
                    e.preventDefault();
                    map.zoomOut();
                }}
            >
                -
            </a>
        </div>
    );
};

// Measurement Control with React
const MeasurementControl = () => {
    const map = useMap();

    useEffect(() => {
        let measureControl = null; // Keep track of the control instance

        class MeasureControl extends Control {
            options: any;
            _container: any;
            _map: any;
            _state: string;
            _polyline: any;
            _markers: any;
            constructor(options: any) {
                super(options);
                this.options = options;
                this._state = 'inactive';
            }

            onAdd(map: LeafletMap) {
                this._map = map;
                this._container = DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                this._container.innerHTML = `
            <a href="#" title="Measure Distance" class="measure-button active:bg-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75v-7.5m16.5 7.5v-7.5M5.25 7.5h13.5m-13.5 3.75h13.5" />
          </svg>
            </a>
                `;
                DomEvent.on(this._container, 'click', this._toggleMeasure, this);
                return this._container;
            }

            onRemove(map: LeafletMap) {
              DomEvent.off(this._container, 'click', this._toggleMeasure, this);
            }

             _toggleMeasure() {
              if (this._state === 'inactive') {
                  this._startMeasure();
              } else {
                  this._endMeasure();
              }
           }

           _startMeasure() {
              this._state = 'active';
              this._polyline = null;
              this._markers = [];

              if (!this._map) return; // Ensure map is defined
              this._map.on('click', this._addPoint, this);
             // Add active class to show button in an active state
            this._container.querySelector('a')?.classList.add('active');

          }

           _endMeasure() {
              this._state = 'inactive';
              if(this._polyline) {
                 this._map.removeLayer(this._polyline)
              }
              this._markers.forEach((marker: any) => this._map.removeLayer(marker));
              this._markers = [];

              if (!this._map) return; // Ensure map is defined
               this._map.off('click', this._addPoint, this);
            // Remove active class
            this._container.querySelector('a')?.classList.remove('active');
          }

           _addPoint(e: any) {
              if (!this._map) return;
               this._markers.push(L.marker(e.latlng).addTo(this._map).bindPopup(this._getPopupContent(e.latlng)));

              if (this._markers.length > 1) {
                   const latlngs = this._markers.map((marker: any) => marker.getLatLng());
                   if (this._polyline) {
                    this._polyline.setLatLngs(latlngs)
                    } else {
                      this._polyline = L.polyline(latlngs, { color: 'blue' }).addTo(this._map);
                    }


              }
            }

            _getPopupContent(latlng: any) {
              const distance = this._calculateDistance(latlng);
              return `Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)} ${distance !== null ? `<br>Distance: ${distance.toFixed(2)} km` : ""}`
            }

            _calculateDistance(latlng: any) {
                if (this._markers && this._markers.length > 0) {
                    const prevLatlng = this._markers[this._markers.length - 1].getLatLng();
                    return this._map.distance(prevLatlng, latlng) / 1000; //Distance in KM
                }

                return null; // If no previous point, return null
           }


      }


       measureControl = new MeasureControl({ position: 'topleft' });


        // Add the control when the component mounts
        map.addControl(measureControl);

        // Clean up when the component unmounts
         return () => {
            if (measureControl) {
               map.removeControl(measureControl);
            }
        };
    }, [map]);


    return null; // It renders the control on the map, so it doesn't need to render anything else here
};

const Map: React.FC<MapProps> = ({ boundaryData }) => {
    const [activeLayers, setActiveLayers] = useState({
        national: true,
        provincial: true,
        district: true,
        tehsil: true,
    });

    return (
        <MapContainer center={[30.3753, 69.3451]} zoom={5} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {boundaryData && <GeoJSON data={boundaryData} />}
            <BoundaryControls activeLayers={activeLayers} setActiveLayers={setActiveLayers} />
            <MapControls />
        </MapContainer>
    );
};

export default Map;
