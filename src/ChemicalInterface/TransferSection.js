import React from 'react';
import Section from './Section';
import InputField from './InputField';
import { Package } from 'lucide-react';

const TransferSection = ({ formData, calculatedData, handleInputChange }) => {
  return (
    <Section title="Transfer of Chemicals" icon={Package}>
      <InputField
        label="Transfer to Warehouses (Kochi)"
        valueQty={formData.transfers.kochiRegion.qty}
        valueValue={formData.transfers.kochiRegion.value}
        onQtyChange={(e) => handleInputChange(e, 'transfers', 'kochiRegion', 'qty')}
        onValueChange={(e) => handleInputChange(e, 'transfers', 'kochiRegion', 'value')}
      />
      <InputField
        label="Transfer of Chemicals to Other Warehouses at Kochi"
        valueQty={formData.transfers.insideKochiRegion.qty}
        valueValue={formData.transfers.insideKochiRegion.value}
        onQtyChange={(e) => handleInputChange(e, 'transfers', 'insideKochiRegion', 'qty')}
        onValueChange={(e) => handleInputChange(e, 'transfers', 'insideKochiRegion', 'value')}
      />
      <InputField
        label="Transfer to Warehouses (Outside Kochi)"
        valueQty={formData.transfers.outsideKochiRegion.qty}
        valueValue={formData.transfers.outsideKochiRegion.value}
        onQtyChange={(e) => handleInputChange(e, 'transfers', 'outsideKochiRegion', 'qty')}
        onValueChange={(e) => handleInputChange(e, 'transfers', 'outsideKochiRegion', 'value')}
      />
      <InputField
        label="Total Transfers"
        valueQty={calculatedData.totalTransfers.qty}
        valueValue={calculatedData.totalTransfers.value}
        onQtyChange={() => {}}
        onValueChange={() => {}}
        isReadOnly={true}
      />
    </Section>
  );
};

export default TransferSection;