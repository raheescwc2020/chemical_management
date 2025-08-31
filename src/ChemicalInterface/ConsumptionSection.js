import React from 'react';
import Section from './Section';
import InputField from './InputField';
import { ArrowRight } from 'lucide-react';

const ConsumptionSection = ({ formData, calculatedData, handleInputChange }) => {
  return (
    <Section title="Consumption of Chemicals" icon={ArrowRight}>
      <InputField
        label="Consumption on Regular Operations"
        valueQty={formData.consumption.regularOps.qty}
        valueValue={formData.consumption.regularOps.value}
        onQtyChange={(e) => handleInputChange(e, 'consumption', 'regularOps', 'qty')}
        onValueChange={(e) => handleInputChange(e, 'consumption', 'regularOps', 'value')}
      />
      <InputField
        label="Consumption on PCS"
        valueQty={formData.consumption.pcs.qty}
        valueValue={formData.consumption.pcs.value}
        onQtyChange={(e) => handleInputChange(e, 'consumption', 'pcs', 'qty')}
        onValueChange={(e) => handleInputChange(e, 'consumption', 'pcs', 'value')}
      />
      <InputField
        label="Total Consumption"
        valueQty={calculatedData.totalConsumption.qty}
        valueValue={calculatedData.totalConsumption.value}
        onQtyChange={() => {}}
        onValueChange={() => {}}
        isReadOnly={true}
      />
    </Section>
  );
};

export default ConsumptionSection;
