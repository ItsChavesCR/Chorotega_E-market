// services/pedidosService.ts
import { HttpClient, handleError } from "@/lib/http/client";
import { Pedido } from "@/types/pedido";

const TABLE_NAME = "pedido";

export const PedidosService = {
  /**
   * Lista los pedidos del emprendedor autenticado
   */
  async listMyPedidos(): Promise<Pedido[]> {
    try {
      const { supabase, user } = await HttpClient.getAuthenticatedClient();

      // Buscar el perfil del emprendedor vinculado al usuario autenticado
      const { data: perfil, error: perfilError } = await supabase
        .from("perfil_emprendedor")
        .select("id")
        .eq("idusuario", user.id)
        .single();

      // Si no tiene perfil, devolver un array vacío sin lanzar error
      if (perfilError || !perfil) {
        console.warn("⚠️ No se encontró perfil para el usuario actual:", user.id);
        return [];
      }

      // Obtener los pedidos del emprendedor autenticado
      const { data, error } = await supabase
        .from(TABLE_NAME)
        // Incluye datos del cliente (usuario que hizo el pedido)
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

      return data as Pedido[];
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Actualiza el estado de un pedido
   */
  async updateStatus(id: number, estado: string): Promise<Pedido> {
    try {
      return await HttpClient.update<Pedido>(TABLE_NAME, id, { estado });
    } catch (error) {
      handleError(error);
    }
  },
};
