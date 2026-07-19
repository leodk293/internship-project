"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";

type UserMetadata = {
  full_name?: string;
  avatar_url?: string;
};

type AuthUser = {
  user_metadata?: UserMetadata;
} | null;

export default function AuthUserPanel() {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      setUser(session?.user ?? null);
      setLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      setUser(session?.user ?? null);
      setLoading(false);
      router.refresh();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  if (loading) {
    return <div className="h-8 w-24 rounded-full bg-gray-200/70 dark:bg-white/10" />;
  }

  if (!user) {
    return <LoginButton />;
  }

  const userName = user.user_metadata?.full_name ?? "User";
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="flex items-center gap-2">
      <div
        className="
          flex items-center gap-2
          rounded-full
          border border-gray-200 dark:border-white/10
          bg-gray-50 dark:bg-white/5
          pl-1 pr-1 py-1 md:pr-3
          transition-colors
        "
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={userName}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10"
          />
        ) : (
          <div
            className="
              h-7 w-7 rounded-full
              bg-violet-100 dark:bg-violet-500/20
              text-violet-700 dark:text-violet-300
              flex items-center justify-center
              text-xs font-semibold
            "
          >
            {userName.charAt(0).toUpperCase()}
          </div>
        )}

        <p
          className="
            hidden md:block
            max-w-32 lg:max-w-40
            truncate
            text-sm font-medium
            text-gray-800 dark:text-gray-100
          "
        >
          {userName}
        </p>
      </div>

      <LogoutButton />
    </div>
  );
}
