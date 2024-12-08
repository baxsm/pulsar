import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

export const createStripeCheckoutSession = async ({
  userEmail,
  userId,
}: {
  userEmail: string;
  userId: string;
}) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true`,
    customer_email: userEmail,
    metadata: {
      userId,
    },
  });

  return session;
};
