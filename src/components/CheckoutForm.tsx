// src/components/CheckoutForm.tsx
import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  totalAmount: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js has not yet loaded
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement!,
    });

    if (error) {
      console.error('[Error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay ${totalAmount.toFixed(2)}
      </button>
    </form>
  );
};

export default CheckoutForm;
