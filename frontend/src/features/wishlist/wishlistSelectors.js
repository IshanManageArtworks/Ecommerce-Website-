import { createSelector } from "@reduxjs/toolkit";

const selectWishlistItems = (state) => state.wishlist.items;

export const selectWishlistCount = createSelector(
  [selectWishlistItems],
  (items) => items.length
);

// Set of wishlisted product ids, for quick "is this product wishlisted?" checks
// (e.g. ProductCard heart icon) without re-scanning the array on every render.
export const selectWishlistIds = createSelector(
  [selectWishlistItems],
  (items) => new Set(items.map((item) => item.id))
);
