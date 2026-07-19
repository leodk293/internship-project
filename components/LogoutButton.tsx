"use client";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton({ className }: { className?: string }) {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className={`${className} p-5 rounded-4xl self-center text-sm font-medium cursor-pointer flex flex-row items-center gap-2 dark:text-white`}
    >
      <LogOut strokeWidth={1.5} />
      <p className=" text-sm font-medium self-center">Logout</p>
    </Button>
  );
}
