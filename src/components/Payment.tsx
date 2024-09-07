import React from 'react';
import { Platform } from 'react-native';

// Define props type here, customize as per your requirement
interface PaymentProps {
  isOpen: boolean;
  onRequestClose: () => void;
  items: any[];  // Replace `any` with proper type if you have defined it
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
