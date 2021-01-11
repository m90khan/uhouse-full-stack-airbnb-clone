import stripe from 'stripe';

const client = new stripe(`${process.env.S_SECRET_KEY}`, {
  apiVersion: '2020-08-27',
});

export const Stripe = {
  connect: async (code: string) => {
    // to get the connected user information
    const response = await client.oauth.token({
      grant_type: 'authorization_code',
      code,
    });
    // if (!response) {
    //   return new Error('failed to connect with stripe');
    // }
    return response;
  },

  // creating direct charges
  charge: async (amount: number, source: string, stripeAccount: string) => {
    const res = await client.charges.create(
      {
        amount,
        currency: 'usd',
        source,
        application_fee_amount: Math.round(amount * 0.05),
      },
      {
        stripe_account: stripeAccount,
      }
    );

    if (res.status !== 'succeeded') {
      throw new Error('failed to create charge with Stripe');
    }
  },
};
