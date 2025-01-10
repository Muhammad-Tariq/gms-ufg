import React from 'react';
import { Search } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <aside className="sidebar bg-gray-200 p-4 w-72 flex flex-col">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search Anything on Map"
          className="search-input px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-500 w-full"
        />
        <button className="search-button ml-2 p-2 rounded-md bg-green-500 text-white hover:bg-green-600">
          <Search className="w-6 h-6" />
        </button>
      </div>
      <div className="titles">
        <h2 className="title hover:text-green-500">Title 1</h2>
        <h2 className="title hover:text-green-500">Title 2</h2>
        <h2 className="title hover:text-green-500">Title 3</h2>
      </div>
    </aside>
  );
};

export default Sidebar;
