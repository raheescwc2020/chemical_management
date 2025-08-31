// React Frontend Code (ReportTable.js)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import PopupForm from '../ChemicalInterface/PopupForm';
import ChemicalInterface from '../ChemicalInterface/ChemicalInterface';
import Pagination from '../Pagination';

const ReportTable = () => {
    // State to hold all reports fetched from the API
    const [reports, setReports] = useState([]);

    // State for filter selections
    const [selectedMonth, setSelectedMonth] = useState('All');
    const [selectedChemical, setSelectedChemical] = useState('All');

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    // State to manage the popup form
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Fetch data from the API
    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:8086/api/chemical_data');
            // Assuming the API returns an array of objects
            // and you map the properties to match your table
            const apiData = response.data.map(item => ({
                month: item.month,
                warehouseName: item.warehouseName, // Corrected property name to match the backend
                chemicalName: item.nameofchemical, // Corrected property name to match the backend
             openingBalance: {
        qty: item.openingBalanceQtyApril,
        value: item.openingBalanceValueApril
    },
    
    // The 'closingBalance' is another nested object, using the
    // corresponding properties from the backend.
    closingBalance: {
        qty: item.closingBalanceQtyJuly,
        value: item.closingBalanceValueJuly
    },

    // To make the data more complete and ready for display,
    // let's add the other properties from your JSON.
    // This is optional but a good practice for completeness.
    totalConsumption: {
        qty: item.totalConsumptionQty,
        value: item.totalConsumptionValue
    },
    receipt: {
        qty: item.receiptQty,
        value: item.receiptValue
    },
    transfer: {
        qty: item.transferQty,
        value: item.transferValue
    },
    purchase: {
        qty: item.purchaseQty,
        value: item.purchaseValue
    }
            }));
            setReports(apiData);
        } catch (error) {
            console.error('Error fetching Chemicals:', error);
            // Fallback to dummy data in case of an error
            // setReports(dummyReports); // Use this line if you want to fall back to dummy data
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // Filter reports based on the current selections
    const filteredReports = reports.filter(report => {
        const monthMatch = selectedMonth === 'All' || report.month === selectedMonth;
        const chemicalMatch = selectedChemical === 'All' || report.chemicalName === selectedChemical;
        return monthMatch && chemicalMatch;
    });


    
    // Pagination logic: Slice the filtered reports
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstPost, indexOfLastPost);

    // Unique months and chemicals for the filter dropdowns, based on all reports
    const uniqueMonths = ['All', ...new Set(reports.map(report => report.month))];
    const uniqueChemicals = ['All', ...new Set(reports.map(report => report.chemicalName))];

    // Handle pagination change
    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="mt-8 w-full max-w-6xl">
            <button
                onClick={() => setIsFormOpen(true)}
                className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300"
            >
                Add Chemical Consumption Report
            </button>

            {/* The popup form, only rendered when isFormOpen is true */}
            {isFormOpen && (
                <PopupForm onClose={() => setIsFormOpen(false)}>
                    <ChemicalInterface />
                </PopupForm>
            )}

            <h2 className="text-2xl font-bold mb-4">Chemical Reports</h2>

            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <div>
                    <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Month</label>
                    <select
                        id="month-filter"
                        value={selectedMonth}
                        onChange={(e) => {
                            setSelectedMonth(e.target.value);
                            setCurrentPage(1); // Reset to first page on filter change
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                    >
                        {uniqueMonths.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="chemical-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Chemical</label>
                    <select
                        id="chemical-filter"
                        value={selectedChemical}
                        onChange={(e) => {
                            setSelectedChemical(e.target.value);
                            setCurrentPage(1); // Reset to first page on filter change
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Month</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">WAREHOUSE</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Chemical</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Opening Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Opening Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Closing Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Closing Value</th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Consumption Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Consumption Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Receipt Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Receipt Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transfer Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transfer Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchase Qty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchase Value</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentReports.length > 0 ? (
                            currentReports.map((report, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{report.month}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{report.warehouseName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.chemicalName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.openingBalance.qty}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.openingBalance.value}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.closingBalance.qty}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.closingBalance.value}</td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.totalConsumption.qty}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.totalConsumption.value}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.receipt.qty}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.receipt.value}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.transfer.qty}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.transfer.value}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.purchase.qty}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.purchase.value}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">No reports found for the selected filters.</td>
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

export default ReportTable;