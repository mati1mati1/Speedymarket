// src/components/Payments.web.tsx
import React from 'react';


const PaymentsWeb: React.FC<{ items: any[] }> = ({ items }) => {
  const stripePromise = require('@stripe/stripe-js').loadStripe('your-publishable-key-here');
  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + item.Price * item.Quantity, 0);
  };

  return (
    <div>
      <h2>Total Price: ${calculateTotalPrice().toFixed(2)}</h2>

    </div>
  );
};

export default PaymentsWeb;
