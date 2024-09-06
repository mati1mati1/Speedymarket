// src/components/Payments.web.tsx
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Initialize Stripe.js with your publishable key
const stripePromise = loadStripe('your-publishable-key-here');

const PaymentsWeb: React.FC<{ items: any[] }> = ({ items }) => {
  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + item.Price * item.Quantity, 0);
  };

  return (
    <div>
      <h2>Total Price: ${calculateTotalPrice().toFixed(2)}</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm totalAmount={calculateTotalPrice()} />
      </Elements>
    </div>
  );
};

export default PaymentsWeb;
