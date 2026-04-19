export const env = {
  appUrl: process.env.NEXT_PUBLIC_URL,
  stripePaymentLink: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "",
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
} as const;

export function requireAppUrl(): string {
  const value = env.appUrl;
  if (!value || value.length === 0) {
    throw new Error("Missing NEXT_PUBLIC_URL");
  }
  return value;
}
