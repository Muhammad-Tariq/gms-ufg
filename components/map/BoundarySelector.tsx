import React from 'react';

interface BoundarySelectorProps {
  onSelectBoundary: (boundary: string) => void;
}

const BoundarySelector: React.FC<BoundarySelectorProps> = ({ onSelectBoundary }) => {
  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectBoundary(event.target.value);
  };

  return (
    <div className="flex items-center space-x-4">
      <label htmlFor="boundary" className="block text-sm font-medium text-gray-700">
        Select Boundary:
      </label>
      <select
        id="boundary"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onChange={handleSelectionChange}
      >
        <option value="">None</option>
        <option value="national">National Boundary</option>
        <option value="provincial">Provincial Boundary</option>
        <option value="district">District Boundary</option>
        <option value="tehsil">Tehsil Boundary</option>
      </select>
    </div>
  );
};

export default BoundarySelector;
