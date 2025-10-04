import { cookies } from 'next/headers';
import { createServerComponentClient, createServerActionClient } from '@supabase/auth-helpers-nextjs';

export const serverClient = () => createServerComponentClient({ cookies });
export const serverAction = () => createServerActionClient({ cookies });
