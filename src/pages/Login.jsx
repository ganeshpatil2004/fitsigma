import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
const handleLogin = () => {
  if (email === "admin@gmail.com" && password === "1234") {
    localStorage.setItem("user", "loggedIn");
    navigate("/dashboard");
  } else {
    alert("Invalid email or password");
  }
};
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0d0d0d] flex">
      
      {/* LEFT */}
      <div className="w-1/2 flex items-center justify-center text-white">
        <div className="w-[300px] flex flex-col">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" fill="#4A6FA5"/>
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z" fill="#4A6FA5"/>
            </svg>
            <span className="text-white font-medium text-sm tracking-wide">Fitsigma</span>
          </div>

          {/* Title */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-white">Login</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Login to access your travelwise account
            </p>
          </div>

          {/* Email */}
          <div className="relative mb-3">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="peer w-full pt-5 pb-1.5 px-3 rounded-lg bg-[#e8e8e8] text-black text-sm outline-none h-12"
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-1.5 text-[10px] text-gray-500 transition-all
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-gray-500"
            >
              Email
            </label>
          </div>
          {/* Password */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="peer w-full pt-5 pb-1.5 px-3 rounded-lg bg-[#e8e8e8] text-black text-sm outline-none h-12 pr-10"
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-1.5 text-[10px] text-gray-500 transition-all
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-gray-500"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {/* Login Button */}
        <button
  onClick={handleLogin}
  className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg text-sm text-white font-medium transition-colors"
>
  Login
</button>
          {/* Remember / Forgot */}
          <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="w-3 h-3" />
              Remember me
            </label>
           <Link
  to="/forgot-password"
  className="text-red-400 cursor-pointer hover:text-red-300"
>
  Forgot Password
</Link>
          </div>

          {/* Signup */}
         <p className="text-center text-xs text-gray-400 mt-3">
  Don't have an account?{" "}
  <Link
    to="/signup"
    className="text-blue-400 hover:underline"
  >Sign up</Link>
</p>
          {/* Social Login */}
          <div className="mt-4">
            <p className="text-center text-gray-600 text-xs mb-2.5">Or login with</p>
            <div className="flex gap-2">
              {/* Facebook */}
              <button className="flex-1 border border-blue-700 py-2 rounded-lg flex items-center justify-center hover:bg-blue-900/20 transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              </button>
              {/* Google */}
              <button className="flex-1 border border-gray-600 py-2 rounded-lg flex items-center justify-center hover:bg-gray-800/40 transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              {/* Apple */}
              <button className="flex-1 border border-gray-600 py-2 rounded-lg flex items-center justify-center hover:bg-gray-800/40 transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-1/2 h-full relative overflow-hidden">
        <img
          src="/gym.jpg"
          alt="gym"
          className="h-full w-full object-cover object-center"
          style={{ filter: "brightness(0.75)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, #0d0d0d 0%, transparent 35%)",
          }}
        />
      </div>
    </div>
  );
};

export default Login;