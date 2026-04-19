import { configureStore } from "@reduxjs/toolkit";
import { paymentApi } from "./features/payment/paymentApi";
import { paymentSlice } from "./features/payment/paymentSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      [paymentApi.reducerPath]: paymentApi.reducer,
      [paymentSlice.name]: paymentSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(paymentApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
