import React from 'react';


// A simple wrapper component to display children inside a modal.
const PopupForm = ({ children, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-fade-in-up">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
        close
            </button>
            {children}
        </div>
    </div>
);

export default PopupForm;
