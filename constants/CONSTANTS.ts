export const COLLECTIONS = {
  PRODUCTS: "products",
  USERS: "users",
  CART: "cart",
  ORDERS: "orders",
} as const;

export const ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN: "/admin",
  CART: "/cart",
} as const;

export const AUTH_KEYS = {
  TOKEN: "token",
  AUTH_TOKEN: "authToken",
};

export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Login successful",
    LOGIN_FAILED: "Login failed",
    INVALID_CREDENTIALS: "Invalid credentials",
    SIGNUP_SUCCESS: "Account created successfully",
    SIGNUP_FAILED: "Signup failed",
    REQUIRED: "Please login to continue",
  },
  CART: {
    ADD_SUCCESS: "Added to cart",
    ADD_FAILED: "Failed to add to cart",
    REMOVE_SUCCESS: "Item removed from cart",
    REMOVE_FAILED: "Failed to remove item",
    UPDATE_FAILED: "Failed to update quantity",
    AUTH_REQUIRED: "Please login to add items to cart",
  },
  PRODUCT: {
    FETCH_FAILED: "Failed to fetch products",
    CREATE_SUCCESS: "Product created",
    CREATE_FAILED: "Failed to create product",
    UPDATE_SUCCESS: "Product updated",
    UPDATE_FAILED: "Failed to update product",
    DELETE_SUCCESS: "Product deleted",
    DELETE_FAILED: "Failed to delete product",
    DELETE_CONFIRM: "Are you sure you want to delete this product?",
  },
  CHECKOUT: {
    SUCCESS: "Order placed successfully!",
    FAILED: "Checkout failed",
    EMPTY_CART: "Cart is empty",
    AUTH_REQUIRED: "Please login to place an order",
  },
} as const;
