import { api } from "./api";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ limit = 10, skip = 0 }) =>
        `/products?limit=${limit}&skip=${skip}`,
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ id }) => ({ type: "Products", id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
      keepUnusedDataFor: 60,
      // Revalidate if it's been a while since this exact {limit, skip} was
      // last fetched, instead of always trusting whatever's in cache.
      refetchOnMountOrArgChange: 30,
    }),

    searchProducts: builder.query({
      query: (searchTerm) =>
        `/products/search?q=${searchTerm}`,
      providesTags: ["Products"],
    }),

    getCategories: builder.query({
      query: () => "/categories",
      transformResponse: (response) => response.sort(),
    }),

    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    getProductsByCategory: builder.query({
      query: (category) =>
        `/products/category/${category}`,
      providesTags: ["Products"],
    }),

    addToCart: builder.mutation({
      query: (cart) => ({
        url: "/carts",
        method: "POST",
        body: cart,
      }),
      // Only invalidate this user's cart query, not every user's cart.
      invalidatesTags: (result, error, cart) => [
        { type: "Cart", id: cart?.userId ?? "LIST" },
      ],
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [
        { type: "Products", id },
      ],
    }),

    // Additional endpoints for complete assignment mapping
    getUsers: builder.query({
      query: () => "/users",
      transformResponse: (response) => response.products ?? response,
      providesTags: ["User"],
    }),

    getCarts: builder.query({
      query: () => "/carts",
      providesTags: ["Cart"],
    }),

    getUserCart: builder.query({
      query: (userId) => `/carts/user/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "Cart", id: userId },
      ],
    }),

    updateCart: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/carts/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { userId, id }) => [
        { type: "Cart", id: userId ?? id },
      ],
    }),

    deleteCart: builder.mutation({
      query: (id) => ({
        url: `/carts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [
        { type: "Cart", id: result?.userId ?? "LIST" },
      ],
    }),

    getPosts: builder.query({
      query: () => "/posts",
    }),

    getComments: builder.query({
      query: () => "/comments",
    }),

    getTodos: builder.query({
      query: () => "/todos",
    }),

    // Dashboard stats: orders/revenue and review counts. server.js's generic
    // CRUD already serves these collections (no backend change needed beyond
    // a no-limit pagination bugfix). The generic handler wraps every
    // collection's items under a `products` key regardless of resource name,
    // so unwrap that into a plain array here.
    getOrders: builder.query({
      query: () => "/orders",
      transformResponse: (response) => response.products ?? response,
      providesTags: ["Orders"],
    }),

    getReviews: builder.query({
      query: () => "/reviews",
      transformResponse: (response) => response.products ?? response,
      providesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useSearchProductsQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useGetProductByIdQuery,
  useGetUserByIdQuery,
  useAddToCartMutation,
  useGetUsersQuery,
  useGetCartsQuery,
  useGetUserCartQuery,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useGetPostsQuery,
  useGetCommentsQuery,
  useGetTodosQuery,
  useGetOrdersQuery,
  useGetReviewsQuery,
} = productsApi;