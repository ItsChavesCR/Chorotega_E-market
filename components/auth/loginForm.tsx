"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { ensureUserRow, getUserRole } from "@/lib/auth-helper";

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

  console.log("🟢 Login response:", data, error);
const session = await supabase.auth.getSession();
console.log("🟢 Session post-login:", session);
const userRes = await supabase.auth.getUser();
console.log("🟢 User post-login:", userRes);


  if (error) {
    setErrorMsg("⚠️ " + error.message);
    setLoading(false);
    return;
  }

// 🔐 Graba la cookie SSR inmediatamente
await fetch("/api/auth", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ event: "SIGNED_IN", session: data.session }),
});

// ...ensureUserRow(), getUserRole(), y luego router.push(...)


  // Asegura el registro del usuario
  await ensureUserRow();

  // Obtén el rol real del usuario
  const role = await getUserRole();

  console.log("✅ Rol detectado:", role);

  // Redirige según el rol
  switch (role) {
    case "client":
      router.push("/clientes");
      break;
    case "entrepreneur":
      router.push("/dashboard/emprendedor");
      break;
    case "repartidor":
      router.push("/dashboard/repartidor");
      break;
    case "admin":
      router.push("/dashboard/admin");
      break;
    default:
      router.push("/unauthorized");
      break;
  }

  setLoading(false);
};

  return (
    <main className="min-h-screen text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-2 md:py-24">
        <div className="grid gap-8 md:grid-cols-[1fr_minmax(0,_1px)_1fr]">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            <div className="mb-6 flex w-full gap-3">
              <button
                className="flex-1 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
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

            <div className="mb-6">
              <h1 className="text-2xl font-extrabold tracking-tight">
                Iniciar sesión con tu cuenta
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                Ingresa tu correo electrónico y contraseña para continuar
              </p>
            </div>

            <form onSubmit={handleLogin}>
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

          <div className="hidden md:block md:h-full md:w-px md:bg-neutral-200" />

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
