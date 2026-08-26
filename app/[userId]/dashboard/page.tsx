"use client";

import React, { use, useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import {
  Building2,
  AlertCircle,
  MapPin,
  ArrowUpRight,
  Plus,
  Sparkles,
} from "lucide-react";

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
    <div className="rounded-xl overflow-hidden border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
      <Skeleton className="w-full aspect-[16/10] rounded-none bg-zinc-100 dark:bg-zinc-800/80" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-2/3 rounded-md bg-zinc-100 dark:bg-zinc-800" />
        <Skeleton className="h-3 w-4/5 rounded-md bg-zinc-100 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

function PropertyCard({ property, userId }: PropertyCardProps) {
  return (
    <Link
      href={`/${userId}/equipements/${property.id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/60 transition-all duration-300 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/5 dark:hover:border-violet-500/40"
    >
      <div className="relative w-full aspect-[16/10] bg-zinc-100 dark:bg-zinc-800/50 overflow-hidden">
        {property.image ? (
          <Image
            src={property.image}
            alt={property.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800/80">
            <Building2 className="h-9 w-9 text-zinc-300 dark:text-zinc-600 transition-transform duration-300 group-hover:scale-110" />
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 shadow-md backdrop-blur-xs">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1">
            {property.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" />
            <span>{property.address}</span>
          </p>
        </div>
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
    loading: true,
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

  const userName = user?.user_metadata?.full_name || "Utilisateur";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-200/60 dark:border-violet-800/40">
            <Sparkles className="h-3 w-3" />
            Espace de gestion
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            <Typewriter
              words={[`Bienvenue, ${userName}`]}
              loop={1}
              typeSpeed={50}
              delaySpeed={500}
            />
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Gérez vos propriétés et leurs équipements associés.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {properties.loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32 rounded-md bg-zinc-100 dark:bg-zinc-800" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {properties.error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200/80 bg-red-50/50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">
              Impossible de charger vos propriétés. Veuillez rafraîchir la page
              ou réessayer plus tard.
            </p>
          </div>
        )}

        {!properties.loading && !properties.error && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Vos propriétés
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {properties.data.length}
                </span>
              </h2>
            </div>

            {properties.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 py-16 px-4 text-center bg-zinc-50/50 dark:bg-zinc-900/20">
                <div className="p-3 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 shadow-xs mb-3">
                  <Building2 className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Aucune propriété enregistrée
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
                  Vous n&apos;avez pas encore configuré de bien. Commencez par
                  en ajouter un pour suivre ses équipements.
                </p>
                <Link
                  href={`/${userId}/properties/new`}
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Créer votre première propriété
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
