"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null means 'still loading'
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (isMounted) {
        setIsLoggedIn(!!session?.user);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsLoggedIn(!!session?.user);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return isLoggedIn;
}
