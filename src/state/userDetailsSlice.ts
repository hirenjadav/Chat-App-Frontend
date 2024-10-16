import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDetails, userDetailsMapper } from "../models/userDetails.model";

// Initial state with type as Partial to account for null
const initialState: Partial<UserDetails> = null;

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    fetchUserDetails: (state) => {
      return JSON.parse(localStorage.getItem("userData"));
    },
    setUserDetails: (state, action: PayloadAction<any>) => {
      if (!action.payload) {
        localStorage.removeItem("userData");
        return null;
      }
      const mappedDetails = userDetailsMapper(action.payload);
      localStorage.setItem("userData", JSON.stringify(mappedDetails));
      return mappedDetails;
    },
    removeUserDetails: () => {
      localStorage.removeItem("userData");
      return null; // State is reset to null
    },
  },
});

// Reducer for store
const userDetailsReducer = userDetailsSlice.reducer;

// Actions for dispatching
export const userDetailsActions = userDetailsSlice.actions;

// Selectors for state
export const userDetailsSelector = {
  userId: (state: { userDetails: UserDetails | null }) =>
    state?.userDetails?.id || null,
  userDetails: (state: { userDetails: UserDetails | null }) =>
    state?.userDetails,
};

export default userDetailsReducer;
