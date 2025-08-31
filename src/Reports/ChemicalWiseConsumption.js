import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../Pagination';
import { FaTachometerAlt, FaCube, FaChartLine, FaChevronDown, FaChevronUp, FaSpinner } from 'react-icons/fa';
// Dummy data for demonstration (you can keep this for initial state)



const ChemicalWiseConsumption = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState('All');
    const [uniqueWarehouses, setUniqueWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

   const [selectedChemical, setSelectedChemical] = useState('All');
const [uniqueChemicals, setUniqueChemicals] = useState([]);

    // Fetch data from the API endpoint
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Replace this with your actual API call
                const response = await fetch('http://localhost:3005/api/chemical_2025');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setReports(data);

                const warehouses = ['All', ...new Set(data.map(item => item.warehouseName))];
                setUniqueWarehouses(warehouses);
                setLoading(false);


            // Add this to get unique chemical names,
       
            const chemicals = ['All', ...new Set(data.map(item => item.nameofchemical))];
            setUniqueChemicals(chemicals);

            setLoading(false);
            } catch (err) {
                setError('Failed to fetch data. Please check your API endpoint and network connection.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    
    // Update filtered reports whenever the main reports or selected warehouse changes
   useEffect(() => {
    let filtered = reports;

    // Filter by WarehousewarehouseName
    if (selectedWarehouse !== 'All') {
        filtered = filtered.filter(report => report.warehouseName === selectedWarehouse);
    }

    // Filter by Chemical
    if (selectedChemical !== 'All') {
        filtered = filtered.filter(report => report.nameofchemical
            === selectedChemical);
    }

    setFilteredReports(filtered);
    setCurrentPage(1); // Reset to first page on filter change
}, [reports, selectedWarehouse, selectedChemical]);

    // Get current posts for pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8 text-2xl text-gray-500 dark:text-gray-300">
                <FaSpinner className="animate-spin mr-2" /> Loading Reports...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-red-500 text-center">
                {error}
            </div>
        );
    }

     const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    return (
        <div className="p-8 w-full ">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Chemical-wise Consumption Report</h2>
          
            <div className="mb-4 flex items-center space-x-4">
                {/* Filter by Warehouse */}
                <div>
                    <label htmlFor="warehouse-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Warehouse</label>
                    <select
                        id="warehouse-filter"
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        {uniqueWarehouses.map(warehouse => (
                            <option key={warehouse} value={warehouse}>{warehouse}</option>
                        ))}
                    </select>
                </div>
                   <div>
        <label htmlFor="chemical-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Chemical</label>
        <select
            id="chemical-filter"
            value={selectedChemical}
            onChange={(e) => setSelectedChemical(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
            {uniqueChemicals.map(chemical => (
                <option key={chemical} value={chemical}>{chemical}</option>
            ))}
        </select>
    </div>
            </div>


            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th rowSpan="2" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">WarehouseName</th>
                            <th rowSpan="2" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nameofchemical</th>
                            <th colSpan="2" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Opening</th>
                            <th colSpan="2" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Closing</th>
                            <th colSpan="2" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Consumption</th>
                            <th colSpan="2" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Receipt</th>
                            <th colSpan="2" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Transfer</th>
                            <th colSpan="2" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Purchase</th>
                        </tr>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentReports.length > 0 ? (
                            currentReports.map((report, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
    {report.warehouseName}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
    {report.nameofchemical}
  </td>            
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
    {report.openingBalanceQtyApril}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
    {report.openingBalanceValueApril}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
    {report.closingBalanceQtyJuly}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
    {report.closingBalanceValueJuly}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
    {report.totalConsumptionQty}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
    {report.totalConsumptionValue}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
    {report.receiptQty}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
    {report.receiptValue}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
    {report.transferQty}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
    {report.transferValue}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
    {report.purchaseQty}
  </td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
    {report.purchaseValue}
  </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="14" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">No reports found for the selected filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
        

                    length={filteredReports.length}
                postsPerPage={postsPerPage}
                handlePagination={handlePagination}
                currentPage={currentPage}
            />
        </div>
    );
};
export default ChemicalWiseConsumption;