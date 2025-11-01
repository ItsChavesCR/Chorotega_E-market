"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  Mail,
  Lock,
  Eye,
  Phone,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function EmprendedorRegister() {
  const router = useRouter();

  const [negocio, setNegocio] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmar) {
      setErrorMsg("⚠️ Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      // Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre_negocio: negocio,
            telefono,
            rol: "entrepreneur", // 👈 debe coincidir con tu tabla roles
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setErrorMsg("El correo ya está registrado. Intenta iniciar sesión.");
        } else {
          setErrorMsg(error.message);
        }
      } else {
        setSuccessMsg("✅ Cuenta creada. Revisa tu correo para confirmar.");
        setTimeout(() => router.push("/auth/login"), 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error inesperado al registrarte. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-neutral-900">
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
          {/* Tabs */}
          <div className="mb-6 flex w-full gap-3">
            <Link
              href="/auth/login"
              className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-center text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              Iniciar sesión
            </Link>
            <button
              className="flex-1 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
              type="button"
            >
              Registrarse
            </button>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Crear Cuenta de Negocio
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Ingresa la información básica para comenzar
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleRegister}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Nombre del negocio */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Nombre del Negocio
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-neutral-200">
                  <Store className="h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Ingresa el nombre de tu negocio"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    value={negocio}
                    onChange={(e) => setNegocio(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Correo */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Correo Electrónico
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-neutral-200">
                  <Mail className="h-4 w-4 text-neutral-500" />
                  <input
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Contraseña
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-neutral-200">
                  <Lock className="h-4 w-4 text-neutral-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
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
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Confirmar contraseña
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-neutral-200">
                  <Lock className="h-4 w-4 text-neutral-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    required
                  />
                  <Eye
                    className={`h-4 w-4 text-neutral-500 cursor-pointer ${
                      showPassword ? "text-neutral-800" : ""
                    }`}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Teléfono
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-neutral-200">
                  <Phone className="h-4 w-4 text-neutral-500" />
                  <input
                    type="tel"
                    placeholder="Número de teléfono"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Mensajes */}
              {errorMsg && (
                <p className="md:col-span-2 text-sm text-red-600 mt-2">
                  {errorMsg}
                </p>
              )}
              {successMsg && (
                <p className="md:col-span-2 text-sm text-green-600 mt-2">
                  {successMsg}
                </p>
              )}

              {/* CTA */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-70"
                >
                  {loading ? "Creando cuenta..." : "Crear Cuenta de Negocio"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
