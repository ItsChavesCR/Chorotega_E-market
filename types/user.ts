export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatarUrl?: string | null;
  role?: "emprendedor" | "cliente" | "repartidor";
  language?: "es" | "en";
  timezone?: string; // ej: "America/Costa_Rica"
};

export type UpdateUserPayload = Partial<
  Pick<User, "name" | "phone" | "address" | "bio" | "language" | "timezone">
>;
