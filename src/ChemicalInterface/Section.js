import React from 'react';

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
      {Icon && <Icon size={24} className="text-indigo-500" />}
      {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

export default Section;
