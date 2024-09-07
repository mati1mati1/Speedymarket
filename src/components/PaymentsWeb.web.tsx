import React, { useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { ShopInventory } from 'src/models';

// Load Stripe outside of the render method
const stripePromise = loadStripe('pk_test_51PvlZ3KWQ0uKuoXnujEJuj5KA30Wv7UHIHghn8XNWggo01RtK0gRDGiv3kdBMfVvjOtZysRKRt8sPgCwaulYAVBl00EUEnnefi'); // Replace with your real Stripe public key

interface PaymentsWebProps {
  isOpen: boolean;
  items: ShopInventory[];
  onRequestClose: () => void;
}

const PaymentsWeb: React.FC<PaymentsWebProps> = ({ isOpen, items, onRequestClose }) => {
  // Calculate total price from items in the cart
  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + item.Price * item.Quantity, 0);
  };

  // Fetch client secret from your backend
  const fetchClientSecret = useCallback(() => {
    const totalAmount = calculateTotalPrice() * 100; 
    return fetch('http://localhost:7071/api/Payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: totalAmount,paymentType: 'checkout'}), // Amount in cents
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, [items]);

  const options = { fetchClientSecret };

  return isOpen ? (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
      <button onClick={onRequestClose}>Close Payment</button>
    </div>
  ) : null;
};

export default PaymentsWeb;
