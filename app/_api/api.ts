import axios, { Method } from "axios"
import type { ApiOptions, ApiRequestInput, ToastType } from "@/types"

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  headers: {
    "Content-Type": "application/json",
  },
})

function readAuthToken() {
  if (typeof window === "undefined") {
    return undefined
  }

  const token = localStorage.getItem("authToken")
  return token || undefined
}

async function triggerToast(type: ToastType, message?: string) {
  if (!message || typeof window === "undefined") {
    return
  }

  const { toast } = await import("sonner")
  toast[type](message)
}

function getErrorMessage(error: unknown, fallback?: string) {
  if (axios.isAxiosError(error)) {
    const serverMessage =
      (error.response?.data as { message?: string; error?: string } | undefined)
        ?.message ??
      (error.response?.data as { message?: string; error?: string } | undefined)
        ?.error

    return fallback ?? serverMessage ?? error.message ?? "Request failed"
  }

  if (error instanceof Error) {
    return fallback ?? error.message
  }

  return fallback ?? "Request failed"
}

export async function ApiRequest<TResponse = unknown, TData = unknown>(
  path: string,
  method: Method = "GET",
  data?: TData,
  options: ApiOptions = {}
): Promise<TResponse> {
  const {
    params,
    headers,
    withAuth = false,
    token,
    timeout = 30000,
    showToasts = false,
    successToast,
    errorToast,
  } = options

  const authToken = token ?? (withAuth ? readAuthToken() : undefined)

  try {
    const response = await client.request<TResponse>({
      url: path,
      method,
      data,
      params,
      timeout,
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
    })

    if (showToasts && successToast) {
      await triggerToast("success", successToast)
    }

    return response.data
  } catch (error) {
    const message = getErrorMessage(error, errorToast)

    if (showToasts) {
      await triggerToast("error", message)
    }

    throw new Error(message)
  }
}

export async function apiRequest<TResponse = unknown, TData = unknown>(
  options: ApiRequestInput<TData>
) {
  return ApiRequest<TResponse, TData>(
    options.path,
    options.method ?? "GET",
    options.data,
    options
  )
}

export const api = {
  request: apiRequest,

  get<TResponse = unknown>(path: string, options: ApiOptions = {}) {
    return ApiRequest<TResponse>(path, "GET", undefined, options)
  },

  post<TResponse = unknown, TData = unknown>(
    path: string,
    data?: TData,
    options: ApiOptions = {}
  ) {
    return ApiRequest<TResponse, TData>(path, "POST", data, options)
  },

  put<TResponse = unknown, TData = unknown>(
    path: string,
    data?: TData,
    options: ApiOptions = {}
  ) {
    return ApiRequest<TResponse, TData>(path, "PUT", data, options)
  },

  patch<TResponse = unknown, TData = unknown>(
    path: string,
    data?: TData,
    options: ApiOptions = {}
  ) {
    return ApiRequest<TResponse, TData>(path, "PATCH", data, options)
  },

  delete<TResponse = unknown, TData = unknown>(
    path: string,
    data?: TData,
    options: ApiOptions = {}
  ) {
    return ApiRequest<TResponse, TData>(path, "DELETE", data, options)
  },
}

export default api
