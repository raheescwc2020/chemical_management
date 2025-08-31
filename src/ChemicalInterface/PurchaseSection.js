import React from 'react';
import Section from './Section';
import InputField from './InputField';
import { ShoppingCart, Truck } from 'lucide-react';

const PurchaseSection = ({ formData, handleInputChange }) => {
  return (
    <>
      <Section title="Purchase of Chemicals" icon={ShoppingCart}>
        <InputField
          label="Purchase of Chemicals"
          valueQty={formData.purchases.qty}
          valueValue={formData.purchases.value}
          onQtyChange={(e) => handleInputChange(e, 'purchases', null, 'qty')}
          onValueChange={(e) => handleInputChange(e, 'purchases', null, 'value')}
        />
      </Section>

      <Section title="Transit Details" icon={Truck}>
        <InputField
          label="Chemicals in Transit"
          valueQty={formData.transit.qty}
          valueValue={formData.transit.value}
          onQtyChange={(e) => handleInputChange(e, 'transit', null, 'qty')}
          onValueChange={(e) => handleInputChange(e, 'transit', null, 'value')}
        />
      </Section>
    </>
  );
};

export default PurchaseSection;
