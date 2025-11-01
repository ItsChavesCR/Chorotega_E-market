// types/user.ts

export type UserRole = "entrepreneur" | "client" | "courier";

export interface UserMetadata {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatarUrl?: string | null;
  role?: UserRole;
  language?: "es" | "en";
  timezone?: string; // ej: "America/Costa_Rica"
}

// Representa un usuario retornado por Supabase Auth
export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: UserMetadata;
}

export type User = UserMetadata & {
  id: string;
  email: string;
};

export type UpdateUserPayload = Partial<
  Pick<User, "name" | "phone" | "address" | "bio" | "language" | "timezone">
>;
