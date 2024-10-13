import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userDetailsReducer from './userDetailsSlice';
import chatDetailsReducer from './chatDetailsSlice';

// Combine the reducers
const rootReducer = combineReducers({
  userDetails: userDetailsReducer,
  chatDetails: chatDetailsReducer,
});

// Configure the store with the combined reducers
const store = configureStore({
  reducer: rootReducer,
});

export default store;