import { configureStore } from "@reduxjs/toolkit";
import { checkoutReducer } from "@/features/checkout-redirect";
import { elementsReducer } from "@/features/stripe-elements-form";
import { baseApi } from "@/shared/api/baseApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      checkout: checkoutReducer,
      elements: elementsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
