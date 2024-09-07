import { executePaymentFunction } from 'src/api/api';
import React, { useState, useEffect } from 'react';
import { Button, Alert, View, StyleSheet, Pressable, Text, Modal } from 'react-native';
import { ShopInventory } from 'src/models'; 
import PurchaseSummary from './PurchaseSummary';

interface PaymentsMobileProps {
  isOpen: boolean;
  items: ShopInventory[];
  supermarketId: string;
  onRequestClose: () => void;
}

interface PaymentSheetParams {
  paymentIntentClientSecret: string;
  ephemeralKeySecret: string;
  customer: string;
} 

const PaymentsMobile: React.FC<PaymentsMobileProps> = ({ isOpen, items,supermarketId, onRequestClose }) => {
  const { initPaymentSheet, presentPaymentSheet } = require('@stripe/stripe-react-native').useStripe();
  const StripeProvider = require('@stripe/stripe-react-native').StripeProvider;
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paymentSheetParams, setPaymentSheetParams] = useState<PaymentSheetParams | null>(null);
  const [publishableKey, setPublishableKey] = useState('');
  const [isComplete, setIsComplete] = useState(false);



  const fetchPublishableKey = async () => {
    const key = process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY || ''; 
    setPublishableKey(key);
  };

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => {
      const discount = item.Discount || 0;
      const priceAfterDiscount = item.Price * (1 - discount / 100);
      return total + priceAfterDiscount * item.Quantity;
    }, 0).toFixed(2);
  };
  useEffect(() => {
    fetchPublishableKey();
  }, []); 

  const fetchPaymentSheetParams = async () => {
    const totalAmount = calculateTotalPrice(); 
    var response: any = await executePaymentFunction(totalAmount, 'paymentIntent', items);
    setSessionId(response.customer);
    setPaymentSheetParams({
      paymentIntentClientSecret: response.paymentIntent,
      ephemeralKeySecret: response.ephemeralKey,
      customer: response.customer,
    });
  };

  useEffect(() => {
    if (items.length > 0) {
      fetchPaymentSheetParams(); 
    }
  }, [items]);

  const initializePaymentSheet = async () => {
    if (!paymentSheetParams) return;

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: paymentSheetParams.customer,
      customerEphemeralKeySecret: paymentSheetParams.ephemeralKeySecret,
      paymentIntentClientSecret: paymentSheetParams.paymentIntentClientSecret,
      returnURL: 'SpeedyMarket://payment-complete',
    });

    if (error) {
      Alert.alert('Error', error.message);
    } 
  };
  useEffect(() => {
    initializePaymentSheet();
  }, [paymentSheetParams]);

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert('Payment failed', error.message);
    } else {
      Alert.alert('Success', 'Your payment is confirmed!');
      setIsComplete(true); 
    }
  };

  return isComplete ? (
    <PurchaseSummary sessionId={sessionId} items={items} supermarketId={supermarketId} totalAmount={calculateTotalPrice()} />
  ) : (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier" 
      urlScheme="SpeedyMarket" 
      >
    <Modal visible={isOpen} onRequestClose={onRequestClose} transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Pressable
            style={[
              styles.button,
              !paymentSheetParams && { backgroundColor: 'gray', opacity: 0.5 }
            ]}
            onPress={openPaymentSheet}
            disabled={!paymentSheetParams}
          >
            <Text style={styles.buttonText}>Pay Now (${calculateTotalPrice()})</Text>
          </Pressable>

          <Pressable style={styles.closeButton} onPress={onRequestClose}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modal: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  closeButton: {
    padding: 15,
    backgroundColor: 'red',
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
});

export default PaymentsMobile;
