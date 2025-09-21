"use client";

import {
  Bike,
  Car,
  Mail,
  Lock,
  Eye,
  Upload,
  Phone,
  MapPin,
  FileText,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// File: app/(auth)/register/repartidor/page.tsx
// UI en 2 columnas (responsive), sin panel derecho.

export default function RepartidorRegister() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900">
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
            <h1 className="text-2xl font-extrabold tracking-tight">Crear Cuenta de Repartidor</h1>
            <p className="mt-1 text-sm text-neutral-600">Configura el perfil para comenzar a entregar pedidos</p>
          </div>

          {/* FORM GRID */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Nombre */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-800">Nombre Completo</label>
              <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 ring-offset-2 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200">
                <FileText className="h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Ingresa tu nombre y apellidos"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  aria-label="Nombre completo"
                />
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-800">Correo Electrónico</label>
              <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 ring-offset-2 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200">
                <Mail className="h-4 w-4 text-neutral-500" />
                <input
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  aria-label="Correo electrónico"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-800">Contraseña</label>
              <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 ring-offset-2 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200">
                <Lock className="h-4 w-4 text-neutral-500" />
                <input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  aria-label="Contraseña"
                />
                <Eye className="h-4 w-4 text-neutral-500" />
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-800">Confirmar contraseña</label>
              <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 ring-offset-2 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200">
                <Lock className="h-4 w-4 text-neutral-500" />
                <input
                  type="password"
                  placeholder="Confirma tu contraseña"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  aria-label="Confirmar contraseña"
                />
                <Eye className="h-4 w-4 text-neutral-500" />
              </div>
            </div>

            {/* Cédula */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-800">Cédula</label>
              <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 ring-offset-2 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200">
                <FileText className="h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Ingresa tu número de cédula"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  aria-label="Cédula"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-800">Teléfono</label>
              <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 ring-offset-2 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200">
                <Phone className="h-4 w-4 text-neutral-500" />
                <input
                  type="tel"
                  placeholder="Ingresa tu número de teléfono"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  aria-label="Teléfono"
                />
              </div>
            </div>

            {/* Tipo de vehículo (full width) */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-neutral-800">Tipo de vehículo</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  <Bike className="h-4 w-4" /> Bicicleta
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  <Car className="h-4 w-4" /> Moto
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  <Car className="h-4 w-4" /> Auto
                </button>
              </div>
            </div>

            {/* Placa */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-800">Placa del vehículo</label>
              <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 ring-offset-2 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200">
                <Car className="h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Ingresa la placa de tu vehículo"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  aria-label="Placa del vehículo"
                />
              </div>
            </div>

            {/* Info vehículo */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-800">Información del vehículo</label>
              <input
                type="text"
                placeholder="Ej. Yamaha Crypton 125 2022"
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-neutral-400"
                aria-label="Información del vehículo"
              />
            </div>

            {/* Zona de reparto */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-neutral-800">Zona de reparto</label>
              <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 ring-offset-2 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200">
                <MapPin className="h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Distrito o cantón donde entregarás"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  aria-label="Zona de reparto"
                />
              </div>
            </div>

            {/* Documentos: licencia y vehículo */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-neutral-800">Foto de licencia</label>
              <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-4 text-center text-sm text-neutral-600">
                <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-neutral-100">
                  <Upload className="h-5 w-5 text-neutral-500" />
                </div>
                Haz clic para subir o arrastra y suelta
              </div>
            </div>
            <div>
            </div>

            {/* Aceptación */}
            <div className="md:col-span-2">
              <label className="mt-2 flex items-start gap-3 text-sm text-neutral-700">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-neutral-300" />
                Confirmo que cuento con licencia vigente y documentos del vehículo al día.
              </label>
            </div>

            {/* CTA */}
            <div className="md:col-span-2">
              <button
                type="button"
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
              >
                Crear Cuenta de Repartidor
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
