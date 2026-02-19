import { supabase } from "./lib/supabase";

export async function testSupabase() {
  const { data, error } = await supabase
    .from("category") // change to your real table name if needed
    .select("*")
    .limit(5);

  console.log("Supabase data:", data);
  console.log("Supabase error:", error);
}
