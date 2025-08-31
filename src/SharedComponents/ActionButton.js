import React from 'react';
import { Save, Trash2 } from 'lucide-react';

const ActionButton = ({ handleSave, handleReset }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={handleSave}
        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <Save size={20} />
        Save Report
      </button>
      <button
        onClick={handleReset}
        className="w-full sm:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <Trash2 size={20} />
        Reset Form
      </button>
    </div>
  );
};

export default ActionButton;
