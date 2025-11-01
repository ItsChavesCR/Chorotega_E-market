export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatarUrl?: string | null;
  role?: "entrepreneur" | "client" | "courier";
  language?: "es" | "en";
  timezone?: string; 
};

export type UpdateUserPayload = Partial<
  Pick<User, "name" | "phone" | "address" | "bio" | "language" | "timezone">
>;
