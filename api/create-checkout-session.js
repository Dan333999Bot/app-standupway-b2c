import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, userId, bookingId, dipendenza } = req.body;

    const appUrl = process.env.APP_URL || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Colloquio iniziale · 30 min",
              description: "Video call con un professionista specializzato in dipendenze",
            },
            unit_amount: 4900, // 49€ in centesimi
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email || undefined,
      success_url: `${appUrl}/thankyou?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/riepilogo`,
      metadata: {
        user_id: userId || "",
        booking_id: bookingId || "",
        dipendenza: dipendenza || "",
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("[Stripe] error:", err);
    return res.status(500).json({ error: err.message });
  }
}
