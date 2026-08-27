import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Loader2, Lock, Mail, Cake } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin_/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setError(error?.message || "Invalid login details.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      await supabase.auth.signOut();

      setError("You do not have permission to access the dashboard.");
      setLoading(false);
      return;
    }

    navigate({
      to: "/admin",
    });
  }

  return (
    <div className="min-h-screen bg-[#FBF7F3] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F4E4E0] text-[#8B5E5A]">
            <Cake size={25} />
          </div>

          <h1 className="font-serif text-3xl text-[#3D302C]">
            N.Y Nova Cake Studio
          </h1>

          <p className="mt-2 text-sm text-[#8C7B75]">
            Studio Administration
          </p>
        </div>

        <div className="rounded-3xl border border-[#E9DDD7] bg-white p-8 shadow-[0_15px_50px_rgba(90,60,50,0.07)]">
          <h2 className="font-serif text-2xl text-[#3D302C]">
            Welcome back
          </h2>

          <p className="mt-1 text-sm text-[#95847E]">
            Sign in to manage your cake studio.
          </p>

          <form
            onSubmit={handleLogin}
            className="mt-7 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-[#51423D]">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AA9992]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#E5D9D3] bg-[#FFFCFA] py-3.5 pl-11 pr-4 outline-none transition focus:border-[#B98980] focus:ring-2 focus:ring-[#EEDFD9]"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#51423D]">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AA9992]"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#E5D9D3] bg-[#FFFCFA] py-3.5 pl-11 pr-4 outline-none transition focus:border-[#B98980] focus:ring-2 focus:ring-[#EEDFD9]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A3934] py-3.5 font-medium text-white transition hover:bg-[#352823] disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}