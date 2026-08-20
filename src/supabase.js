import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kdwyvlbanmedjjqdmkcw.supabase.co";
const supabaseAnonKey = "sb_publishable_PO3QVYtd-UtdzAnmeWSBmA_bCJWZbxJ";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);