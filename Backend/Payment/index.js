const stripe = require('stripe')('sk_test_51PvlZ3KWQ0uKuoXn1DFv2Prp3bLJOJFVyxchrlzdpm8ZDJYCKRJMzbzUlYcHsKvSXbZ6EQO1xn3oql8V26bmw3XQ00orKTPmSX');

module.exports = async function (context, req) {
  const { amount, paymentType } = req.body; // Get amount and payment type (e.g., 'checkout' or 'paymentIntent')

  try {
    // If the payment is for Stripe Checkout (web):
    if (paymentType === 'checkout') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: 'Shopping Cart Items' },
              unit_amount: amount, // Price in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        ui_mode: 'embedded',
        return_url: 'https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}'

      });

      // Return the session ID for web payments
      context.res = {
        status: 200,
        body: { clientSecret: session.client_secret },
      };
    }
    // Else, create a PaymentIntent (mobile payments):
    else if (paymentType === 'paymentIntent') {
      const customer = await stripe.customers.create();
      const ephemeralKey = await stripe.ephemeralKeys.create({ customer: customer.id }, { apiVersion: '2020-08-27' });
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Amount in cents
        currency: 'usd',
        customer: customer.id,
        automatic_payment_methods: { enabled: true },
      });

      // Return the client secret, ephemeral key, and customer ID for mobile payments
      context.res = {
        status: 200,
        body: {
          paymentIntent: paymentIntent.client_secret,
          ephemeralKey: ephemeralKey.secret,
          customer: customer.id,
        },
      };
    } else {
      context.res = {
        status: 400,
        body: { error: 'Invalid payment type' },
      };
    }
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: error.message },
    };
  }
};
