import React from 'react';
import { Ruler } from 'lucide-react';

export function MapControls() {
  return (
    <div className="absolute bottom-8 right-8 z-[1000] bg-white rounded-lg shadow-lg">
      <button
        className="p-2 hover:bg-gray-100 rounded-lg"
        title="Measure Distance"
      >
        <Ruler className="h-6 w-6 text-gray-600" />
      </button>
    </div>
  );
}
