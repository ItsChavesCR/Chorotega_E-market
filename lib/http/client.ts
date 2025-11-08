/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase/client";

/**
 * Cliente HTTP base para operaciones con Supabase
 * ✅ Usa la misma instancia global (no crea clientes duplicados)
 * ✅ Maneja autenticación automáticamente
 */
export class HttpClient {
  /**
   * Obtiene el cliente de Supabase autenticado
   */
  static async getAuthenticatedClient() {
    const { data: { user }, error } = await supabase.auth.getUser();

    console.log("👤 Usuario autenticado:", user?.id);

    if (error || !user) {
      throw new HttpError("No autorizado", 401);
    }

    return { supabase, user };
  }

  /**
   * Ejecuta una consulta SELECT
   */
  static async query<T>(
    table: string,
    select: string,
    filters?: Record<string, any>
  ): Promise<T[]> {
    const { supabase } = await this.getAuthenticatedClient();

    let query = supabase.from(table).select(select);

    // Aplicar filtros dinámicamente
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;

    if (error) throw new HttpError(error.message, 400);
    return data as T[];
  }

  /**
   * Inserta un registro
   */
  static async insert<T>(
    table: string,
    data: Record<string, any>
  ): Promise<T> {
    const { supabase } = await this.getAuthenticatedClient();

    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw new HttpError(error.message, 400);
    return result as T;
  }

  /**
 * Actualiza un registro
 */
static async update<T>(
  table: string,
  id: number,
  data: Record<string, any>,
  idColumn: string = "id"
): Promise<T | null> {
  const { supabase } = await this.getAuthenticatedClient();

  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq(idColumn, id)
    .select(); // 👈 quitamos .single()

  if (error) throw new HttpError(error.message, 400);

  // Devuelve el primer registro o null si no hay datos
  return result?.[0] ?? null;
}


  /**
   * Elimina un registro
   */
  static async delete(
    table: string,
    id: number,
    idColumn: string = "id"
  ): Promise<void> {
    const { supabase } = await this.getAuthenticatedClient();

    const { error } = await supabase.from(table).delete().eq(idColumn, id);
    if (error) throw new HttpError(error.message, 400);
  }
}

/**
 * Error HTTP personalizado
 */
export class HttpError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/**
 * Maneja errores de forma consistente
 */
export function handleError(error: unknown): never {
  if (error instanceof HttpError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new HttpError(error.message, 500);
  }

  throw new HttpError("Error desconocido", 500);
}
