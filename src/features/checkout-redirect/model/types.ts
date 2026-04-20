export type CheckoutMode = "payment" | "subscription";

export interface CreateCheckoutSessionRequest {
  mode: CheckoutMode;
  amountCents: number;
  quantity: number;
  productName: string;
}

export interface CreateCheckoutSessionResponse {
  url: string;
}
