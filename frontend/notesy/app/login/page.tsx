"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const login = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/auth/login", { email, password });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("role", res.data.user.role);

      router.push("/dashboard");
    } catch (error: any) {
      console.log("LOGIN ERROR => ", error.response?.data || error.message);
      setErrorMsg(error.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-xl shadow-2xl p-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Please enter your details to sign in
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium leading-none">Password</label>
                <button className="text-xs text-primary hover:opacity-80 transition-opacity">
                    {/* Forgot password? */}
                </button>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:opacity-90 h-11 px-4 py-2 w-full shadow-lg shadow-primary/20 active:scale-[0.98] transform"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
          {errorMsg && (
            <p className="text-red-500 text-sm text-center">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 text-center text-sm text-muted-foreground border-t border-border/50">
          Don&apos;t have an account?{" "}
          <Link 
            href="/register" 
            className="text-primary font-semibold hover:underline underline-offset-4"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}