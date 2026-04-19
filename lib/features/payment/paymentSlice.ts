import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ElementsPaymentReceipt } from "@/lib/elements-payment-receipt";
import { paymentApi } from "./paymentApi";

export type ElementsPaymentOutcome = "idle" | "succeeded" | "failed";

export interface PaymentState {
  clientSecret: string | null;
  elementsOutcome: ElementsPaymentOutcome;
  elementsErrorMessage: string | null;
  elementsReceipt: ElementsPaymentReceipt | null;
}

const initialState: PaymentState = {
  clientSecret: null,
  elementsOutcome: "idle",
  elementsErrorMessage: null,
  elementsReceipt: null,
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetElementsOutcome: (state) => {
      state.elementsOutcome = "idle";
      state.elementsErrorMessage = null;
      state.elementsReceipt = null;
    },
    setElementsSuccess: (state, action: PayloadAction<ElementsPaymentReceipt>) => {
      state.elementsOutcome = "succeeded";
      state.elementsErrorMessage = null;
      state.elementsReceipt = action.payload;
    },
    setElementsFailure: (state, action: PayloadAction<string>) => {
      state.elementsOutcome = "failed";
      state.elementsErrorMessage = action.payload;
      state.elementsReceipt = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      paymentApi.endpoints.createPaymentIntent.matchFulfilled,
      (state, action) => {
        state.clientSecret = action.payload.clientSecret;
      }
    );
    builder.addMatcher(
      paymentApi.endpoints.createPaymentIntent.matchRejected,
      (state) => {
        state.clientSecret = null;
      }
    );
  },
});

export const { resetElementsOutcome, setElementsSuccess, setElementsFailure } =
  paymentSlice.actions;
