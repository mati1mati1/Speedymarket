import React, { useCallback, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { ShopInventory } from 'src/models';
import { executePaymentFunction } from 'src/api/api';
import PurchaseSummary from './PurchaseSummary';

const stripePromise = loadStripe(process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY || ''); 

interface PaymentsWebProps {
  isOpen: boolean;
  items: ShopInventory[];
  supermarketId: string;
  onRequestClose: () => void;
}

const PaymentsWeb: React.FC<PaymentsWebProps> = ({ isOpen, items, supermarketId, onRequestClose }) => {
  const [isComplete, setIsComplete] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleComplete = () => setIsComplete(true);

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => {
      const discount = item.Discount || 0;
      const priceAfterDiscount = item.Price * (1 - discount / 100);
      return total + priceAfterDiscount * item.Quantity;
    }, 0).toFixed(2);
  };

  // Fetch client secret from your backend
  const fetchClientSecret = useCallback(async () => {
    const totalAmount = calculateTotalPrice(); 
    var response: any = await executePaymentFunction(totalAmount, 'checkout', items);
    setSessionId(response.sessionId);
    return response.clientSecret;
  }, [items]);

  const options = { fetchClientSecret };

  return isComplete ? (
      <PurchaseSummary sessionId={sessionId} items={items} supermarketId={supermarketId} totalAmount={calculateTotalPrice()} onRequestClose={onRequestClose} />
    ) : (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{
        ...options,
        onComplete: handleComplete
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
};

export default PaymentsWeb;
