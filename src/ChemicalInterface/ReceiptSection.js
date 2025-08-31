import React from 'react';
import Section from './Section';
import InputField from './InputField';
import { Receipt } from 'lucide-react';

const ReceiptSection = ({ formData, calculatedData, handleInputChange }) => {
  return (
    <Section title="Receipt of Chemicals" icon={Receipt}>
      <InputField
        label="Receipt from RO Buffer"
        valueQty={formData.receipts.roBuffer.qty}
        valueValue={formData.receipts.roBuffer.value}
        onQtyChange={(e) => handleInputChange(e, 'receipts', 'roBuffer', 'qty')}
        onValueChange={(e) => handleInputChange(e, 'receipts', 'roBuffer', 'value')}
      />
      <InputField
        label="Receipt from Other Warehouses (Kochi)"
        valueQty={formData.receipts.kochiRegion.qty}
        valueValue={formData.receipts.kochiRegion.value}
        onQtyChange={(e) => handleInputChange(e, 'receipts', 'kochiRegion', 'qty')}
        onValueChange={(e) => handleInputChange(e, 'receipts', 'kochiRegion', 'value')}
      />
      <InputField
        label="Receipts from Other Warehouses (Outside Kochi)"
        valueQty={formData.receipts.outsideKochiRegion.qty}
        valueValue={formData.receipts.outsideKochiRegion.value}
        onQtyChange={(e) => handleInputChange(e, 'receipts', 'outsideKochiRegion', 'qty')}
        onValueChange={(e) => handleInputChange(e, 'receipts', 'outsideKochiRegion', 'value')}
      />
      <InputField
        label="Total Receipts"
        valueQty={calculatedData.totalReceipts.qty}
        valueValue={calculatedData.totalReceipts.value}
        onQtyChange={() => {}}
        onValueChange={() => {}}
        isReadOnly={true}
      />
    </Section>
  );
};

export default ReceiptSection;
