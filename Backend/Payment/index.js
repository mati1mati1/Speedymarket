const stripe = require('stripe')('sk_test_51PvlZ3KWQ0uKuoXn1DFv2Prp3bLJOJFVyxchrlzdpm8ZDJYCKRJMzbzUlYcHsKvSXbZ6EQO1xn3oql8V26bmw3XQ00orKTPmSX');


module.exports = async function (context, req) {
  const { amount } = req.body; // Amount to be paid in cents

  try {
      // Step 1: Create a new Stripe customer
      const customer = await stripe.customers.create();

      // Step 2: Create an ephemeral key for the customer
      const ephemeralKey = await stripe.ephemeralKeys.create(
          { customer: customer.id },
          { apiVersion: '2020-08-27' }
      );

      // Step 3: Create a PaymentIntent for the customer
      const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, // Amount is expected to be in cents
          currency: 'usd',
          customer: customer.id,
          automatic_payment_methods: { enabled: true }, // Use Stripe's automatic payment methods
      });

      // Step 4: Return the client secret, ephemeral key, and customer ID
      context.res = {
          body: {
              paymentIntent: paymentIntent.client_secret,
              ephemeralKey: ephemeralKey.secret,
              customer: customer.id,
          },
      };
  } catch (error) {
      context.res = {
          status: 500,
          body: { error: error.message },
      };
  }
};
