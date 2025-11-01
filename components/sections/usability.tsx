import React from "react";
import {
  BarChart3,
  ShoppingBag,
  ShieldCheck,
  BadgeDollarSign,
  Truck,
  Users,
  BadgeCent,
} from "lucide-react";

export const Usability = () => {
  return (
    <section className="w-full bg-[#F5F0E5] py-16 px-6">
      {/* Título */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202022]">
          ¿Por qué usarlo?
        </h2>
      </div>

      {/* 3 columnas */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* ===== Emprendedores ===== */}
        <div>
          <h3 className="text-xl font-bold text-green-700 mb-4 text-center">
            Para emprendedores
          </h3>

          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4">
            <div className="h-12 w-16 rounded-lg bg-[#DDF5E3] grid place-items-center">
              <BarChart3 className="h-6 w-6 text-[#111827]" />
            </div>
            <div>
              <p className="font-semibold text-[#111827] leading-tight">
                Mayor visibilidad
              </p>
              <p className="text-gray-600 text-sm">
                Alcanza más clientes en tu comunidad local con una plataforma
                dedicada.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4">
            <div className="h-12 w-16 rounded-lg bg-[#DDF5E3] grid place-items-center">
              <BadgeCent className="h-6 w-6 text-[#111827]" />
            </div>
            <div>
              <p className="font-semibold text-[#111827] leading-tight">
                Ventas fáciles
              </p>
              <p className="text-gray-600 text-sm">
                Sistema completo de ventas con chat, pagos y seguimiento de
                órdenes.
              </p>
            </div>
          </div>
        </div>

        {/* ===== Clientes ===== */}
        <div>
          <h3 className="text-xl font-bold text-[#C19A4B] mb-4 text-center">
            Para clientes
          </h3>

          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4">
            <div className="h-12 w-16 rounded-lg bg-[#DDF5E3] grid place-items-center">
              <ShoppingBag className="h-6 w-6 text-[#111827]" />
            </div>
            <div>
              <p className="font-semibold text-[#111827] leading-tight">
                Compras locales
              </p>
              <p className="text-gray-600 text-sm">
                Encuentra productos únicos y auténticos de tu propia comunidad.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4">
            <div className="h-12 w-16 rounded-lg bg-[#DDF5E3] grid place-items-center">
              <ShieldCheck className="h-6 w-6 text-[#111827]" />
            </div>
            <div>
              <p className="font-semibold text-[#111827] leading-tight">
                Entrega segura
              </p>
              <p className="text-gray-600 text-sm">
                Recibe tus productos en casa con seguimiento en tiempo real.
              </p>
            </div>
          </div>
        </div>

        {/* ===== Repartidores ===== */}
        <div>
          <h3 className="text-xl font-bold text-[#D2232A] mb-4 text-center">
            Para repartidores
          </h3>

          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4">
            <div className="h-12 w-16 rounded-lg bg-[#DDF5E3] grid place-items-center">
              <Truck className="h-6 w-6 text-[#111827]" />
            </div>
            <div>
              <p className="font-semibold text-[#111827] leading-tight">
                Ingresos flexibles
              </p>
              <p className="text-gray-600 text-sm">
                Trabaja cuando quieras y genera ingresos adicionales en tu zona.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4">
            <div className="h-12 w-16 rounded-lg bg-[#DDF5E3] grid place-items-center">
              <Users className="h-6 w-6 text-[#111827]" />
            </div>
            <div>
              <p className="font-semibold text-[#111827] leading-tight">
                Comunidad unida
              </p>
              <p className="text-gray-600 text-sm">
                Sé parte esencial conectando emprendedores con clientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
