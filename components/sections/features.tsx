import { Store, Truck, TruckElectric, UserRound } from "lucide-react";
import React from "react";

export const Features = () => {
  return (
    <section className="w-full py-16 px-6 bg-[#F5F0E5] text-black">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202022]">
          ¿Como Funciona Chorotega e-Market?
        </h1>
        <p className="text-gray-600">
          Tres roles trabajando juntos para fortalecer nuestra comunidad local
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Emprendedor */}
        <div className="flex flex-col items-center text-center p-8 border border-gray-200 rounded-lg shadow-md bg-white">
          <div className="w-16 h-16 mb-4 bg-green-700 rounded-lg flex items-center justify-center">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Emprendedor</h2>
          <p className="text-gray-600 text-sm">
            Publica tus productos o servicios, gestiona tu negocio y conecta con clientes locales.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-8 border border-gray-200 rounded-lg shadow-md bg-white">
          <div className="w-16 h-16 mb-4 bg-[#B87333] rounded-lg flex items-center justify-center">
            <UserRound className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Cliente</h2>
          <p className="text-gray-600 text-sm">
            Descubre productos auténticos, realiza compras fáciles y apoya a emprendedores locales.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-8 border border-gray-200 rounded-lg shadow-md bg-white">
          <div className="w-16 h-16 mb-4 bg-red-600 rounded-lg flex items-center justify-center">
            <TruckElectric className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Repartidor</h2>
          <p className="text-gray-600 text-sm">
            Genera ingresos flexibles entregando productos y conectando la comunidad.
          </p>
        </div>
      </div>
    </section>
  );
};
