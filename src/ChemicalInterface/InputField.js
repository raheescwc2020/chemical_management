import React from 'react';
import { Scale, DollarSign } from 'lucide-react';

const InputField = ({ label, valueQty, valueValue, onQtyChange, onValueChange, isReadOnly = false }) => (
  <div className="flex flex-col gap-2 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative w-full">
        <input
          type="number"
          value={valueQty}
          onChange={onQtyChange}
          readOnly={isReadOnly}
          className={`w-full pl-8 pr-2 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            isReadOnly ? 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-800'
          }`}
          placeholder="Quantity"
        />
        <Scale className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      </div>
      <div className="relative w-full">
        <input
          type="number"
          value={valueValue}
          onChange={onValueChange}
          readOnly={isReadOnly}
          className={`w-full pl-8 pr-2 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            isReadOnly ? 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-800'
          }`}
          placeholder="Value"
        />
        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      </div>
    </div>
  </div>
);

export default InputField;