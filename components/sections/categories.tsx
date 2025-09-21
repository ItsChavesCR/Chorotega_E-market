import React from "react";
import {
  UtensilsCrossed,
  Palette,
  Handshake,
  Shirt,
  Home,
  Gift,
} from "lucide-react";

type Cat = {
  name: string;
  count: number;
  color: string; // bg color for the icon chip
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const CATEGORIES: Cat[] = [
  { name: "Comida",      count: 10, color: "bg-green-700",  Icon: UtensilsCrossed },
  { name: "Artesanías",  count: 15, color: "bg-[#B87333]",  Icon: Palette },
  { name: "Servicios",   count: 5,  color: "bg-red-600",    Icon: Handshake },
  { name: "Ropa",        count: 10, color: "bg-[#C9B39C]",  Icon: Shirt },
  { name: "Hogar",       count: 15, color: "bg-[#2563EB]",  Icon: Home },
  { name: "Regalos",     count: 5,  color: "bg-[#A1066E]",  Icon: Gift },
];

export const Categories = () => {
  return (
    <section className="w-full bg-[#F5F0E5] py-16 px-6">
      {/* Encabezado */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202022]">
          Explora por Categorías
        </h2>
        <p className="mt-2 text-gray-600">
          Encuentra exactamente lo que buscas en nuestra variedad de productos
          locales
        </p>
      </div>

      {/* Grid de categorías */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {CATEGORIES.map(({ name, count, color, Icon }) => (
          <div
            key={name}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center"
          >
            <div
              className={`h-14 w-14 ${color} rounded-xl grid place-items-center text-white mb-3`}
            >
              <Icon className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-[#111827]">{name}</h3>
            <p className="text-gray-500 text-sm mt-1">{count} productos</p>
          </div>
        ))}
      </div>
    </section>
  );
};
