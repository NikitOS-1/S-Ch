import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface CheckoutSessionResponse {
  url: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
}

const clientBaseQuery = fetchBaseQuery({
  baseUrl: "",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: clientBaseQuery,
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<CheckoutSessionResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.checkout,
        method: "POST",
      }),
    }),
    createPaymentIntent: builder.mutation<PaymentIntentResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.paymentIntent,
        method: "POST",
      }),
    }),
  }),
});

export const { useCreateCheckoutSessionMutation, useCreatePaymentIntentMutation } =
  paymentApi;
