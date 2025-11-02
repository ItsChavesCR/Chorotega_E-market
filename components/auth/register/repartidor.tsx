"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bike,
  Car,
  Mail,
  Lock,
  Eye,
  Phone,
  MapPin,
  FileText,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function RepartidorRegister() {
  const router = useRouter();

  // Estados de los campos
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [infoVehiculo, setInfoVehiculo] = useState("");
  const [placa, setPlaca] = useState("");
  const [zona, setZona] = useState("");
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
      console.log("🚀 Registrando repartidor con metadata:", {
        nombre,
        cedula,
        telefono,
        tipo_vehiculo: vehiculo,
        info_vehiculo: infoVehiculo,
        placa,
        zona_reparto: zona,
        rol: "courier",
      });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login`,
          data: {
            nombre,
            cedula,
            telefono,
            tipo_vehiculo: vehiculo,
            info_vehiculo: infoVehiculo,
            placa,
            zona_reparto: zona,
            rol: "courier", // 👈 muy importante
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
    } catch (err: any) {
      console.error("❌ Error inesperado:", err);
      setErrorMsg("Error inesperado al registrarte. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-neutral-900">
      <div className="mb-3 flex items-center">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </Link>
        </div>
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
              Crear cuenta de repartidor
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Configura tu perfil para comenzar a entregar pedidos
            </p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Nombre */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Nombre completo
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2">
                  <FileText className="h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Ingresa tu nombre y apellidos"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Correo */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Correo electrónico
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2">
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
                <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2">
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
                    className={`h-4 w-4 cursor-pointer ${
                      showPassword ? "text-neutral-800" : "text-neutral-500"
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
                <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2">
                  <Lock className="h-4 w-4 text-neutral-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Cédula */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Cédula
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2">
                  <FileText className="h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Número de cédula"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Teléfono
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2">
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

              {/* Tipo de vehículo */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Tipo de vehículo
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {["Bicicleta", "Moto", "Auto"].map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setVehiculo(tipo)}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${
                        vehiculo === tipo
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {tipo === "Bicicleta" ? (
                        <Bike className="h-4 w-4" />
                      ) : (
                        <Car className="h-4 w-4" />
                      )}
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Placa */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Placa del vehículo
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2">
                  <Car className="h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Placa del vehículo"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                  />
                </div>
              </div>

              {/* Info vehículo */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Información del vehículo
                </label>
                <input
                  type="text"
                  placeholder="Ej. Yamaha Crypton 125 2022"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-neutral-400"
                  value={infoVehiculo}
                  onChange={(e) => setInfoVehiculo(e.target.value)}
                />
              </div>

              {/* Zona de reparto */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-neutral-800">
                  Zona de reparto
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2">
                  <MapPin className="h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Distrito o cantón donde entregarás"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    value={zona}
                    onChange={(e) => setZona(e.target.value)}
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
                  {loading ? "Creando cuenta..." : "Crear cuenta de repartidor"}
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
