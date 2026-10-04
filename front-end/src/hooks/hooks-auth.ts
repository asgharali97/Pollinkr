import { useMutation, useQuery } from "@tanstack/react-query";
import api, { type ApiEnvelope } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
  };
}

function logAuthFailure(action: string, error: unknown) {
  const apiError = error as {
    message?: string;
    response?: { status?: number; data?: { message?: string } };
  };

  console.warn(`[auth] ${action} failed`, {
    status: apiError.response?.status,
    message: apiError.response?.data?.message || apiError.message,
  });
}

interface RegisterResponse {
  user?: {
    id: string;
    name: string;
    email: string;
    isEmailVerified?: boolean;
  };
  email?: string;
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      try {
        const res = await api.post<ApiEnvelope<RegisterResponse>>("/auth/register", payload);
        console.info("[auth] registration request succeeded", { status: res.status });
        return res.data.data;
      } catch (error) {
        logAuthFailure("registration request", error);
        throw error;
      }
    },
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      try {
        const res = await api.post<ApiEnvelope<AuthResponse>>("/auth/login", payload);
        console.info("[auth] login request succeeded", { status: res.status });
        return res.data.data;
      } catch (error) {
        logAuthFailure("login request", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setAuth(data.user, "cookie-session");
    },
  });
};

export const useVerifyEmail = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: { token: string }) => {
      try {
        const res = await api.post<ApiEnvelope<AuthResponse>>("/auth/verify-email", payload);
        console.info("[auth] email verification request succeeded", {
          status: res.status,
          message: res.data.message,
        });
        return res.data;
      } catch (error) {
        logAuthFailure("email verification request", error);
        throw error;
      }
    },
    onSuccess: (response) => {
      if (response.data?.user) {
        setAuth(response.data.user, "cookie-session");
      }
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      try {
        const res = await api.post<ApiEnvelope<null>>("/auth/resend-verification", payload);
        console.info("[auth] resend verification request succeeded", {
          status: res.status,
          message: res.data.message,
        });
        return res.data;
      } catch (error) {
        logAuthFailure("resend verification request", error);
        throw error;
      }
    },
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      clearAuth();
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post<ApiEnvelope<AuthResponse>>("/auth/refresh");
      return res.data.data;
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<AuthResponse>>("/auth/me");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
