// services/pedidosService.ts
import { HttpClient, handleError } from "@/lib/http/client";
import { Pedido } from "@/types/pedido";

const TABLE_NAME = "pedido";

export const PedidosService = {
  async listMyPedidos(): Promise<Pedido[]> {
    try {
      const { supabase, user } = await HttpClient.getAuthenticatedClient();

      

      // Buscar el perfil del emprendedor vinculado al usuario autenticado
      const { data: perfil, error: perfilError } = await supabase
        .from("perfil_emprendedor")
        .select("id")
        .eq("idusuario", user.id)
        .single();

      if (perfilError || !perfil) {
        console.warn("⚠️ No se encontró perfil para el usuario actual:", user.id);
        return [];
      }

      // Obtener los pedidos que pertenecen a este emprendedor
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(`
          *,
          usuarios (
            nombre,
            telefono
          )
        `)
        .eq("idemprendedor", perfil.id)
        .order("createdat", { ascending: false });

      if (error) throw error;

      console.log("🟢 Pedidos devueltos:", data);
      return data as Pedido[];
    } catch (error) {
      handleError(error);
    }
  },

  async updateStatus(id: number, estado: string): Promise<Pedido | null> {
  try {
    const result = await HttpClient.update<Pedido>("pedido", id, { estado });
    console.log("🔍 Resultado del update:", result);
    return result;
  } catch (error) {
    handleError(error);
  }
}


};
