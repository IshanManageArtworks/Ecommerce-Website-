import { createSelector } from "@reduxjs/toolkit";

const selectCartItems = (state) => state.cart.items;

// Total quantity across all line items (e.g. navbar/dashboard badge).
export const selectCartCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.quantity, 0)
);

// Sum of price * quantity for all items.
export const selectCartSubtotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Cart totals bundled together (subtotal, count, item list) for CartPage.
export const selectCartSummary = createSelector(
  [selectCartItems],
  (items) => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  })
);
