import { baseApi } from "@/shared/api/baseApi";
import type {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from "../model/types";

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCheckoutSession: build.mutation<
      CreateCheckoutSessionResponse,
      CreateCheckoutSessionRequest
    >({
      query: (body) => ({
        url: "checkout",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateCheckoutSessionMutation } = checkoutApi;
