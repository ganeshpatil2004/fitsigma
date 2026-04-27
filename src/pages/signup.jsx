import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are mandatory ");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match ");
      return;
    }

    if (!agree) {
      setError("Please accept Terms & Privacy Policy ");
      return;
    }

    localStorage.setItem("userData", JSON.stringify(form));

    setSuccess("Signup successful  Redirecting...");

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="h-screen w-screen bg-[#0d0d0d] flex">

      {/* LEFT */}
<div className="w-1/2 flex items-center justify-center text-white">   <form onSubmit={handleSignup} className="w-[320px] flex flex-col">

          <h1 className="text-xl font-semibold mb-6">Fitsigma</h1>

          <h2 className="text-2xl font-semibold mb-1">Create Account</h2>
          <p className="text-gray-500 text-xs mb-4">
            Signup to start your fitness journey
          </p>

          {/* 🔴 ERROR */}
          {error && (
            <div className="bg-red-500 text-white text-sm p-2 rounded mb-3">
              {error}
            </div>
          )}

          {/* 🟢 SUCCESS */}
          {success && (
            <div className="bg-green-500 text-white text-sm p-2 rounded mb-3">
              {success}
            </div>
          )}

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="mb-3 px-3 py-3 rounded bg-gray-200 text-black"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="mb-3 px-3 py-3 rounded bg-gray-200 text-black"
          />

          {/* Password */}
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-3 rounded bg-gray-200 text-black pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="mb-1 px-3 py-3 rounded bg-gray-200 text-black"
          />

          {/* ✅ PASSWORD MATCH INDICATOR */}
          {form.confirmPassword && (
            <p
              className={`text-xs mb-2 ${
                form.password === form.confirmPassword
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {form.password === form.confirmPassword
                ? "Passwords match "
                : "Passwords do not match "}
            </p>
          )}

          {/* Terms */}
          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mt-1 accent-blue-600"
            />
            <p className="text-xs text-gray-400">
              I agree to{" "}
              <span
                onClick={() => setShowTerms(true)}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Terms
              </span>{" "}
              &{" "}
              <span
                onClick={() => setShowPrivacy(true)}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Privacy Policy
              </span>
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700"
          >
            Sign Up
          </button>

          {/* Login */}
          <p className="text-xs text-center mt-4 text-gray-400">
            Already have an account?{" "}
            <Link to="/" className="text-blue-400">
              Login
            </Link>
          </p>

        </form>
      </div>

      {/* RIGHT */}
      <div className="w-1/2 relative">
        <img
          src="/gym.jpg"
          alt="gym"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.7)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] to-transparent"></div>
      </div>

      {/* TERMS MODAL */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-3">Terms & Conditions</h2>
            <p className="text-sm mb-4">
              You agree to follow all gym rules and policies.
            </p>
            <button
              onClick={() => setShowTerms(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* PRIVACY MODAL */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-3">Privacy Policy</h2>
            <p className="text-sm mb-4">
              Your data is secure and private.
            </p>
            <button
              onClick={() => setShowPrivacy(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Signup;