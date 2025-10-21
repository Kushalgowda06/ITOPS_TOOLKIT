import { createSlice } from "@reduxjs/toolkit";

export interface TechAssistState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: TechAssistState = {
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const techAssistSlice = createSlice({
  name: "techAssist",
  initialState,
  reducers: {
    setTechAssistToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setTechAssistLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTechAssistError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearTechAssistToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    resetTechAssistState: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setTechAssistToken,
  setTechAssistLoading,
  setTechAssistError,
  clearTechAssistToken,
  resetTechAssistState,
} = techAssistSlice.actions;

export default techAssistSlice.reducer; 