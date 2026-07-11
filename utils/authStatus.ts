import { createClient } from "@/utils/supabase/server";

const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

async function AuthStatus() {
  if (user) {
    return true;
  }
  return false;
}

export default AuthStatus;
