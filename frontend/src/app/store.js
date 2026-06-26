import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import { api } from "../services/api";
import cartReducer from "../features/cart/cartSlice";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
} from "redux-persist";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import themeReducer from "../features/theme/themeSlice";
import uiReducer from "../features/ui/uiSlice";
import notificationReducer from "../features/notification/notificationSlice";

const persistConfig = {
  key: "root",
  storage: storage.default,
  whitelist: ["auth", "cart", "wishlist", "theme", "ui"],
};

const appReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  theme: themeReducer,
  ui: uiReducer,
  notification: notificationReducer,
  [api.reducerPath]: api.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    // Keep only the theme selection
    const theme = state?.theme;
    state = { theme };
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

setupListeners(store.dispatch);

export const persistor =
  persistStore(store);