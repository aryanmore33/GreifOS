const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:3000";

interface ApiOptions {
  method?: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const config: RequestInit = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data as T;
}

// ── Auth API ──

export interface User {
  id: number;
  name: string;
  email: string | null;
  role: "owner" | "nominee";
  phone: string;
  is_verified: boolean;
  created_at?: string;
}

interface RegisterPayload {
  name: string;
  email?: string;
  password: string;
  phone: string;
  role: "owner" | "nominee";
}

interface RegisterResponse {
  message: string;
  user: User;
}

interface LoginPayload {
  phone: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

interface MeResponse {
  authenticated: boolean;
  user: User;
}

interface LogoutResponse {
  message: string;
}

export const registerUser = (payload: RegisterPayload) =>
  apiRequest<RegisterResponse>("/api/users/register", {
    method: "POST",
    body: payload as unknown as Record<string, unknown>,
  });

export const loginUser = (payload: LoginPayload) =>
  apiRequest<LoginResponse>("/api/users/login", {
    method: "POST",
    body: payload as unknown as Record<string, unknown>,
  });

export const getMe = () =>
  apiRequest<MeResponse>("/api/users/me");

export const logoutUser = () =>
  apiRequest<LogoutResponse>("/api/users/logout", { method: "POST" });
