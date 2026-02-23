"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/lib/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, null);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center font-serif text-2xl font-bold text-ink">
          Admin Login
        </h1>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-600 disabled:opacity-50"
          >
            {pending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
