"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault(); setLoading(true); setError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) return setError(data.error || "Login failed.");
    router.push("/admin"); router.refresh();
  }
  return <main className="admin-login-shell">
    <section className="admin-login-brand"><div className="admin-login-mark"><Image src="/logo.jpeg" alt="UGI Corporation" width={132} height={76} priority/></div><p>CONTENT MANAGEMENT SYSTEM</p><h1>Shape every page.<br/>Keep every detail current.</h1><div className="admin-login-lines"/><small>Secure website administration</small></section>
    <section className="admin-login-panel"><form className="admin-login-card" onSubmit={submit}>
      <div className="admin-login-icon"><LockKeyhole/></div><p className="admin-kicker">UGI ADMIN PORTAL</p><h2>Welcome back</h2><p>Sign in to manage website content, projects, articles and media.</p>
      <label>Email address<div><Mail size={18}/><input type="email" required value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="admin@ugicorpgroup.com"/></div></label>
      <label>Password<div><LockKeyhole size={18}/><input type="password" required value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} placeholder="Enter your password"/></div></label>
      {error && <p className="admin-form-error">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in to dashboard"}<ArrowRight size={18}/></button>
      <span className="admin-login-help">Authorized UGI team members only</span>
    </form></section>
  </main>;
}
