import Navbar from "./components/Navbar.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { useChatStore } from "./store/useChatStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore.js";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { initSocket } = useChatStore();

  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser?.id || authUser?._id) {
      initSocket(authUser.id || authUser._id);
    }
  }, [authUser, initSocket]);

  if (isCheckingAuth && !authUser) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div>
        <Toaster position="top-right" />
      </>
    );
  }

  console.log("Auth User in App.jsx:", authUser);
  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={authUser ? <Settings /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
