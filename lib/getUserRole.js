import { supabase } from "./supabaseClient";


export async function getUserRole(userId) {
let { data, error } = await supabase.from("roles").select("role").eq("user_id", userId).single();
if (error || !data) return "user";
return data.role;
}
