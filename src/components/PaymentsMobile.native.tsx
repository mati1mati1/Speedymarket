import React, { useState, useEffect } from 'react';
import { Button, Alert, View, StyleSheet, Pressable, Text, Modal } from 'react-native';
import { ShopInventory } from 'src/models'; 

interface PaymentsMobileProps {
  isOpen: boolean;
  items: ShopInventory[]; 
  onRequestClose: () => void;
}

interface PaymentSheetParams {
  paymentIntentClientSecret: string;
  ephemeralKeySecret: string;
  customer: string;
} 

const PaymentsMobile: React.FC<PaymentsMobileProps> = ({ isOpen, items, onRequestClose }) => {
  const { initPaymentSheet, presentPaymentSheet } = require('@stripe/stripe-react-native').useStripe();
  const StripeProvider = require('@stripe/stripe-react-native').StripeProvider;
  const [loading, setLoading] = useState(false);
  const [paymentSheetParams, setPaymentSheetParams] = useState<PaymentSheetParams | null>(null);
  const [publishableKey, setPublishableKey] = useState('');


  const fetchPublishableKey = async () => {
    const key = 'sk_test_51PvlZ3KWQ0uKuoXn1DFv2Prp3bLJOJFVyxchrlzdpm8ZDJYCKRJMzbzUlYcHsKvSXbZ6EQO1xn3oql8V26bmw3XQ00orKTPmSX'; 
    setPublishableKey(key);
  };
  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + item.Price * item.Quantity, 0);
  };
  useEffect(() => {
    fetchPublishableKey();
  }, []); 

  const fetchPaymentSheetParams = async () => {
    const totalAmount = calculateTotalPrice() * 100; 

    const response = await fetch('http://localhost:7071/api/Payment', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: totalAmount })
    });

    const { paymentIntent, ephemeralKey, customer } = await response.json();
    
    setPaymentSheetParams({
      paymentIntentClientSecret: paymentIntent,
      ephemeralKeySecret: ephemeralKey,
      customer: customer,
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
    } else {
      setLoading(true);
    }
  };
  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert('Payment failed', error.message);
    } else {
      Alert.alert('Success', 'Your payment is confirmed!');
      onRequestClose(); 
    }
  };

  return (
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
              loading && { backgroundColor: 'gray', opacity: 0.5 }
            ]}
            onPress={openPaymentSheet}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Pay Now (${calculateTotalPrice().toFixed(2)})</Text>
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
