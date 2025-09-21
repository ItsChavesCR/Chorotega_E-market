import React from "react";
import Image from "next/image";
import { Store } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative w-full h-[500px] sm:h-[680px] ">
      {/* Imagen de fondo */}
      <Image
        src="/IglesiaColonial.jpg"
        alt="Iglesia Colonial de Nicoya"
        fill
        className="object-cover"
        priority
      />

      {/* Capa oscura */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Contenido */}
      <div className="relative z-12 h-full w-full grid place-items-center px-4 text-center sm:text-left">
        <div className="w-full max-w-3xl text-center sm:text-left">
          <h1 className="text-center text-[34px] sm:text-5xl font-extrabold leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] text-white">
            Mercado <span className="text-red-600">Digital</span>
            <br />
            <span className="text-green-700">Chorotega</span>
          </h1>

          {/* Tarjeta translúcida con borde */}
          <div className="mt-12 sm:mt-14 rounded-xl border border-white/30 bg-white/20 text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <p className="p-5 sm:p-6 text-[13px] sm:text-[15px] leading-relaxed text-center">
              Chorotega E-Market es una plataforma comunitaria que conecta
              emprendedores locales, clientes y mensajeros. Promovemos la
              cultura de Nicoya, fortalecemos la economía local y facilitamos
              comprar y recibir productos en casa.
            </p>
          </div>

          {/* Botón */}
          <div className="mt-16 flex justify-center">
            <a
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-md bg-[#326931] px-5 py-3 text-white font-semibold shadow hover:bg-[#285528] active:scale-[0.99]"
            >
              <Store className="h-5 w-5" />
              Entrar al Mercado
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
