// lib/http/client.ts




/**
 * Cliente HTTP base para operaciones con Supabase
 * Maneja autenticación automáticamente
 */
export class HttpClient {
  /**
   * Obtiene el cliente de Supabase autenticado
   */
  static async getAuthenticatedClient() {
    // Import createClient dynamically to avoid top-level import issues and allow bundlers/environments to handle it.
    const { createClient } = await import('@supabase/supabase-js');

    const SUPABASE_URL =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY =
      process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new HttpError('Supabase environment variables not set', 500);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      throw new HttpError('No autorizado', 401);
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
    
    // Aplicar filtros
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
    idColumn: string = 'id'
  ): Promise<T> {
    const { supabase } = await this.getAuthenticatedClient();
    
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq(idColumn, id)
      .select()
      .single();
    
    if (error) throw new HttpError(error.message, 400);
    
    return result as T;
  }

  /**
   * Elimina un registro
   */
  static async delete(
    table: string,
    id: number,
    idColumn: string = 'id'
  ): Promise<void> {
    const { supabase } = await this.getAuthenticatedClient();
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq(idColumn, id);
    
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
    this.name = 'HttpError';
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
  
  throw new HttpError('Error desconocido', 500);
}