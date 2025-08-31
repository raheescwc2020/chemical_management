import React, { useState, useEffect } from 'react';

import {
 
  Calendar,
  Warehouse,
  Receipt,
  ArrowRight,
  ShoppingCart,
  Truck,
  Package,
  Book,
  Scale,
  DollarSign,
  XCircle,
  Save,
  Trash2
} from 'lucide-react';

import Model from './Model';
import ChemicalList from './ChemicalList';
import DateSelector from '../DateSelector';
import Section from './Section';
import InputField from './InputField';
import BalanceSection from './BalanceSection';
import ConsumptionSection from './ConsumptionSection';
import ReceiptSection from './ReceiptSection';
import TransferSection from './TransferSection';
import PurchaseSection from './PurchaseSection';
import TransitSection from './TransitSection';
import ActionButton from '../SharedComponents/ActionButton';
import ReportTable from '../ReportTable';
// Main application component
const ChemicalInterface = () => {
  // State for the modal dialog
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isConfirmDialog: false,
  });

  // Function to show the modal
  const showModal = (title, message, isConfirmDialog = false, onConfirm = null) => {
    setModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      isConfirmDialog,
    });
  };


const [allReports, setAllReports] = useState([]);

  
  // Function to close the modal
  const closeModal = () => {
    setModal({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      isConfirmDialog: false,
    });
  };

  // Define the initial state for the monthly report data
  const initialData = {
    month: 'January',
    year: new Date().getFullYear().toString(),
    openingBalance: { qty: 10000, value: 500000 },
    consumption: {
      regularOps: { qty: 0, value: 0 },
      pcs: { qty: 0, value: 0 },
    },
    receipts: {
      roBuffer: { qty: 0, value: 0 },
      kochiRegion: { qty: 0, value: 0 },
      outsideKochiRegion: { qty: 0, value: 0 },
    },
    transfers: {
      kochiRegion: { qty: 0, value: 0 },
      outsideKochiRegion: { qty: 0, value: 0 },
      insideKochiRegion: { qty: 0, value: 0 },
    },
    purchases: { qty: 0, value: 0 },
    transit: { qty: 0, value: 0 },
  };

  const [formData, setFormData] = useState(initialData);

  // State to hold the calculated values
  const [calculatedData, setCalculatedData] = useState({
    totalConsumption: { qty: 0, value: 0 },
    totalReceipts: { qty: 0, value: 0 },
    totalTransfers: { qty: 0, value: 0 },
    closingBalance: { qty: 0, value: 0 },
  });

  // Effect to recalculate totals and closing balance whenever formData changes
  useEffect(() => {
    // Helper function to safely parse a value to a float, defaulting to 0 for non-numeric input
    const parseValue = (val) => parseFloat(val) || 0;

    // Calculate total consumption
    const totalConsumptionQty = parseValue(formData.consumption.regularOps.qty) + parseValue(formData.consumption.pcs.qty);
    const totalConsumptionValue = parseValue(formData.consumption.regularOps.value) + parseValue(formData.consumption.pcs.value);

    // Calculate total receipts
    const totalReceiptsQty = parseValue(formData.receipts.roBuffer.qty) + parseValue(formData.receipts.kochiRegion.qty) + parseValue(formData.receipts.outsideKochiRegion.qty);
    const totalReceiptsValue = parseValue(formData.receipts.roBuffer.value) + parseValue(formData.receipts.kochiRegion.value) + parseValue(formData.receipts.outsideKochiRegion.value);

    // Calculate total transfers
    const totalTransfersQty = parseValue(formData.transfers.kochiRegion.qty) + parseValue(formData.transfers.outsideKochiRegion.qty) + parseValue(formData.transfers.insideKochiRegion.qty);
    const totalTransfersValue = parseValue(formData.transfers.kochiRegion.value) + parseValue(formData.transfers.outsideKochiRegion.value) + parseValue(formData.transfers.insideKochiRegion.value);

    // Calculate closing balance
    const closingBalanceQty = parseValue(formData.openingBalance.qty) + totalReceiptsQty + parseValue(formData.purchases.qty) - totalConsumptionQty - totalTransfersQty;
    const closingBalanceValue = parseValue(formData.openingBalance.value) + totalReceiptsValue + parseValue(formData.purchases.value) - totalConsumptionValue - totalTransfersValue;

    // Update the state with the new calculated values
    setCalculatedData({
      totalConsumption: { qty: totalConsumptionQty, value: totalConsumptionValue },
      totalReceipts: { qty: totalReceiptsQty, value: totalReceiptsValue },
      totalTransfers: { qty: totalTransfersQty, value: totalTransfersValue },
      closingBalance: { qty: closingBalanceQty, value: closingBalanceValue },
    });
  }, [formData]);

  // Handle input changes for any field in the form
  const handleInputChange = (e, section, subSection = null, key) => {
    const { value } = e.target;
    // Update the state immutably based on the field's location in the data structure
    setFormData(prevData => {
      const newData = { ...prevData };
      if (subSection) {
        newData[section][subSection][key] = value;
      } else {
        newData[section][key] = value;
      }
      return newData;
    });
  };

  // Handle change for the month/year dropdowns
  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle the form submission
  const handleSave = () => {
    // In a real application, this is where you would send the data to a backend API
    console.log("Saving data:", formData, "with calculated values:", calculatedData);
    showModal('Success', 'Report saved successfully!');




    const reportToSave = {
        month: formData.month,
        chemicalName: "Default Chemical", // You need to add an input for this in your form
        openingBalance: formData.openingBalance,
        closingBalance: calculatedData.closingBalance,
        totalConsumption: calculatedData.totalConsumption,
        totalReceipts: calculatedData.totalReceipts,
        totalTransfers: calculatedData.totalTransfers,
        purchase: formData.purchases,
        transit: formData.transit,
    };
    setAllReports(prevReports => [...prevReports, reportToSave]);
    showModal('Success', 'Report saved successfully!');
    // Optional: Reset form after saving
    setFormData(initialData);

console.log(this.allReports);

  };

  // Handle form reset
  const handleReset = () => {
    showModal(
      'Confirm Reset',
      'Are you sure you want to reset the form? All unsaved data will be lost.',
      true,
      () => {
        setFormData(initialData);
        closeModal();
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8 font-sans">
      
      <div className="max-w-4xl mx-auto space-y-8">
  

        <DateSelector
          formData={formData}
          handleDropdownChange={handleDropdownChange}
    chemicalData = {ChemicalList}
        />

        <BalanceSection
          formData={formData}
          calculatedData={calculatedData}
          handleInputChange={handleInputChange}
          BookIcon={Book} // Pass Lucide icons as props
        />

        <ConsumptionSection
          formData={formData}
          calculatedData={calculatedData}
          handleInputChange={handleInputChange}
          ArrowRightIcon={ArrowRight}
        />

        <ReceiptSection
          formData={formData}
          calculatedData={calculatedData}
          handleInputChange={handleInputChange}
          ReceiptIcon={Receipt}
        />

        <TransferSection
          formData={formData}
          calculatedData={calculatedData}
          handleInputChange={handleInputChange}
          PackageIcon={Package}
        />

        <PurchaseSection
          formData={formData}
          handleInputChange={handleInputChange}
          ShoppingCartIcon={ShoppingCart}
          TruckIcon={Truck}
        />
         <TransitSection
          formData={formData}
          handleInputChange={handleInputChange}
          ShoppingCartIcon={ShoppingCart}
          TruckIcon={Truck}
        />


        <ActionButton
          handleSave={handleSave}
          handleReset={handleReset}
          SaveIcon={Save}
          Trash2Icon={Trash2}
        />
      </div>
      <Model
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        isConfirmDialog={modal.isConfirmDialog}
        onClose={closeModal}
      />
  
    
    </div>


  );
};

export default ChemicalInterface;