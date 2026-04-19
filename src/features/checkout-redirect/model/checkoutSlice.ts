import { createSlice } from "@reduxjs/toolkit";
import { checkoutApi } from "../api/checkoutApi";

export interface CheckoutState {
  sessionUrl: string | null;
  lastCheckoutError: string | null;
}

const initialState: CheckoutState = {
  sessionUrl: null,
  lastCheckoutError: null,
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    clearCheckoutSession: (state) => {
      state.sessionUrl = null;
      state.lastCheckoutError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      checkoutApi.endpoints.createCheckoutSession.matchFulfilled,
      (state, action) => {
        state.sessionUrl = action.payload.url;
        state.lastCheckoutError = null;
      }
    );
    builder.addMatcher(
      checkoutApi.endpoints.createCheckoutSession.matchRejected,
      (state) => {
        state.sessionUrl = null;
        state.lastCheckoutError = "Request failed";
      }
    );
  },
});

export const { clearCheckoutSession } = checkoutSlice.actions;

export const checkoutReducer = checkoutSlice.reducer;
