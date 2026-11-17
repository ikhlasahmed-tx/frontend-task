import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "@/store/onboardingSlice";

export function makeStore() {
  return configureStore({
    reducer: onboardingReducer,
    devTools: process.env.NODE_ENV !== "production",
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
