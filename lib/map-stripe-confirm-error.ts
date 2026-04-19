import type { StripeError } from "@stripe/stripe-js";

export function mapStripeConfirmErrorToMessage(error: StripeError): string {
  const code = error.code ?? "";
  const declineCode = error.decline_code ?? "";

  if (code === "card_declined") {
    if (declineCode === "insufficient_funds") {
      return "The card was declined: insufficient funds (test card ending in 9995).";
    }
    if (declineCode === "generic_decline") {
      return "The card was declined.";
    }
    if (declineCode) {
      return `The card was declined (${declineCode.replace(/_/g, " ")}).`;
    }
    return error.message ?? "The card was declined.";
  }

  if (code === "expired_card") {
    return "The card has expired (test card ending in 0069).";
  }

  if (code === "incorrect_cvc" || code === "invalid_cvc") {
    return "The card’s security code is incorrect.";
  }

  if (code === "processing_error") {
    return "A processing error occurred. Try again.";
  }

  if (code === "incorrect_number" || code === "invalid_number") {
    return "The card number is not valid.";
  }

  return error.message ?? "Payment could not be completed.";
}
