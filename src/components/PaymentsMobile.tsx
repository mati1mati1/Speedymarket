import React from 'react';
import { View, Button, Alert, StyleSheet, Text } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { ShopInventory } from 'src/models';

interface PaymentsMobileProps {
  items: ShopInventory[]; 
}

const PaymentsMobile: React.FC<PaymentsMobileProps> = ({ items }) => {
  const { confirmPayment } = useStripe();
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);

  // Calculate the total price from shoppingCart items
  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + item.Price * item.Quantity, 0); 
  };

  // Simulate fetching the clientSecret from your backend (e.g., Azure Function)
  const fetchClientSecret = async () => {
    try {
      const totalAmount = calculateTotalPrice() * 100; // Amount in cents
      const response = await fetch('https://your-backend-server-url.com/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Error fetching client secret:', error);
      Alert.alert('Error', 'Unable to initiate payment.');
    }
  };

  // Handle credit card payment
  const handlePayWithCard = async () => {
    if (!clientSecret) {
      Alert.alert('Error', 'Client secret is missing. Initialize payment first.');
      return;
    }

    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card', 
      paymentMethodData: {
        billingDetails: {
          email: 'customer@example.com', 
          name: 'John Doe', 
          phone: '555-555-5555', 
          address: {
            city: 'San Francisco',
            country: 'US',
            line1: '123 Main St',
            postalCode: '94111',
            state: 'CA',
          },
        },
      },
    });

    if (error) {
      Alert.alert('Payment failed', error.message);
    } else if (paymentIntent) {
      Alert.alert('Payment successful', `PaymentIntent status: ${paymentIntent.status}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.totalPrice}>Total Price: ${calculateTotalPrice().toFixed(2)}</Text>
      
      {/* Card Field for input */}
      <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={(cardDetails) => {
          console.log('Card details:', cardDetails);
        }}
      />
      <Button title="Initialize Payment" onPress={fetchClientSecret} />
      <Button title="Pay with Card" onPress={handlePayWithCard} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
  },
  cardContainer: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default PaymentsMobile;
