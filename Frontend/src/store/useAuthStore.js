import { create } from "zustand"
import axiosInstance from "../lib/axios"

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            set({ authUser: res.data.user, isCheckingAuth: false });
        } catch (error) {
            console.error("Error checking auth:", error);
            set({ authUser: null, isCheckingAuth: false });
        }
        finally {
            set({ isCheckingAuth: false });
        }
    }
    // setUser: (user) => set({ user }),
    // logout: () => set({ user: null }),
}))
