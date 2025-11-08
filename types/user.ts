// types/user.ts

export type UserRole = "entrepreneur" | "client" | "repartidor";

export interface UserMetadata {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatarUrl?: string | null;
  role?: "entrepreneur" | "client" | "repartidor";
  language?: "es" | "en";
  timezone?: string; 
};

export type UpdateUserPayload = Partial<
  Pick<UserMetadata, "name" | "phone" | "address" | "bio" | "language" | "timezone">
>;
