"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/app/context/AuthContext";
import { loginUser } from "@/lib/api";
import Link from "next/link";
import { LogIn, User, Lock } from "lucide-react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.tokens.access);
      localStorage.setItem("user_role", data.user.role);
      Cookies.set("token", data.tokens.access, { expires: 7 });
      setIsAuthenticated(true);
      if (data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "restaurant_owner") {
        router.push("/dashboard/restaurants");
      } else {
        router.push("/profile");
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ username, password });
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-2xl font-semibold text-orange-500 inline-block mb-6"
          >
            QuickFood
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900">Welcome back</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 mb-1.5"
              >
                <User className="size-4 text-zinc-400" />
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 mb-1.5"
              >
                <Lock className="size-4 text-zinc-400" />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              <LogIn className="size-4" />
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-orange-500 hover:text-orange-600"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
