import { baseApi } from "@/shared/api/baseApi";
import type {
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
} from "../model/types";

export const paymentIntentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createPaymentIntent: build.mutation<
      CreatePaymentIntentResponse,
      CreatePaymentIntentRequest
    >({
      query: () => ({
        url: "payment-intent",
        method: "POST",
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentIntentApi;
