"use client";
import React, { use, useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Building2, AlertCircle } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";

interface DashboardProps {
  params: Promise<{ userId: string }>;
}

type UserMetadata = {
  full_name?: string;
  avatar_url?: string;
};

type AuthUser = {
  user_metadata?: UserMetadata;
} | null;

type Property = {
  id: string;
  name: string;
  address: string;
  image?: string;
};

interface PropertiesState {
  error: boolean;
  loading: boolean;
  data: Property[];
}

interface PropertyCardProps {
  property: Property;
  userId: string;
}

function PropertyCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <Skeleton className="w-full aspect-[16/10] rounded-none bg-zinc-100 dark:bg-zinc-800" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-2.5 w-1/2 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        <Skeleton className="h-4 w-3/4 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        <Skeleton className="h-px w-full bg-zinc-100 dark:bg-zinc-800 mt-3" />
        <Skeleton className="h-4 w-1/3 rounded-full bg-zinc-100 dark:bg-zinc-800 ml-auto" />
      </div>
    </div>
  );
}

function PropertyCard({ property, userId }: PropertyCardProps) {
  return (
    <Link
      href={`/${userId}/equipements/${property.id}`}
      className="group rounded-lg overflow-hidden border border-zinc-200 bg-white transition-colors hover:border-violet-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-500"
    >
      <div className="relative w-full aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        {property.image ? (
          <Image
            src={property.image}
            alt={property.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Building2 className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
          </div>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {property.name}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
          {property.address}
        </p>
      </div>
    </Link>
  );
}

export default function Dashboard({ params }: DashboardProps) {
  const resolvedParams = use(params);
  const userId = resolvedParams.userId;

  const [user, setUser] = useState<AuthUser>(null);
  const supabase = useMemo(() => createClient(), []);

  const [properties, setProperties] = useState<PropertiesState>({
    error: false,
    loading: false,
    data: [],
  });

  useEffect(() => {
    if (!userId) return;

    async function fetchProperties() {
      setProperties({ error: false, loading: true, data: [] });
      try {
        const { data, error } = await supabase
          .from("properties")
          .select()
          .eq("user_id", userId);

        if (error) throw new Error(`An error has occurred: ${error.message}`);

        setProperties({ error: false, loading: false, data: data || [] });
      } catch (error: any) {
        console.error(error.message);
        setProperties({ error: true, loading: false, data: [] });
      }
    }

    fetchProperties();
  }, [userId, supabase]);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!isMounted) return;
      setUser(session?.user ?? null);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="max-w-7xl mt-10 mx-auto px-4">
      <h1 className="text-2xl text-center font-extrabold text-zinc-900 dark:text-zinc-50 md:text-4xl">
        <Typewriter
          words={[`Welcome ${user?.user_metadata?.full_name || "User"}`]}
          loop={1}
          typeSpeed={50}
          delaySpeed={500}
        />
      </h1>

      <div className="mt-8">
        {properties.loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {properties.error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="text-sm">
              Failed to load properties. Please try again.
            </p>
          </div>
        )}

        {!properties.loading && !properties.error && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Vos propriétés{" "}
              <span className="text-zinc-400 dark:text-zinc-500 font-normal">
                ({properties.data.length})
              </span>
            </h2>

            {properties.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
                <Building2 className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No properties found.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {properties.data.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    userId={userId}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
