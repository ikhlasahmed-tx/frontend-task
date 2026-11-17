import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Me = {
  user: { email: string; citizenship: string | null; hasPasscode: boolean };
  wallet: object | null;
};

type OnboardingState = {
  me: Me | undefined; 
  passcode: string; 
};

const initialState: OnboardingState = { me: undefined, passcode: "" };

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setMe(state, action: PayloadAction<Me>) {
      state.me = action.payload;
    },
    setPasscode(state, action: PayloadAction<string>) {
      state.passcode = action.payload;
    },
  },
});

export const { setMe, setPasscode } = onboardingSlice.actions;
export default onboardingSlice.reducer;
