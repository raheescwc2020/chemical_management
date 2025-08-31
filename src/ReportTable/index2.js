import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

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

const MessageModal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                <p className="text-gray-900 dark:text-gray-100 mb-4">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

// Main App component containing all the logic
const ReportTable = () => {
    const [reports, setReports] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState('All');
    const [selectedChemical, setSelectedChemical] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [message, setMessage] = useState('');

    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Hardcoded list of months to populate the dropdowns
    const monthList = ['April 2025', 'May 2025', 'June 2025', 'July 2025', 'August 2025'];

    // State for dynamic period selection
    const [selectedOpeningMonth, setSelectedOpeningMonth] = useState('April 2025');
    const [selectedClosingMonth, setSelectedClosingMonth] = useState('July 2025');

    // Dummy data to seed the database
    const dummyData = [
        { WarehouseName: "ROKOCHI", Nameofchemical: "Soda ash", Opening_Balance_Qty: 1000, Opening_Balance_Value: 25000, Closing_Balance_Qty: 850, Closing_Balance_Value: 21250, Total_ConsumptiononRegularOperations_Qty: 150, Total_ConsumptiononRegularOperations_Value: 3750, Total_PCSConsumption_Qty: 0, Total_PCSConsumption_Value: 0, Total_TotalChemicalConsumption_Value: 3750, Total_TotalChemicalConsumption_Qty: 150, Total_ReceiptofChemicalsfromRObuffer_Qty: 0, Total_ReceiptofChemicalsfromRObuffer_Value: 0, Total_ReceiptofChemicals_WithinROKochi_Qty: 0, Total_ReceiptofChemicals_WithinROKochi_Value: 0, Total_ReceiptofChemical_FromOutside_Qty: 0, Total_ReceiptofChemical_FromOutside_Value: 0, Total_ReceiptofChemical_at_Warehouse_Qty: 0, Total_ReceiptofChemical_at_Warehouse_Value: 0, Total_InterwhTransfer_WithinROKochi_Qty: 0, Total_InterwhTransfer_WithinROKochi_Value: 0, Total_IntraWHTransfer_ToOutside_Qty: 0, Total_IntraWHTransfer_ToOutside_Value: 0, Total_TotalTransferofChemcal_from_WH_Qty: 0, Total_TotalTransferofChemcal_from_WH_Value: 0, Total_PuchaseofChemical_from_WH_Qty: 0, Total_PuchaseofChemical_from_WH_Value: 0, Total_PurchaseofChemical_from_RO_Qty: 0, Total_PurchaseofChemical_from_RO_Value: 0, Total_PurchaseofChemical_at_WH_Qty: 0, Total_PurchaseofChemical_at_WH_Value: 0 },
        { WarehouseName: "ROKOCHI", Nameofchemical: "Potassium permanganate", Opening_Balance_Qty: 500, Opening_Balance_Value: 10000, Closing_Balance_Qty: 400, Closing_Balance_Value: 8000, Total_ConsumptiononRegularOperations_Qty: 100, Total_ConsumptiononRegularOperations_Value: 2000, Total_PCSConsumption_Qty: 0, Total_PCSConsumption_Value: 0, Total_TotalChemicalConsumption_Value: 2000, Total_TotalChemicalConsumption_Qty: 100, Total_ReceiptofChemicalsfromRObuffer_Qty: 0, Total_ReceiptofChemicalsfromRObuffer_Value: 0, Total_ReceiptofChemicals_WithinROKochi_Qty: 0, Total_ReceiptofChemicals_WithinROKochi_Value: 0, Total_ReceiptofChemical_FromOutside_Qty: 0, Total_ReceiptofChemical_FromOutside_Value: 0, Total_ReceiptofChemical_at_Warehouse_Qty: 0, Total_ReceiptofChemical_at_Warehouse_Value: 0, Total_InterwhTransfer_WithinROKochi_Qty: 0, Total_InterwhTransfer_WithinROKochi_Value: 0, Total_IntraWHTransfer_ToOutside_Qty: 0, Total_IntraWHTransfer_ToOutside_Value: 0, Total_TotalTransferofChemcal_from_WH_Qty: 0, Total_TotalTransferofChemcal_from_WH_Value: 0, Total_PuchaseofChemical_from_WH_Qty: 0, Total_PuchaseofChemical_from_WH_Value: 0, Total_PurchaseofChemical_from_RO_Qty: 0, Total_PurchaseofChemical_from_RO_Value: 0, Total_PurchaseofChemical_at_WH_Qty: 0, Total_PurchaseofChemical_at_WH_Value: 0 }
    ];

    // Firebase Initialization & Auth
    useEffect(() => {
        try {
            if (firebaseConfig) {
                const app = initializeApp(firebaseConfig);
                const firestoreDb = getFirestore(app);
                const firebaseAuth = getAuth(app);
                setDb(firestoreDb);
                setAuth(firebaseAuth);

                const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
                    if (user) {
                        setUserId(user.uid);
                    } else {
                        // Sign in anonymously if no token is available
                        await signInAnonymously(firebaseAuth);
                        setUserId(firebaseAuth.currentUser.uid);
                    }
                    setIsAuthReady(true);
                });
                return () => unsubscribe();
            }
        } catch (error) {
            console.error("Firebase initialization error:", error);
            setMessage("Failed to initialize Firebase. Check your configuration.");
        }
    }, []);

    // Fetch and sync data with Firestore
    useEffect(() => {
        if (!isAuthReady || !db) return;

        // Use a fixed doc for simplicity, or structure by month if needed
        const reportDocRef = doc(db, `artifacts/${appId}/public/data/reports`, 'monthly_summary');

        const unsubscribe = onSnapshot(reportDocRef, async (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data().data;
                const parsedData = JSON.parse(data);
                setReports(parsedData);
            } else {
                // If the document doesn't exist, create it with dummy data
                console.log("No initial data found. Seeding with dummy data.");
                await setDoc(reportDocRef, { data: JSON.stringify(dummyData) });
            }
        }, (error) => {
            console.error("Error listening to Firestore document:", error);
            setMessage("Failed to load report data.");
        });

        return () => unsubscribe();
    }, [isAuthReady, db]);

    const filteredReports = reports.filter(report => {
        const warehouseMatch = selectedWarehouse === 'All' || report.WarehouseName === selectedWarehouse;
        const chemicalMatch = selectedChemical === 'All' || report.Nameofchemical === selectedChemical;
        return warehouseMatch && chemicalMatch;
    });

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstPost, indexOfLastPost);

    const uniqueWarehouses = ['All', ...new Set(reports.map(report => report.WarehouseName))];
    const uniqueChemicals = ['All', ...new Set(reports.map(report => report.Nameofchemical))];

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDownloadExcel = () => {
        if (filteredReports.length === 0) {
            setMessage('No data to download.');
            return;
        }

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

        const csvRows = filteredReports.map(report => [
            `${selectedOpeningMonth} - ${selectedClosingMonth}`,
            report.WarehouseName,
            report.Nameofchemical,
            report.Opening_Balance_Qty,
            report.Opening_Balance_Value,
            report.Closing_Balance_Qty,
            report.Closing_Balance_Value,
            report.Total_ConsumptiononRegularOperations_Qty,
            report.Total_ConsumptiononRegularOperations_Value,
            report.Total_PCSConsumption_Qty,
            report.Total_PCSConsumption_Value,
            report.Total_TotalChemicalConsumption_Qty,
            report.Total_TotalChemicalConsumption_Value,
            report.Total_ReceiptofChemicalsfromRObuffer_Qty,
            report.Total_ReceiptofChemicalsfromRObuffer_Value,
            report.Total_ReceiptofChemicals_WithinROKochi_Qty,
            report.Total_ReceiptofChemicals_WithinROKochi_Value,
            report.Total_ReceiptofChemical_FromOutside_Qty,
            report.Total_ReceiptofChemical_FromOutside_Value,
            report.Total_ReceiptofChemical_at_Warehouse_Qty,
            report.Total_ReceiptofChemical_at_Warehouse_Value,
            report.Total_InterwhTransfer_WithinROKochi_Qty,
            report.Total_InterwhTransfer_WithinROKochi_Value,
            report.Total_IntraWHTransfer_ToOutside_Qty,
            report.Total_IntraWHTransfer_ToOutside_Value,
            report.Total_TotalTransferofChemcal_from_WH_Qty,
            report.Total_TotalTransferofChemcal_from_WH_Value,
            report.Total_PuchaseofChemical_from_WH_Qty,
            report.Total_PuchaseofChemical_from_WH_Value,
            report.Total_PurchaseofChemical_from_RO_Qty,
            report.Total_PurchaseofChemical_from_RO_Value,
            report.Total_PurchaseofChemical_at_WH_Qty,
            report.Total_PurchaseofChemical_at_WH_Value,
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
            {message && <MessageModal message={message} onClose={() => setMessage('')} />}
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
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                    <div>
                        <label htmlFor="opening-month-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Opening Month</label>
                        <select
                            id="opening-month-select"
                            value={selectedOpeningMonth}
                            onChange={(e) => {
                                setSelectedOpeningMonth(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                        >
                            {monthList.map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="closing-month-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Closing Month</label>
                        <select
                            id="closing-month-select"
                            value={selectedClosingMonth}
                            onChange={(e) => {
                                setSelectedClosingMonth(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                        >
                            {monthList.map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{`${selectedOpeningMonth} - ${selectedClosingMonth}`}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{report.WarehouseName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Nameofchemical}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600">{report.Opening_Balance_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Opening_Balance_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600">{report.Closing_Balance_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Closing_Balance_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600">{report.Total_ConsumptiononRegularOperations_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_ConsumptiononRegularOperations_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_PCSConsumption_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_PCSConsumption_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_TotalChemicalConsumption_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_TotalChemicalConsumption_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600">{report.Total_ReceiptofChemicalsfromRObuffer_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_ReceiptofChemicalsfromRObuffer_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_ReceiptofChemicals_WithinROKochi_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_ReceiptofChemicals_WithinROKochi_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_ReceiptofChemical_FromOutside_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_ReceiptofChemical_FromOutside_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_ReceiptofChemical_at_Warehouse_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_ReceiptofChemical_at_Warehouse_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600">{report.Total_InterwhTransfer_WithinROKochi_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_InterwhTransfer_WithinROKochi_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_IntraWHTransfer_ToOutside_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_IntraWHTransfer_ToOutside_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_TotalTransferofChemcal_from_WH_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_TotalTransferofChemcal_from_WH_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600">{report.Total_PuchaseofChemical_from_WH_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_PuchaseofChemical_from_WH_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_PurchaseofChemical_from_RO_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_PurchaseofChemical_from_RO_Value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_PurchaseofChemical_at_WH_Qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.Total_PurchaseofChemical_at_WH_Value}</td>
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
