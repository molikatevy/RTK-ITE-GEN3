
import { countSlice } from '@/features/countSlice/countSlice';
import { configureStore } from "@reduxjs/toolkit";
import { uploadApi } from "@/services/uploadApi";
import { ecommerceApi } from "@/services/ecommerce";
import { authApi } from "@/services/auth";

export const store = configureStore({
  reducer: {
    count: countSlice.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [ecommerceApi.reducerPath]: ecommerceApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ecommerceApi.middleware,
      uploadApi.middleware,
      authApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

