"use client";

import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import googleLogo from "@/public/google-logo.png";
import { createClient } from "@/utils/supabase/client";

export const LoginButton = () => {
  const supabase = createClient();
  //const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      // options: {
      //     redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      // },
    });
    //router.refresh();
    if (error) {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      variant="ghost"
      className="text-sm font-medium border border-transparent bg-white shadow cursor-pointer dark:bg-black dark:text-white dark:border-white/10"
    >
      <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
      <p>Login</p>
    </Button>
  );
};
