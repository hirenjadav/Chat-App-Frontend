import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatDetails } from '../models/chatDetails.model'; // Adjust the path as necessary

// Initial state
const initialState: ChatDetails | null = null;

const chatDetailsSlice = createSlice({
  name: 'chatDetails',
  initialState,
  reducers: {
    setChatDetails: (state, action: PayloadAction<any>) => {
      localStorage.setItem("chatData", JSON.stringify(action.payload)); // Store in localStorage if needed
      return action.payload; // Update state with mapped chat details
    },
    removeChatDetails: () => {
      localStorage.removeItem("chatData"); // Clear from localStorage
      return null; // Reset state to null
    },
  },
});

// Reducer for the store
const chatDetailsReducer = chatDetailsSlice.reducer;

// Actions for dispatching
export const chatDetailsActions = chatDetailsSlice.actions;

// Selectors for state
export const chatDetailsSelector = {
  chatId: (state: { chatDetails: ChatDetails | null }) => state?.chatDetails?.id || null,
  chatDetails: (state: { chatDetails: ChatDetails | null }) => state?.chatDetails,
};

export default chatDetailsReducer;
