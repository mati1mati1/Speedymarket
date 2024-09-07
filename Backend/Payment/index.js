const stripe = require('stripe')('sk_test_51PvlZ3KWQ0uKuoXn1DFv2Prp3bLJOJFVyxchrlzdpm8ZDJYCKRJMzbzUlYcHsKvSXbZ6EQO1xn3oql8V26bmw3XQ00orKTPmSX');

module.exports = async function (context, req) {
  const { amount, paymentType } = req.body; 
  const amountInCents = Math.round(amount * 100);
  try {
    if (paymentType === 'checkout') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: 'Shopping Cart Items' },
              unit_amount: amountInCents, 
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        ui_mode: 'embedded',
        redirect_on_completion: 'never'
      });

      context.res = {
        status: 200,
        body: { 
          clientSecret: session.client_secret,
          sessionId: session.id
         },
      };
    }
    else if (paymentType === 'paymentIntent') {
      const customer = await stripe.customers.create();
      const ephemeralKey = await stripe.ephemeralKeys.create({ customer: customer.id }, { apiVersion: '2020-08-27' });
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        customer: customer.id,
        automatic_payment_methods: { enabled: true },
      });

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
