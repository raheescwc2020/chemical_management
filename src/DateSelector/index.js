import React from 'react';
import { Calendar, Warehouse } from 'lucide-react';
import ChemicalList from '../ChemicalInterface/ChemicalList';

const DateSelector = ({ formData, handleDropdownChange, chemicalData }) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Calendar size={20} className="text-indigo-500" />
        <select
          name="month"
          value={formData.month}
          onChange={handleDropdownChange}
          className="p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        >
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          name="year"
          value={formData.year}
          onChange={handleDropdownChange}
          className="p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

  <div className="flex items-center gap-2 w-full sm:w-auto">
<ChemicalList/>

  </div>


      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Warehouse size={20} className="text-indigo-500" />
        <select
          name="warehouse"
          value="Main Warehouse"
          onChange={handleDropdownChange}
          className="p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 w-full"
        >
          <option value="Main Warehouse">Main Warehouse</option>
          <option value="Kochi Region A">Kochi Region A</option>
          <option value="Kochi Region B">Kochi Region B</option>
        </select>
      </div>
    </div>
  );
};

export default DateSelector;