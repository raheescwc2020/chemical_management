import React, { useState } from 'react';
import PopupForm from './PopupForm';

// The list of chemicals extracted from the image provided.
const chemicalList = [
    "Agenda (Per Ltr)", "AIP (Per KG)", "BORIC ACID (Per gm)",
    "Bromodiolone Cake (Per Unit)", "CANON SMOGE (Per Unit)",
    "Chlorpyriphos (Per Unit)", "Cypermethrin (Per Ltr)",
    "Deltamethrin 1.25% ULV (Per mg)", "Deltamethrin 2.5%WP (Per KG)",
    "Fipronil (Per gm)", "Fly glue pads (small) (Per Unit)",
    "Glyphosate (Per Ltr)", "Gramicid (Per Ltr)",
    "imidacloprid (Per Ltr)", "K-Othrin (Per Ltr)",
    "Lambda Cyhalothrin 10%WP (Per KG)", "Malathion (Per Ltr)",
    "Metaldehyde (Per KG)", "Phenol (Per Ltr)",
    "Propoxur (Per mg)", "Rat glue pads (big) (Per Unit)",
    "Rat glue pads (small) (Per Unit)", "Ratcon (Per KG)",
    "Responsar (Per Ltr)", "Solfac (Per KG)",
    "Temephos (Per Ltr)", "Temprid (Per KG)",
    "Zinc Phosphide (Per gm)"
];

/**
 * A form component for adding new reports, wrapped in a PopupForm.
 * This component contains the dropdown for selecting a chemical.
 * @param {object} props
 * @param {function} props.onClose - Function to close the popup.
 */
const ChemicalList =() => {
    // State to hold the selected chemical from the dropdown.
    const [selectedChemical, setSelectedChemical] = useState('');
    // State to hold the selected date from the calendar input.
    const [selectedDate, setSelectedDate] = useState('');

    return (
      
                    <div className="flex-1 flex-col">
                        <label htmlFor="chemical-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Select Chemical
                        </label>
                        <select
                            id="chemical-select"
                            value={selectedChemical}
                            onChange={(e) => setSelectedChemical(e.target.value)}
                            className="p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 w-full"
                        
                        >
                            <option value="" disabled>-- Select a chemical --</option>
                            {chemicalList.map((chemical, index) => (
                                <option key={index} value={chemical}>
                                    {chemical}
                                </option>
                            ))}
                        </select>
                    </div>
              
    );
};

export default ChemicalList;
