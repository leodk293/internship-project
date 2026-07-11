'use client'

import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/client'
import {LogOut} from "lucide-react"

export function LogoutButton({ className }: { className?: string }) {
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className={`${className} p-5 text-sm font-medium cursor-pointer flex flex-row items-center gap-2`}
        >
            <LogOut color="#000000" strokeWidth={1.5} />
            <p className=" text-sm font-medium self-center">Logout</p>
        </Button>
    )
}