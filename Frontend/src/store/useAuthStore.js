import { create } from "zustand"
import axiosInstance from "../lib/axios.js"
import toast from "react-hot-toast"

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
    },
    signup: async (formData) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", formData);
            set({ authUser: res.data.user });
            toast.success("Account created successfully!");
        }
        catch (error) {
            console.error("Signup error:", error);
            const errorMessage = error.response?.data?.message || "An error occurred during signup.";
            toast.error(errorMessage);
        }
        finally {
            set({ isSigningUp: false });
        }
    },
}))
