import { RoleCard } from "@/components/auth/register/option";
import { Footer } from "@/components/sections/footer";
import { HeaderLittle } from "@/components/sections/headerLittle";
import { ArrowLeft, Bike, Store, UserRound } from "lucide-react";
import Link from "next/link";


export const metadata = { title: 'Sign up — Chorotega E-Market' };

export default function RegisterOptionPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <HeaderLittle/>
      <div className="mx-auto max-w-5xl px-4 py-40 sm:px-6 lg:px-8">
        {/* Back */}
        <div className="mb-10 flex items-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </Link>
        </div>

        {/* Heading */}
        <h1 className="mb-12 text-center text-3xl font-extrabold tracking-tight sm:text-4xl text-[#202022]">
          ¿Cómo quieres registrarte?
        </h1>

        {/* Options */}
        <div className="grid gap-6 md:grid-cols-3">
          <RoleCard
            icon={<UserRound className="h-12 w-12" />}
            title="Cliente"
            description="Compra productos y servicios en la plataforma"
            href="/auth/register/cliente"
            cta="Registrarme como cliente"
          />

          <RoleCard
            icon={<Store className="h-12 w-12" />}
            title="Emprendedor"
            description="Crea tu cuenta de negocio y vende en línea"
            href="/auth/register/emprendedor"
            cta="Registrarme como emprendedor"
          />

          <RoleCard
            icon={<Bike className="h-12 w-12" />}
            title="Repartidor"
            description="Entrega pedidos y gana dinero en tu zona"
            href="/auth/register/repartidor"
            cta="Registrarme como repartidor"
          />
        </div>
      </div>
      <Footer/>
    </main>
  );
}
