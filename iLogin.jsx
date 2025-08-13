import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [error, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3003/users/login", loginData);
      const token = response.data.data.token;
      localStorage.setItem("token", token);
      console.log("token in login page: ", token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-slate-600">
      <form className="bg-white shadow-lg rounded-xl p-8 w-full my-20 max-w-md" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold text-center mb-2 text-slate-600">Welcome Back!</h2>
        <p className="text-l font-bold mb-2 text-center text-slate-600">Sign In to Continue</p>
        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

        <div>
          <label className="text-sm font-medium mt-5">Email</label>
          <div className="flex items-center border rounded px-3 mt-1">
            <FaEnvelope className="text-gray-400" />
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              className="w-full px-2 py-2 outline-none"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              autoComplete="off"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mt-3 mb-3">Password</label>
          <div className="flex items-center border rounded px-3 mt-1">
            <FaLock className="text-gray-400 my-3" />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-2 py-2 outline-none"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <button type="submit" className="w-full py-2 my-4 bg-neutral-500 text-white hover:bg-neutral-400">
          Sign In
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? {" "}
          <Link to="/register" className="text-purple-600 hover:underline">Register here</Link>
        </p>
      </form>
    </div>
  );
}