export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
  },
  PRODUCTS: {
    BASE: "/api/products",
    BY_ID: (id: string) => `/api/products/${id}`,
  },
  CART: {
    BASE: "/api/cart",
  },
  CHECKOUT: {
    BASE: "/api/checkout",
  },
} as const;
