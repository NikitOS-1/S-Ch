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
      query: (body) => ({
        url: "payment-intent",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentIntentApi;
