import React from 'react';
import { XCircle } from 'lucide-react';

const Modal = ({ isOpen, title, message, onConfirm, isConfirmDialog, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 m-4 w-full max-w-sm">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XCircle size={24} />
          </button>
        </div>
        <div className="mt-2 mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
        </div>
        <div className="flex justify-end gap-2">
          {isConfirmDialog && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm || onClose}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-bold ${
              isConfirmDialog
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isConfirmDialog ? 'Confirm' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
