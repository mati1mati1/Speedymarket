import React from 'react';
import { Platform } from 'react-native';
import { ShopInventory } from 'src/models';

interface PaymentProps {
  isOpen: boolean;
  items: ShopInventory[];
  supermarketId: string;
  onRequestClose: () => void;
}

const PaymentComponent: React.FC<PaymentProps> = (props: PaymentProps) => {
  if (Platform.OS === 'web') {
    const PaymentsWeb = require('./PaymentsWeb').default;
    return <PaymentsWeb {...props} />;
  } else {
    const PaymentsMobile = require('./PaymentsMobile').default;
    return <PaymentsMobile {...props} />;
  }
};

export default PaymentComponent;
