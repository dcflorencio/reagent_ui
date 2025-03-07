import { createClient } from "@/app/utils/supabase/server";

export async function getUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser()
    return user;
}
