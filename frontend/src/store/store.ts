import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "@/store/onboardingSlice";

// A function, not a single store: on the server a module-level store would be shared between requests.
export function makeStore() {
  return configureStore({
    // The slice reducer itself, not { onboarding: ... }: that object form runs combineReducers, whose
    // Math.random() check breaks prerendering with cacheComponents. A second slice will need a different fix.
    reducer: onboardingReducer,
    // The state holds the passcode; keep it out of the Redux DevTools extension in production.
    devTools: process.env.NODE_ENV !== "production",
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
