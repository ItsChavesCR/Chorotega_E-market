"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client"; // 👈 conexión al backend Supabase
import { ensureUserRow, routeByRole } from "@/lib/auth-helper";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

   if (error) {
      setErrorMsg(error.message);
      return;
    }

    await ensureUserRow(); // ✅ inserta si es primer login
    await routeByRole(router); // ✅ redirige al dashboard correcto
  };

  return (
    <main className="min-h-screen text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-2 md:py-24">
        <div className="grid gap-8 md:grid-cols-[1fr_minmax(0,_1px)_1fr]">
          {/* LEFT PANEL */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            {/* Top Tabs */}
            <div className="mb-6 flex w-full gap-3">
              <button
                className="flex-1 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
                type="button"
              >
                Iniciar sesión
              </button>
              <Link
                href="/auth/register"
                className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 text-center"
              >
                Registrarse
              </Link>
            </div>

            {/* Heading + helper */}
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold tracking-tight">
                Iniciar sesión con tu cuenta
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                Ingresa tu correo electrónico y contraseña para continuar
              </p>
            </div>

            <form onSubmit={handleLogin}>
              {/* Email */}
              <label className="mb-2 block text-sm font-semibold text-neutral-800">
                Correo Electrónico
              </label>
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 ring-offset-2 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200">
                <Mail className="h-4 w-4 text-neutral-500" />
                <input
                  type="email"
                  placeholder="maria@chorotega.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  aria-label="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <label className="mb-2 block text-sm font-semibold text-neutral-800">
                Contraseña
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 ring-offset-2 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200">
                <Lock className="h-4 w-4 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  aria-label="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Eye
                  className={`h-4 w-4 text-neutral-500 cursor-pointer transition ${
                    showPassword ? "text-neutral-800" : ""
                  }`}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>

              <div className="mt-2 text-right">
                <a
                  href="#"
                  className="text-sm font-medium text-neutral-700 underline-offset-2 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Mensaje de error */}
              {errorMsg && (
                <p className="mt-3 text-sm text-red-600 font-medium">
                  {errorMsg}
                </p>
              )}

              {/* Botón principal */}
              <button
                type="submit"
                disabled={loading}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-b from-neutral-900 to-neutral-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition active:translate-y-px disabled:opacity-70"
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </form>

            {/* Separator */}
            <div className="my-5 flex items-center gap-3 text-neutral-400">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-xs">o</span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            {/* Google CTA (por ahora desactivado) */}
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-800 shadow-sm opacity-50 cursor-not-allowed"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 48 48"
                aria-hidden="true"
                className="-ml-1"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.826 32.91 29.273 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.84 1.153 7.957 3.043l5.657-5.657C33.642 6.053 29.084 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c10.493 0 19-8.507 19-19 0-1.341-.138-2.651-.389-3.917z"
                />
              </svg>
              Google (próximamente)
            </button>
          </section>

          {/* Divider */}
          <div className="hidden md:block md:h-full md:w-px md:bg-neutral-200" />

          {/* RIGHT PANEL */}
          <aside className="flex flex-col items-center justify-center gap-6 md:pl-8">
            <h2 className="text-center text-3xl font-extrabold tracking-tight">
              Chorotega E-Market
            </h2>
            <div className="relative h-56 w-56 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <Image
                src="/Chorotega.svg"
                alt="Choroteg E-Market"
                width={250}
                height={100}
                priority
                style={{ height: "auto" }}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
