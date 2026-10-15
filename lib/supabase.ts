import { createClient } from "@supabase/supabase-js";

// Clé PUBLIQUE : faite pour être visible dans le navigateur.
// La sécurité vient des règles (policies) de la base, pas de cette clé.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
