import { ApiRequest } from "@/app/_api/api"
import { ENDPOINTS } from "@/constants/ENDPOINTS"
import { MESSAGES } from "@/constants/CONSTANTS"
import type {
  LoginPayload,
  LoginResponse,
  SignupPayload,
  SignupResponse,
} from "@/types/authTypes"

export const login = async (data: LoginPayload) => {
  const response = await ApiRequest<LoginResponse, LoginPayload>(
    ENDPOINTS.AUTH.LOGIN,
    "POST",
    data,
    {
      showToasts: true,
      successToast: MESSAGES.AUTH.LOGIN_SUCCESS,
    }
  )

  return response
}

export const signup = async (data: SignupPayload) => {
  const response = await ApiRequest<SignupResponse, SignupPayload>(
    ENDPOINTS.AUTH.SIGNUP,
    "POST",
    data,
    {
      showToasts: true,
      successToast: MESSAGES.AUTH.SIGNUP_SUCCESS,
      errorToast: MESSAGES.AUTH.SIGNUP_FAILED,
    }
  )

  return response
}
