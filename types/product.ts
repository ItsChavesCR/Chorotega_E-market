// ✅ Lista de categorías (sin enum). De aquí inferimos el tipo Category.
export const CATEGORIES = [
  "Café",
  "Bebidas",
  "Lácteos",
  "Panadería",
  "Salsas",
  "Snacks",
  "Cuidado personal",
  "Otros",
] as const;

// Unión de literales: "Café" | "Bebidas" | ...
export type Category = (typeof CATEGORIES)[number];

// Modelo que usarás en la app (cards, listas…)
export type Product = {
  id: string;
  name: string;
  price: number;   // CRC
  stock: number;
  image: string;   // objectURL o URL backend (por ahora placeholder)
  category?: Category;   // <-- ahora opcional
  description?: string;  // <-- ahora opcional
};

/*
Si todavía te da lata el tipo Category, puedes cambiarlo por:
  category?: string;
Y seguir usando CATEGORIES solo para poblar el Select.
*/
