import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleReset = () => {
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("All fields are mandatory ");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match ");
      return;
    }

    const user = JSON.parse(localStorage.getItem("userData"));

    if (!user) {
      setError("No user found ");
      return;
    }

    // Update password
    user.password = newPassword;
    localStorage.setItem("userData", JSON.stringify(user));

    setSuccess("Password updated successfully ");

    // Redirect after 2 sec
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="h-screen w-screen bg-[#0d0d0d] flex">

      {/* LEFT */}
      <div className="w-1/2 flex items-center justify-center text-white">
        <div className="w-[320px] flex flex-col">

          <h1 className="text-xl font-semibold mb-6">Fitsigma</h1>

          <h2 className="text-2xl font-semibold mb-1">Reset Password</h2>
          <p className="text-gray-500 text-xs mb-5">
            Enter your new password below
          </p>

          {/* 🔴 ERROR MESSAGE */}
          {error && (
            <div className="bg-red-500 text-white text-sm p-2 rounded mb-3">
              {error}
            </div>
          )}

          {/* 🟢 SUCCESS MESSAGE */}
          {success && (
            <div className="bg-green-500 text-white text-sm p-2 rounded mb-3">
              {success}
            </div>
          )}

          {/* New Password */}
          <div className="relative mb-3">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full px-3 py-3 rounded bg-gray-200 text-black pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative mb-5">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-3 py-3 rounded bg-gray-200 text-black pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {confirmPassword && (
  <p
    className={`text-xs mt-1 ${
      newPassword === confirmPassword
        ? "text-green-500"
        : "text-red-500"
    }`}
  >
    {newPassword === confirmPassword
      ? "Passwords match "
      : "Passwords do not match "}
  </p>
)}

          {/* Button */}
          <button
            onClick={handleReset}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white"
          >
            Reset Password
          </button>

          {/* Back */}
          <p className="text-center text-xs text-gray-500 mt-4">
            Remember password?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

        </div>
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

    </div>
  );
};

export default ForgotPassword;