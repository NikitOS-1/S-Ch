export interface StripeTestCard {
  readonly brand: string;
  readonly number: string;
  readonly cvc: string;
  readonly date: string;
  readonly result: string;
}

export interface StripeTestCardSection {
  readonly title: string;
  readonly cards: readonly StripeTestCard[];
}

export const STRIPE_DOCS_URL = "https://docs.stripe.com";

export const STRIPE_TEST_CARDS_DOCS_URL =
  "https://docs.stripe.com/testing?testing-method=card-numbers";

export const STRIPE_TEST_CARD_SECTIONS: readonly StripeTestCardSection[] = [
  {
    title: "Successful payments by brand",
    cards: [
      {
        brand: "Visa",
        number: "4242 4242 4242 4242",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Visa (debit)",
        number: "4000 0566 5566 5556",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Mastercard",
        number: "5555 5555 5555 4444",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Mastercard (2-series)",
        number: "2223 0031 2200 3222",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "American Express",
        number: "3782 822463 10005",
        cvc: "Any 4 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Discover",
        number: "6011 1111 1111 1117",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "JCB",
        number: "3566 0020 2036 0505",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "UnionPay",
        number: "6200 0000 0000 0005",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
    ],
  },
  {
    title: "Common decline and authentication scenarios",
    cards: [
      {
        brand: "Insufficient funds",
        number: "4000 0000 0000 9995",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Declined: insufficient_funds",
      },
      {
        brand: "Lost card",
        number: "4000 0000 0000 9987",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Declined: lost_card",
      },
      {
        brand: "Stolen card",
        number: "4000 0000 0000 9979",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Declined: stolen_card",
      },
      {
        brand: "Expired card",
        number: "4000 0000 0000 0069",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Declined: expired_card",
      },
      {
        brand: "Incorrect CVC",
        number: "4000 0000 0000 0127",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Declined: incorrect_cvc",
      },
      {
        brand: "3D Secure required",
        number: "4000 0027 6000 3184",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Requires authentication",
      },
      {
        brand: "3D Secure always fails",
        number: "4000 0084 0000 1629",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Authentication fails",
      },
    ],
  },
  {
    title: "International cards by country — Americas",
    cards: [
      {
        brand: "United States (US) — Visa",
        number: "4242 4242 4242 4242",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Argentina (AR) — Visa",
        number: "4000 0003 2000 0021",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Brazil (BR) — Visa",
        number: "4000 0007 6000 0002",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Canada (CA) — Visa",
        number: "4000 0012 4000 0000",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Mexico (MX) — Visa",
        number: "4000 0048 4000 8001",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Mexico (MX) — Carnet",
        number: "5062 2100 0000 0009",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Peru (PE) — Visa",
        number: "4000 0060 4000 0068",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Uruguay (UY) — Visa",
        number: "4000 0085 8000 0003",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
    ],
  },
  {
    title: "International cards by country — Europe and Middle East",
    cards: [
      {
        brand: "United Kingdom (GB) — Visa",
        number: "4000 0082 6000 0000",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "United Kingdom (GB) — Mastercard",
        number: "5555 5582 6555 4449",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Germany (DE) — Visa",
        number: "4000 0027 6000 0016",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "France (FR) — Visa",
        number: "4000 0025 0000 0003",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Netherlands (NL) — Visa",
        number: "4000 0052 8000 0002",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Spain (ES) — Visa",
        number: "4000 0072 4000 0007",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Ukraine (UA) — Visa",
        number: "4000 0080 4000 0008",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "United Arab Emirates (AE) — Visa",
        number: "4000 0078 4000 0001",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Saudi Arabia (SA) — Visa",
        number: "4000 0068 2000 0007",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
    ],
  },
  {
    title: "International cards by country — Asia Pacific",
    cards: [
      {
        brand: "Australia (AU) — Visa",
        number: "4000 0003 6000 0006",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "China (CN) — Visa",
        number: "4000 0015 6000 0002",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Hong Kong (HK) — Visa",
        number: "4000 0034 4000 0004",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "India (IN) — Visa",
        number: "4000 0035 6000 0008",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Japan (JP) — Visa",
        number: "4000 0039 2000 0003",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Japan (JP) — JCB",
        number: "3530 1113 3330 0000",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Singapore (SG) — Visa",
        number: "4000 0070 2000 0003",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
      {
        brand: "Thailand (TH) — Visa",
        number: "4000 0076 4000 0008",
        cvc: "Any 3 digits",
        date: "Any future date",
        result: "Payment succeeds",
      },
    ],
  },
] as const;
