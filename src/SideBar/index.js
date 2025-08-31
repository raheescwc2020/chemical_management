import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaTachometerAlt, FaCube, FaChartLine, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Import your components from their respective files.
// Note: Assuming these components exist in your project structure.
const Dashboard = () => <div className="p-8 text-2xl font-bold">Dashboard Overview</div>;
const ChemicalInterface = () => <div className="p-8 text-2xl font-bold">Chemical Management Dashboard</div>;
const Reports = () => <div className="p-8 text-2xl font-bold">Reports Panel</div>;
const ChemicalWiseConsumption = () => <div className="p-8 text-2xl font-bold">Chemical-wise Consumption Reports</div>;

// The Sidebar component remains the same, it just uses the top-level Router
const Sidebar = () => {
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };
 const navItems = [
        {
            title: 'Dashboard',
            icon: <FaTachometerAlt />,
            link: '/',
            subMenus: ['Overview', 'Analytics', 'Reports']
        },
        {
            title: 'Chemical Management',
            icon: <FaCube />,
            link: '/chemical-management',
            subMenus: [
                
                { name:'Current Consumption',link:'/chemical-current-report' }
            ]
        },
        {
            title: 'Reports',
            icon: <FaChartLine />,
            link: '#',
            subMenus: [
                { name: 'Chemical Current Consumption', link: '/chemical-wise-consumption' }
            ]
        }
    ];

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex flex-col transition-all duration-300 ease-in-out">
            <div className="text-2xl font-bold mb-8">Chemical Management System</div>
            <nav className="flex-1">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.title} className="mb-2">
                            <div
                                onClick={() => toggleMenu(item.title)}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                            >
                                <Link to={item.link} className="flex items-center flex-1">
                                    <span className="mr-3">{item.icon}</span>
                                    <span>{item.title}</span>
                                </Link>
                                {item.subMenus && (openMenu === item.title ? <FaChevronUp className="h-4 w-4" /> : <FaChevronDown className="h-4 w-4" />)}
                            </div>
                            {openMenu === item.title && item.subMenus && (
                                <ul className="pl-6 mt-1">
                                    {item.subMenus.map((subMenu) => (
                                        <li key={subMenu.name || subMenu}>
                                            <Link
                                                to={subMenu.link || `${item.link}/${(subMenu.name || subMenu).toLowerCase().replace(/ /g, '-')}`}
                                                className="block py-2 px-3 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                                            >
                                                {subMenu.name || subMenu}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};


export default Sidebar ;
// Main App component with routing setup

