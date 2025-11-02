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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg("⚠️ " + error.message);
      return;
    }

    // ✅ Obtener datos del usuario autenticado
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    const role =
      user?.user_metadata?.rol ||
      user?.user_metadata?.role ||
      "emprendedor"; // fallback por compatibilidad

    // ✅ Redirigir según el rol
    switch (role.toLowerCase()) {
      case "cliente":
      case "client":
        router.push("/clientes");
        break;
      case "emprendedor":
      case "entrepreneur":
        router.push("/dashboard/emprendedor");
        break;
      case "admin":
      case "administrador":
        router.push("/dashboard/admin");
        break;
      default:
        router.push("/dashboard/emprendedor");
        break;
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

            {/* Heading */}
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
                Correo electrónico
              </label>
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-neutral-200">
                <Mail className="h-4 w-4 text-neutral-500" />
                <input
                  type="email"
                  placeholder="maria@chorotega.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <label className="mb-2 block text-sm font-semibold text-neutral-800">
                Contraseña
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-neutral-200">
                <Lock className="h-4 w-4 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Eye
                  className={`h-4 w-4 text-neutral-500 cursor-pointer ${
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

              {errorMsg && (
                <p className="mt-3 text-sm text-red-600 font-medium">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-70"
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </form>
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
                alt="Chorotega E-Market"
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
