// src/supabase.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rutmibpzywhqcpaozahw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0EVDZ3l3drtOkJO7FQuWGw_Bg8bjcum";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
