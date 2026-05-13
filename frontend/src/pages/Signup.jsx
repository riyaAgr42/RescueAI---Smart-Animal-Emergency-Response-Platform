import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Toast from "../components/Toast.jsx";

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto glass rounded-3xl p-8">
      {error && <Toast message={error} variant="error" />}
      <h2 className="text-2xl font-display mb-4">Join RescueAI</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone number"
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <select
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="volunteer">Volunteer</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn-primary w-full py-3">Create Account</button>
      </form>
      <p className="text-sm text-slate-500 mt-4">
        Already have an account? <Link to="/login" className="text-primary">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
