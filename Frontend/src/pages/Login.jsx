import { Eye, EyeOff, Loader, Lock, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    const { email, password } = formData;

    if (!email.trim()) {
      return toast.error("Email is required.");
    }

    if (!password.trim()) {
      return toast.error("Password is required.");
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return toast.error("Please enter a valid email address.");
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();
    if (success === true) {
      await login(formData);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="flex size-12 items-center justify-center rounded-xl border border-[#9D00FF]/30 bg-[#9D00FF]/15 shadow-[0_0_32px_rgba(157,0,255,0.25)] transition-colors group-hover:bg-[#9D00FF]/25">
                <MessageSquare className="size-6 text-[#D59AFF]" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome back</h1>
              <p className="text-slate-300">Sign in to continue to VibeChat</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-slate-100">
                  Email
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 z-10 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  className="input w-full border-slate-500/45 bg-[#22313f] pl-10 text-slate-50 placeholder:text-slate-300/70 focus:border-[#9D00FF] focus:outline-none"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-slate-100">
                  Password
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 z-10 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input w-full border-slate-500/45 bg-[#22313f] pl-10 pr-10 text-slate-50 placeholder:text-slate-300/70 focus:border-[#9D00FF] focus:outline-none"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-slate-400" />
                  ) : (
                    <Eye className="size-5 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn w-full border-[#8A00E0] bg-[#9D00FF] text-white shadow-[0_12px_32px_rgba(157,0,255,0.28)] hover:border-[#7800C2] hover:bg-[#8500D9]"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader className="size-5 animate-spin" /> Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-slate-300">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#D59AFF] underline-offset-4 hover:text-[#E8C9FF] hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title="Welcome back!"
        subtitle="Continue your conversations from where you left off."
      />
    </div>
  );
};

export default Login;
