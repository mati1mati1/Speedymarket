import React from 'react';
import { ItemWithLocation } from 'src/services/mapService';
interface ShoppingCartProps {
  items: ItemWithLocation[];
}
const Payments: React.FC<ShoppingCartProps> = ({ items }) => {
  const handlePayment = () => {
    alert('Payment processed!');
  };

  return (
    <div>
      <h2>Payments</h2>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default Payments;
