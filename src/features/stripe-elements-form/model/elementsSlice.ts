import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ElementsPaymentReceipt } from "./payment-receipt";
import { paymentIntentApi } from "../api/paymentIntentApi";

export type ElementsPaymentOutcome = "idle" | "succeeded" | "failed";

export interface ElementsState {
  clientSecret: string | null;
  elementsOutcome: ElementsPaymentOutcome;
  elementsErrorMessage: string | null;
  elementsReceipt: ElementsPaymentReceipt | null;
}

const initialState: ElementsState = {
  clientSecret: null,
  elementsOutcome: "idle",
  elementsErrorMessage: null,
  elementsReceipt: null,
};

export const elementsSlice = createSlice({
  name: "elements",
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
      paymentIntentApi.endpoints.createPaymentIntent.matchFulfilled,
      (state, action) => {
        state.clientSecret = action.payload.clientSecret;
      }
    );
    builder.addMatcher(
      paymentIntentApi.endpoints.createPaymentIntent.matchRejected,
      (state) => {
        state.clientSecret = null;
      }
    );
  },
});

export const { resetElementsOutcome, setElementsSuccess, setElementsFailure } =
  elementsSlice.actions;

export const elementsReducer = elementsSlice.reducer;
