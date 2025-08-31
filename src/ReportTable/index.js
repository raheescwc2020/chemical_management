import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Placeholder components to make the file self-contained
const Pagination = ({ length, postsPerPage, handlePagination, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4 flex justify-center">
      <ul className="flex list-none rounded-md shadow-sm">
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => handlePagination(number)}
              className={`py-2 px-4 leading-tight border border-gray-300 dark:border-gray-600 dark:text-white dark:hover:text-white ${currentPage === number ? 'bg-indigo-600 text-white dark:bg-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'}`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const PopupForm = ({ onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full">
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">&times;</button>
      {children}
    </div>
  </div>
);

const ChemicalInterface = () => (
  <div className="text-gray-900 dark:text-gray-100">
    <h2 className="text-xl font-bold mb-4">Add Report</h2>
    <p>This is a placeholder for the chemical interface form.</p>
  </div>
);


const ReportTable = () => {
  // State to hold all reports fetched from the API
  const [reports, setReports] = useState([]);

  // State for filter selections
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [selectedChemical, setSelectedChemical] = useState('All');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // State to manage the popup form
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch data from the API
  const fetchReports = async () => {
    try {
      // Updated endpoint to reflect the new backend code
      const response = await axios.get('http://xnj9qe-ip-103-148-20-54.tunnelmole.net/api/chemical_2025');

      // Mapping ALL API data to a cleaner format that matches the table columns
      const apiData = response.data.map(item => ({
        // Hardcoding the period since the backend query consolidates
        period: "April - August 2025",
        warehouseName: item.WarehouseName,
        chemicalName: item.Nameofchemical,
        openingBalance: {
          qty: item.Opening_Balance_Qty_April,
          value: item.Opening_Balance_Value_April
        },
        closingBalance: {
          qty: item.Closing_Balance_Qty_July,
          value: item.Closing_Balance_Value_July
        },
        consumption: {
            regularQty: item.Total_ConsumptiononRegularOperations_Qty,
            regularValue: item.Total_ConsumptiononRegularOperations_Value,
            pcsQty: item.Total_PCSConsumption_Qty,
            pcsValue: item.Total_PCSConsumption_Value,
            totalQty: item.Total_TotalChemicalConsumption_Qty,
            totalValue: item.Total_TotalChemicalConsumption_Value
        },
        receipt: {
            fromROBufferQty: item.Total_ReceiptofChemicalsfromRObuffer_Qty,
            fromROBufferValue: item.Total_ReceiptofChemicalsfromRObuffer_Value,
            withinROKochiQty: item.Total_ReceiptofChemicals_WithinROKochi_Qty,
            withinROKochiValue: item.Total_ReceiptofChemicals_WithinROKochi_Value,
            fromOutsideQty: item.Total_ReceiptofChemical_FromOutside_Qty,
            fromOutsideValue: item.Total_ReceiptofChemical_FromOutside_Value,
            totalQty: item.Total_ReceiptofChemical_at_Warehouse_Qty,
            totalValue: item.Total_ReceiptofChemical_at_Warehouse_Value
        },
        transfer: {
            withinROKochiQty: item.Total_InterwhTransfer_WithinROKochi_Qty,
            withinROKochiValue: item.Total_InterwhTransfer_WithinROKochi_Value,
            toOutsideQty: item.Total_IntraWHTransfer_ToOutside_Qty,
            toOutsideValue: item.Total_IntraWHTransfer_ToOutside_Value,
            totalQty: item.Total_TotalTransferofChemcal_from_WH_Qty,
            totalValue: item.Total_TotalTransferofChemcal_from_WH_Value
        },
        purchase: {
            fromWHQty: item.Total_PuchaseofChemical_from_WH_Qty,
            fromWHValue: item.Total_PuchaseofChemical_from_WH_Value,
            fromROQty: item.Total_PurchaseofChemical_from_RO_Qty,
            fromROValue: item.Total_PurchaseofChemical_from_RO_Value,
            totalQty: item.Total_PurchaseofChemical_at_WH_Qty,
            totalValue: item.Total_PurchaseofChemical_at_WH_Value
        },
      }));
      setReports(apiData);
    } catch (error) {
      console.error('Error fetching Chemicals:', error);
      // Fallback to empty array in case of an error
      setReports([]);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter reports based on the current selections
  const filteredReports = reports.filter(report => {
    const warehouseMatch = selectedWarehouse === 'All' || report.warehouseName === selectedWarehouse;
    const chemicalMatch = selectedChemical === 'All' || report.chemicalName === selectedChemical;
    return warehouseMatch && chemicalMatch;
  });
    
  // Pagination logic: Slice the filtered reports
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstPost, indexOfLastPost);

  // Unique warehouses and chemicals for the filter dropdowns, based on all reports
  const uniqueWarehouses = ['All', ...new Set(reports.map(report => report.warehouseName))];
  const uniqueChemicals = ['All', ...new Set(reports.map(report => report.chemicalName))];

  // Handle pagination change
  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };




  const handleDownloadExcel = () => {
    if (filteredReports.length === 0) {
      alert('No data to download.');
      return;
    }

    // Define the headers for the CSV
    const headers = [
      "Period", "Warehouse", "Chemical", "Opening Balance Qty", "Opening Balance Value",
      "Closing Balance Qty", "Closing Balance Value", "Consumption Regular Qty",
      "Consumption Regular Value", "Consumption PCS Qty", "Consumption PCS Value",
      "Consumption Total Qty", "Consumption Total Value", "Receipt RO Buffer Qty",
      "Receipt RO Buffer Value", "Receipt Within WH Qty", "Receipt Within WH Value",
      "Receipt Outside WH Qty", "Receipt Outside WH Value", "Receipt Total Qty",
      "Receipt Total Value", "Transfer Within WH Qty", "Transfer Within WH Value",
      "Transfer To Outside Qty", "Transfer To Outside Value", "Transfer Total Qty",
      "Transfer Total Value", "Purchase From WH Qty", "Purchase From WH Value",
      "Purchase From RO Qty", "Purchase From RO Value", "Purchase Total Qty",
      "Purchase Total Value"
    ];

    // Map the filtered report data to CSV rows
    const csvRows = filteredReports.map(report => [
      report.period,
      report.warehouseName,
      report.chemicalName,
      report.openingBalance.qty,
      report.openingBalance.value,
      report.closingBalance.qty,
      report.closingBalance.value,
      report.consumption.regularQty,
      report.consumption.regularValue,
      report.consumption.pcsQty,
      report.consumption.pcsValue,
      report.consumption.totalQty,
      report.consumption.totalValue,
      report.receipt.fromROBufferQty,
      report.receipt.fromROBufferValue,
      report.receipt.withinROKochiQty,
      report.receipt.withinROKochiValue,
      report.receipt.fromOutsideQty,
      report.receipt.fromOutsideValue,
      report.receipt.totalQty,
      report.receipt.totalValue,
      report.transfer.withinROKochiQty,
      report.transfer.withinROKochiValue,
      report.transfer.toOutsideQty,
      report.transfer.toOutsideValue,
      report.transfer.totalQty,
      report.transfer.totalValue,
      report.purchase.fromWHQty,
      report.purchase.fromWHValue,
      report.purchase.fromROQty,
      report.purchase.fromROValue,
      report.purchase.totalQty,
      report.purchase.totalValue,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'chemical_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 dark:bg-gray-900 min-h-screen font-sans">
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Chemical Reports</h2>
           
           <div className="flex space-x-4">
                <button
                    onClick={handleDownloadExcel}
                    className="bg-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105"
                >
                    Download as Excel
                </button>
           
            <button
                onClick={() => setIsFormOpen(true)}
                className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
            >
                Add Chemical Consumption Report
            </button>

            </div>
        </div>

        {isFormOpen && (
            <PopupForm onClose={() => setIsFormOpen(false)}>
                <ChemicalInterface />
            </PopupForm>
        )}

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div>
            <label htmlFor="warehouse-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Warehouse</label>
            <select
              id="warehouse-filter"
              value={selectedWarehouse}
              onChange={(e) => {
                setSelectedWarehouse(e.target.value);
                setCurrentPage(1);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
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
              onChange={(e) => {
                setSelectedChemical(e.target.value);
                setCurrentPage(1);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
            >
              {uniqueChemicals.map(chemical => (
                <option key={chemical} value={chemical}>{chemical}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th rowSpan="2" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Period</th>
                <th rowSpan="2" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Warehouse</th>
                <th rowSpan="2" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Chemical</th>
                <th colSpan="2" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">Opening Balance</th>
                <th colSpan="2" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">Closing Balance</th>
                <th colSpan="6" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">Consumption</th>
                <th colSpan="8" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">Receipt</th>
                <th colSpan="6" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">Transfer</th>
                <th colSpan="6" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">Purchase</th>
              </tr>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">Regular Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Regular Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PCS Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PCS Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">RO Buffer Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">RO Buffer Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Within WH Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Within WH Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Outside WH Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Outside WH Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">Within WH Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Within WH Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">To Outside Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">To Outside Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">From WH Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">From WH Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">From RO Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">From RO Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Value</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentReports.length > 0 ? (
                currentReports.map((report, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{report.period}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{report.warehouseName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.chemicalName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600">{report.openingBalance.qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.openingBalance.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600">{report.closingBalance.qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.closingBalance.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600">{report.consumption.regularQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.consumption.regularValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.consumption.pcsQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.consumption.pcsValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.consumption.totalQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.consumption.totalValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600">{report.receipt.fromROBufferQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.receipt.fromROBufferValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.receipt.withinROKochiQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.receipt.withinROKochiValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.receipt.fromOutsideQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.receipt.fromOutsideValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.receipt.totalQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.receipt.totalValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600">{report.transfer.withinROKochiQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.transfer.withinROKochiValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.transfer.toOutsideQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.transfer.toOutsideValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.transfer.totalQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.transfer.totalValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600">{report.purchase.fromWHQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.purchase.fromWHValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.purchase.fromROQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.purchase.fromROValue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.purchase.totalQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.purchase.totalValue}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="27" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">No reports found for the selected filters.</td>
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
    </div>
  );
};

export default ReportTable;
