"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { Pedido } from "@/types/pedido";
import { PedidosService } from "@/services/pedidos/pedidosService";

export function usePedidos() {
  const queryClient = useQueryClient();

  // Obtener pedidos del emprendedor autenticado
  const { data, isLoading, isError } = useQuery<Pedido[]>({
    queryKey: ["pedidos_emprendedor"],
    queryFn: PedidosService.listMyPedidos,
  });

  // Mutación para actualizar estado
  const updateStatusMutation = useMutation({
    mutationFn: (params: { id: number; estado: string }) =>
      PedidosService.updateStatus(params.id, params.estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos_emprendedor"] });
    },
  });

  return {
    pedidos: data || [],
    isLoading,
    isError,
    updateStatus: updateStatusMutation.mutateAsync,
  };
}
