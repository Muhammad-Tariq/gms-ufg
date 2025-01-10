import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { PakistanBoundaryMap } from './components/map/PakistanBoundaryMap';
import { MapControls } from './components/map/MapControls';
import { BoundaryControls } from './components/map/BoundaryControls';
import 'leaflet/dist/leaflet.css';
import './App.css';

const App: React.FC = () => {
  const [activeLayers, setActiveLayers] = useState({
    national: true,
    provincial: true,
    district: true,
    tehsil: true,
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 p-4 overflow-hidden flex flex-col relative">
          <BoundaryControls activeLayers={activeLayers} setActiveLayers={setActiveLayers} />
          <MapControls />
          <PakistanBoundaryMap activeLayers={activeLayers} />
        </div>
      </div>
    </div>
  );
};

export default App;