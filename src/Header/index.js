import React from 'react';

const Header = () => (
  <header className="text-center">
    <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
      Chemicals Monthly Report
    </h1>
    <p className="mt-2 text-gray-500 dark:text-gray-400">
      Enter the monthly data for the warehouse chemicals.
    </p>
  </header>
);

export default Header;