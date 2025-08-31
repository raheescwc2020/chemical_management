import React from 'react';
import Section from './Section';
import InputField from './InputField';
import { Book } from 'lucide-react'; // Import specifically if not passed as prop

const BalanceSection = ({ formData, calculatedData, handleInputChange }) => {
  return (
    <Section title="Balance" icon={Book}>
      <InputField
        label="Opening Balance"
        valueQty={formData.openingBalance.qty}
        valueValue={formData.openingBalance.value}
        onQtyChange={(e) => handleInputChange(e, 'openingBalance', null, 'qty')}
        onValueChange={(e) => handleInputChange(e, 'openingBalance', null, 'value')}
      />
      <InputField
        label="Closing Balance"
        valueQty={calculatedData.closingBalance.qty}
        valueValue={calculatedData.closingBalance.value}
        onQtyChange={() => {}}
        onValueChange={() => {}}
        isReadOnly={true}
      />
    </Section>
  );
};

export default BalanceSection;
