import React from "react";
import {
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-[#B5B0A2] text-black py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Logo + Info */}
        <div className="flex flex-col items-start space-y-5 md:col-span-1">
          <Image
            src="/Chorotega.svg"
            alt="Chorotega Logo"
            width={120}
            height={120}
            className="mb-10"
          />
          
          <div className="flex items-center space-x-4 text-gray-700">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-7 w-7 hover:text-red-600" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-6 w-6 hover:text-pink-600" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-6 w-6 hover:text-blue-600" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-6 w-6 hover:text-sky-500" />
            </a>
          </div>
        </div>

        {/* Links columna 2 */}
        <div className="flex flex-col md:col-span-4 md:grid md:grid-cols-3 gap-8 ">
          <div>
            <h3 className="font-semibold mb-3">Nosotros</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#">Quiénes somos</a></li>
            <li><a href="#">Misión y visión</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Noticias</a></li>
          </ul>
        </div>

        {/* Links columna 3 */}
        <div>
          <h3 className="font-semibold mb-3">Ayuda</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#">Preguntas frecuentes</a></li>
            <li><a href="#">Cómo comprar</a></li>
            <li><a href="#">Envíos</a></li>
            <li><a href="#">Pagos</a></li>
            <li><a href="#">Devoluciones</a></li>
          </ul>
        </div>

        {/* Links columna 4 */}
        <div>
          <h3 className="font-semibold mb-3">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail size={16}/> contacto@chorotega.com</li>
            <li className="flex items-center gap-2"><Phone size={16}/> +506 8888-9999</li>
            <li className="flex items-center gap-2"><MapPin size={16}/> Nicoya, Guanacaste, Costa Rica</li>
          </ul>
        </div>
      </div>
        </div>

      {/* Copy */}
      <div className="mt-10 border-t border-black/20 pt-6 text-center text-sm text-gray-700">
        © {new Date().getFullYear()} Chorotega E-Market. Todos los derechos reservados.
      </div>
    </footer>
  );
};
