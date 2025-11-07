export type Pedido = {
  id: number;
  idusuario: string;
  idemprendedor: number;
  idrepartidor?: number | null;
  total: number;
  totalenvio: number;
  estado: "pendiente" | "confirmado" | "en_preparacion" | "completado" | string;
  direccionentrega?: string | null;
  createdat: string;
  provincia?: string | null;
  canton?: string | null;
  distrito?: string | null;
  barrio?: string | null;
  referencia_envio?: string | null;
  tipo_envio?: "domicilio" | "punto_encuentro" | "retiro_local" | null;
};

export type OrderStatus =
  | "confirmado"
  | "en_preparacion"
  | "en_camino"
  | "entregado"
  | "cancelado";

