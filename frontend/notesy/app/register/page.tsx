"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../lib/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const register = async () => {
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Account created successfully!");
      router.push("/login");
    } catch (error: any) {
      console.error("REGISTRATION ERROR => ", error.response?.data || error.message);
      alert(error.response?.data?.msg || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-sans p-4">
      <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-xl shadow-2xl p-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create an Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join <span className="text-primary font-semibold">NOTESY</span> today to start taking notes
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={register}
            disabled={loading || !email || !password || !name}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:opacity-90 h-11 px-4 py-2 w-full shadow-lg shadow-primary/20 active:scale-[0.98] transform mt-4"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>

        {/* Footer */}
        <div className="pt-4 text-center text-sm text-muted-foreground border-t border-border/50">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline underline-offset-4">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}