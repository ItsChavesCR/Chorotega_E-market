/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { usePedidos } from "@/hooks/usePedidos";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function EmprendedorHomePage() {
  const [perfil, setPerfil] = useState<any>(null);
  const { products, loading: loadingProducts } = useProducts();
  const { pedidos, isLoading: loadingPedidos } = usePedidos();

  const [stats, setStats] = useState({
    productos: 0,
    pedidosPendientes: 0,
    ventasTotales: 0,
    ingresosMes: 0,
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data } = await supabase
        .from("perfil_emprendedor")
        .select("*")
        .eq("idusuario", user.id)
        .maybeSingle();

      setPerfil(data);
    };

    fetchPerfil();
  }, []);

  useEffect(() => {
    if (!products || !pedidos) return;

    const activos = products.filter((p) => p.activo).length;
    const pendientes = pedidos.filter((p) => p.estado === "pendiente").length;
    const completados = pedidos.filter((p) => p.estado === "completado");
    const ventasTotales = completados.length;

    // 🧮 Ingresos del mes actual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const ingresosMes = completados
      .filter((p) => new Date(p.createdat) >= startOfMonth)
      .reduce((sum, p) => sum + (p.total || 0), 0);

    setStats({
      productos: activos,
      pedidosPendientes: pendientes,
      ventasTotales,
      ingresosMes,
    });
  }, [products, pedidos]);

  if (loadingProducts || loadingPedidos) {
    return (
      <section className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-neutral-600">Cargando datos...</p>
      </section>
    );
  }

  return (
    <section className="p-6 space-y-8">
      {/* 🔹 Encabezado */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">
          ¡Hola, {perfil?.nombrecomercio || "Emprendedor"}!
        </h1>
        <p className="text-sm text-neutral-600">
          Aquí tienes un resumen de tu negocio en Chorotega E-Market.
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          {format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })}
        </p>
      </div>

      {/* 🔹 Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-neutral-600">Productos activos</p>
          <h3 className="text-2xl font-bold text-green-700">{stats.productos}</h3>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-neutral-600">Pedidos pendientes</p>
          <h3 className="text-2xl font-bold text-blue-700">
            {stats.pedidosPendientes}
          </h3>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-neutral-600">Ventas totales</p>
          <h3 className="text-2xl font-bold text-emerald-700">
            {stats.ventasTotales}
          </h3>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-neutral-600">Ingresos este mes</p>
          <h3 className="text-2xl font-bold text-orange-600">
            ₡{stats.ingresosMes.toLocaleString("es-CR")}
          </h3>
        </div>
      </div>

      {/* 🔹 Acciones rápidas */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition">
          + Agregar producto
        </button>
        <button className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition">
          Ver pedidos
        </button>
        <button className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition">
          Editar perfil
        </button>
      </div>
    </section>
  );
}
