import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword]     = useState(false);
  const [agree, setAgree]                   = useState(false);
  const [showTerms, setShowTerms]           = useState(false);
  const [showPrivacy, setShowPrivacy]       = useState(false);
  const [error, setError]                   = useState("");
  const [success, setSuccess]               = useState("");

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are mandatory.");
      return;
    }

    if (form.password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please accept Terms & Privacy Policy.");
      return;
    }

    // Check if email already registered
    const existing = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const alreadyExists = existing.find(u => u.email === form.email);
    if (alreadyExists) {
      setError("This email is already registered. Please login.");
      return;
    }

    // Save new user to registered users list
    const newUser = {
      name:     form.name,
      email:    form.email,
      password: form.password,
    };
    existing.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(existing));

    setSuccess("Account created successfully! Redirecting to login...");
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="h-screen w-screen bg-[#0d0d0d] flex">

      {/* LEFT */}
      <div className="w-1/2 flex items-center justify-center text-white">
        <form onSubmit={handleSignup} className="w-[420px] flex flex-col">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" fill="#4A6FA5"/>
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z" fill="#4A6FA5"/>
            </svg>
            <span className="text-white font-medium text-base tracking-wide">Fitsigma</span>
          </div>

          <h2 className="text-3xl font-semibold mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm mb-5">
            Sign up to start your fitness journey
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 text-sm px-4 py-2.5 rounded-lg mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 text-sm px-4 py-2.5 rounded-lg mb-4">
              ✅ {success}
            </div>
          )}

          {/* Full Name */}
          <div className="relative mb-3">
            <input
              type="text"
              name="name"
              placeholder=" "
              value={form.name}
              onChange={handleChange}
              className="peer w-full pt-6 pb-2 px-4 rounded-lg bg-[#e8e8e8] text-black text-base outline-none h-14"
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-500">
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative mb-3">
            <input
              type="email"
              name="email"
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              className="peer w-full pt-6 pb-2 px-4 rounded-lg bg-[#e8e8e8] text-black text-base outline-none h-14"
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-500">
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder=" "
              value={form.password}
              onChange={handleChange}
              className="peer w-full pt-6 pb-2 px-4 rounded-lg bg-[#e8e8e8] text-black text-base outline-none h-14 pr-12"
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-500">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative mb-2">
            <input
              type="password"
              name="confirmPassword"
              placeholder=" "
              value={form.confirmPassword}
              onChange={handleChange}
              className="peer w-full pt-6 pb-2 px-4 rounded-lg bg-[#e8e8e8] text-black text-base outline-none h-14"
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-500">
              Confirm Password
            </label>
          </div>

          {/* Password match indicator */}
          {form.confirmPassword && (
            <p className={`text-xs mb-3 px-1 ${
              form.password === form.confirmPassword ? "text-green-400" : "text-red-400"
            }`}>
              {form.password === form.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
            </p>
          )}

          {/* Terms */}
          <div className="flex items-start gap-2 mb-5">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mt-1 w-4 h-4 accent-blue-600"
            />
            <p className="text-sm text-gray-400">
              I agree to{" "}
              <span onClick={() => setShowTerms(true)} className="text-blue-400 cursor-pointer hover:underline">
                Terms
              </span>{" "}
              &{" "}
              <span onClick={() => setShowPrivacy(true)} className="text-blue-400 cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-3.5 rounded-lg text-base text-white font-medium transition-colors"
          >
            Sign Up
          </button>

          {/* Login Link */}
          <p className="text-sm text-center mt-4 text-gray-400">
            Already have an account?{" "}
            <Link to="/" className="text-blue-400 hover:underline">Login</Link>
          </p>

        </form>
      </div>

      {/* RIGHT */}
      <div className="w-1/2 h-full relative overflow-hidden">
        <img
          src="/gym.jpg"
          alt="gym"
          className="h-full w-full object-cover object-center"
          style={{ filter: "brightness(0.75)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0d0d0d 0%, transparent 35%)" }} />
      </div>

      {/* TERMS MODAL */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white text-black p-7 rounded-2xl w-[420px] shadow-2xl">
            <h2 className="text-lg font-bold mb-3">Terms & Conditions</h2>
            <p className="text-sm text-gray-600 mb-2">By using GymDesk you agree to:</p>
            <ul className="text-sm text-gray-600 list-disc pl-5 mb-5 space-y-1">
              <li>Follow all gym rules and policies</li>
              <li>Keep your login credentials secure</li>
              <li>Not share your account with others</li>
              <li>Use the system only for gym management purposes</li>
            </ul>
            <button onClick={() => setShowTerms(false)} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
      )}

      {/* PRIVACY MODAL */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white text-black p-7 rounded-2xl w-[420px] shadow-2xl">
            <h2 className="text-lg font-bold mb-3">Privacy Policy</h2>
            <p className="text-sm text-gray-600 mb-2">We are committed to protecting your data:</p>
            <ul className="text-sm text-gray-600 list-disc pl-5 mb-5 space-y-1">
              <li>Your data is stored securely</li>
              <li>We do not share your data with third parties</li>
              <li>You can request data deletion at any time</li>
              <li>All transactions are encrypted</li>
            </ul>
            <button onClick={() => setShowPrivacy(false)} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Signup;