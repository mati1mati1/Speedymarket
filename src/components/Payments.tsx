// import React, { useState } from 'react';
// import { Alert, View, Button, StyleSheet } from 'react-native';
// import { useStripe, CardField, ApplePayButton, presentApplePay } from '@stripe/stripe-react-native';

// const PaymentScreen = () => {
//   const { initPaymentSheet, presentPaymentSheet, confirmPayment, retrievePaymentIntent } = useStripe();
//   const [paymentMethod, setPaymentMethod] = useState(null);

//   // Handle credit card payment
//   const handlePayWithCard = async () => {
//     const { error, paymentIntent } = await confirmPayment('your-client-secret', {
//       type: 'Card',
//       billingDetails: {
//         email: 'user@example.com',
//       },
//     });

//     if (error) {
//       Alert.alert('Payment failed', error.message);
//     } else {
//       Alert.alert('Payment successful', `PaymentIntent status: ${paymentIntent.status}`);
//     }
//   };

//   // Handle Apple Pay payment
//   const handleApplePay = async () => {
//     const { error } = await presentApplePay({
//       cartItems: [
//         { label: 'Supermarket Total', amount: '50.00' },
//       ],
//       country: 'US',
//       currency: 'USD',
//     });

//     if (error) {
//       Alert.alert('Payment failed', error.message);
//     } else {
//       Alert.alert('Payment successful', 'Apple Pay payment completed!');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <CardField
//         postalCodeEnabled={true}
//         placeholders={{
//           number: '4242 4242 4242 4242',
//         }}
//         cardStyle={styles.card}
//         style={styles.cardContainer}
//         onCardChange={(cardDetails) => {
//           console.log('Card details', cardDetails);
//           setPaymentMethod(cardDetails);
//         }}
//       />
//       <Button title="Pay with Card" onPress={handlePayWithCard} />
      
//       {/* Apple Pay button */}
//       <ApplePayButton
//         onPress={handleApplePay}
//         type="plain"
//         style={styles.applePayButton}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//   },
//   cardContainer: {
//     height: 50,
//     marginVertical: 30,
//     width: '90%',
//   },
//   applePayButton: {
//     marginTop: 20,
//     width: '80%',
//     height: 50,
//   },
// });

// export default PaymentScreen;
