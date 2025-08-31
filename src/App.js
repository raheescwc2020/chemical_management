import React, { useState } from 'react';

import './App.css'; // Ensure you have the correct path to your CSS file

import Sidebar from './SideBar'; // Adjust the import path as necessary
import ChemicalInterface from './ChemicalInterface';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import ReportTable from './ReportTable';
import ChemicalWiseConsumption from './Reports/ChemicalWiseConsumption';
function App() {
  // Initialize activeContentIndex to 0
  const [activeContentIndex, setActiveContentIndex] = useState(0);



  return (
     <Router>
            <div className="flex">
                <div className="w-64 fixed top-0 left-0 h-screen overflow-y-auto bg-gray-800 text-white">
                <Sidebar />
                </div>
<div className="flex-1 ml-64 p-4">
                    <Routes>
                        {/* Define all your routes here */}
                      
                        <Route path="/chemical-management" element={<ChemicalInterface />} />
                        <Route path="/chemical-wise-consumption" element={<ReportTable />} />
{/* 
                         <Route path="/chemical-current-report" element={<ReportTable />} /> */}
                      
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;