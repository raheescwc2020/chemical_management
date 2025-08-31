import React, { useState } from 'react';
//import ReportForm from './ReportForm'; // Importing the ReportForm component
import PopupForm from './PopupForm';
import ChemicalInterface from './ChemicalInterface';
import ChemicalList from './ChemicalList';
const Interface = () => {
    // State to control the visibility of the form popup.
    const [isFormOpen, setIsFormOpen] = useState(false);
    // State to store the collection of all saved reports.
    const [allReports, setAllReports] = useState([]);

    // Function to handle saving a new report and closing the form.


    // const handleSaveReport = (newReport) => {
    //     setAllReports(prevReports => [...prevReports, newReport]);
    //     setIsFormOpen(false);
    // };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-8 text-center">Chemical Consumption Tracker</h1>

            {/* Button to open the form */}
            <button
                onClick={() => setIsFormOpen(true)}
                className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300"
            >
                Add Chemical Consumption Report
            </button>

            {/* The popup form, only rendered when isFormOpen is true */}
            {isFormOpen && (
                <PopupForm onClose={() => setIsFormOpen(false)}>
                   
                 <ChemicalInterface 
                 
                 chemicalList = { ChemicalList }
                 setAllReports = {setAllReports}
                 />
                </PopupForm>
            )}

            {/* Display saved reports here */}
            <div className="mt-8 w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-4">Saved Reports</h2>
                {allReports.length > 0 ? (
                    <ul className="space-y-4">
                        {allReports.map((report, index) => (
                            <li key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-bold">{report.chemicalName} - {report.month}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Closing Balance: Qty {report.closingBalance.qty}, Value {report.closingBalance.value}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 p-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <p>Click "Add Chemical Consumption Report" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Interface;
