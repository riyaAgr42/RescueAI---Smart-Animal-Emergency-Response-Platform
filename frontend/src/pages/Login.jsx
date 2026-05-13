import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Toast from "../components/Toast.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto glass rounded-3xl p-8">
      {error && <Toast message={error} variant="error" />}
      <h2 className="text-2xl font-display mb-4">Welcome back</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn-primary w-full py-3">Login</button>
      </form>
      <p className="text-sm text-slate-500 mt-4">
        No account? <Link to="/signup" className="text-primary">Create one</Link>
      </p>
    </div>
  );
};

export default Login;
