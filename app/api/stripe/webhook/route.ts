import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  const buf = await req.arrayBuffer();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const priceId = (session.line_items?.data?.[0]?.price?.id) || (session as any).lines?.data?.[0]?.price?.id || session.metadata?.priceId;

    if (customerEmail && priceId) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      // Map priceId → tier string
      const tier =
        priceId === process.env.NEXT_PUBLIC_PRICE_BEGINNER ? "Beginner" :
        priceId === process.env.NEXT_PUBLIC_PRICE_INTERMEDIATE ? "Intermediate" :
        priceId === process.env.NEXT_PUBLIC_PRICE_ADVANCED ? "Advanced" :
        priceId === process.env.NEXT_PUBLIC_PRICE_PRO ? "PRO" : "Free";

      // Find user profile by email and update tier
      await supabase.from("profiles").update({ tier }).eq("email", customerEmail);
    }
  }

  return NextResponse.json({ received: true });
}
