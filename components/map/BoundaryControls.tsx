import React from 'react';
import { Layers } from 'lucide-react';

interface BoundaryControlsProps {
  activeLayers: {
    national: boolean;
    provincial: boolean;
    district: boolean;
    tehsil: boolean;
  };
  setActiveLayers: React.Dispatch<React.SetStateAction<{
    national: boolean;
    provincial: boolean;
    district: boolean;
    tehsil: boolean;
  }>>;
}

export function BoundaryControls({ activeLayers, setActiveLayers }: BoundaryControlsProps) {
  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center mb-3">
        <Layers className="h-5 w-5 text-gray-600 mr-2" />
        <span className="font-medium text-gray-700">Boundary Layers</span>
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={activeLayers.national}
            onChange={() => toggleLayer('national')}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <span className="ml-2 text-sm text-gray-600">National Boundaries</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={activeLayers.provincial}
            onChange={() => toggleLayer('provincial')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600">Provincial Boundaries</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={activeLayers.district}
            onChange={() => toggleLayer('district')}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="ml-2 text-sm text-gray-600">District Boundaries</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={activeLayers.tehsil}
            onChange={() => toggleLayer('tehsil')}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="ml-2 text-sm text-gray-600">Tehsil Boundaries</span>
        </label>
      </div>
    </div>
  );
}
