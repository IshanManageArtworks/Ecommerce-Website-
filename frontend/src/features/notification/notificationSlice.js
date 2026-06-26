import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  page: 1,
  hasMore: true,
  isLoading: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotifications: (state, action) => {
      // Avoid adding duplicate notifications
      const newItems = action.payload.filter(
        (newItem) => !state.items.some((existingItem) => existingItem.id === newItem.id)
      );
      state.items = [...state.items, ...newItems];
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearNotifications: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.isLoading = false;
    },
  },
});

export const {
  addNotifications,
  incrementPage,
  setHasMore,
  setLoading,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
