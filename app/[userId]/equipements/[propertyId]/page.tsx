"use client";
import React, { useState, useEffect, useMemo, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Wrench,
  AlertTriangle,
  MapPin,
  CircleCheck,
  CircleAlert,
  CircleX,
  Loader2,
} from "lucide-react";

interface PropertyProps {
  params: Promise<{
    propertyId: string;
    userId: string;
  }>;
}

type Property = {
  id: string;
  name: string;
  address: string;
  image?: string;
};

type EquipementStatus = "active" | "maintenance" /*| "broken"*/;

type Equipement = {
  id: string;
  property_id: string;
  name: string;
  brand: string | null;
  model: string | null;
  image: string | null;
  is_excessive_use: boolean;
  status: EquipementStatus | string;
  created_at: string;
};

type StatusStyle = {
  label: string;
  icon: typeof CircleCheck;
  className: string;
};

const STATUS_STYLES: Record<string, StatusStyle> = {
  active: {
    label: "Active",
    icon: CircleCheck,
    className:
      "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-900/50",
  },
  maintenance: {
    label: "Maintenance",
    icon: CircleAlert,
    className:
      "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-900/50",
  },
  /*broken: {
    label: "Broken",
    icon: CircleX,
    className:
      "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/40 dark:border-red-900/50",
  },*/
};

const STATUS_ORDER: EquipementStatus[] = ["active", "maintenance", /*"broken"*/];

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.active;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${style.className}`}
    >
      <Icon className="h-3 w-3" />
      {style.label}
    </span>
  );
}

function StatusSwitcher({
  status,
  updating,
  onChange,
}: {
  status: string;
  updating: boolean;
  onChange: (status: EquipementStatus) => void;
}) {
  return (
    <div className="relative grid grid-cols-2 gap-1 rounded-md border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950">
      {STATUS_ORDER.map((option) => {
        const isActive = status === option;
        const style = STATUS_STYLES[option];
        return (
          <button
            key={option}
            type="button"
            disabled={updating}
            onClick={() => onChange(option)}
            className={`rounded cursor-pointer px-2 py-1 text-xs font-medium capitalize transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              isActive
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            }`}
          >
            {style.label}
          </button>
        );
      })}
      {updating && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white/60 dark:bg-zinc-950/60">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
        </div>
      )}
    </div>
  );
}

function EquipementCard({
  equipement,
  onStatusChange,
}: {
  equipement: Equipement;
  onStatusChange: (id: string, status: EquipementStatus) => void;
}) {
  const [updating, setUpdating] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  async function handleStatusChange(newStatus: EquipementStatus) {
    if (newStatus === equipement.status || updating) return;
    setUpdating(true);
    const { error } = await supabase
      .from("equipements")
      .update({ status: newStatus })
      .eq("id", equipement.id);

    setUpdating(false);
    if (error) {
      console.error(error.message);
      return;
    }
    onStatusChange(equipement.id, newStatus);
  }

  return (
    <div className="group rounded-lg border border-zinc-200 bg-white overflow-hidden transition-colors hover:border-violet-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-500">
      <div className="relative aspect-[16/10] w-full bg-zinc-100 dark:bg-zinc-800">
        {equipement.image ? (
          <Image
            src={equipement.image}
            alt={equipement.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Wrench className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
          </div>
        )}
        {equipement.is_excessive_use && (
          <span
            title="Excessive use flagged"
            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {equipement.name}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
              {[equipement.brand, equipement.model].filter(Boolean).join(" · ") || "—"}
            </p>
          </div>
          <StatusBadge status={equipement.status} />
        </div>

        <div className="mt-4">
          <StatusSwitcher
            status={equipement.status}
            updating={updating}
            onChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
}

function EquipementCardSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
      <Skeleton className="aspect-[16/10] w-full rounded-none bg-zinc-100 dark:bg-zinc-800" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 rounded-full bg-zinc-100 dark:bg-zinc-800" />
            <Skeleton className="h-3 w-1/2 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        </div>
        <Skeleton className="mt-4 h-8 w-full rounded-md bg-zinc-100 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export default function Equipements({ params }: PropertyProps) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.propertyId;
  const userId = resolvedParams.userId;

  const supabase = useMemo(() => createClient(), []);

  const [property, setProperty] = useState<Property | null>(null);
  const [propertyLoading, setPropertyLoading] = useState(true);

  const [equipements, setEquipements] = useState<{
    error: boolean;
    loading: boolean;
    data: Equipement[];
  }>({ error: false, loading: true, data: [] });

  useEffect(() => {
    if (!propertyId) return;

    async function fetchProperty() {
      setPropertyLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select()
        .eq("id", propertyId)
        .single();

      if (!error) setProperty(data);
      setPropertyLoading(false);
    }

    fetchProperty();
  }, [propertyId, supabase]);

  useEffect(() => {
    if (!propertyId) return;

    async function fetchEquipements() {
      setEquipements({ error: false, loading: true, data: [] });
      try {
        const { data, error } = await supabase
          .from("equipements")
          .select()
          .eq("property_id", propertyId)
          .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);

        setEquipements({ error: false, loading: false, data: data || [] });
      } catch (error: any) {
        console.error(error.message);
        setEquipements({ error: true, loading: false, data: [] });
      }
    }

    fetchEquipements();
  }, [propertyId, supabase]);

  function handleStatusChange(id: string, status: EquipementStatus) {
    setEquipements((prev) => ({
      ...prev,
      data: prev.data.map((eq) => (eq.id === id ? { ...eq, status } : eq)),
    }));
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-900">
        {property?.image && (
          <Image
            src={property.image}
            alt={property.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
          <Link
            href={`/${userId}/dashboard`}
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>

          <div className="max-w-7xl mx-auto w-full">
            {propertyLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-7 w-56 rounded-full bg-white/20" />
                <Skeleton className="h-4 w-40 rounded-full bg-white/10" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                  {property?.name || "Property"}
                </h1>
                {property?.address && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-white/70">
                    <MapPin className="h-3.5 w-3.5" />
                    {property.address}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Equipements */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {equipements.error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            <CircleX className="h-4 w-4 shrink-0" />
            <p className="text-sm">Failed to load equipements. Please try again.</p>
          </div>
        )}

        {!equipements.error && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Equipements{" "}
              {!equipements.loading && (
                <span className="text-zinc-400 dark:text-zinc-500 font-normal">
                  ({equipements.data.length})
                </span>
              )}
            </h2>

            {equipements.loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <EquipementCardSkeleton key={i} />
                ))}
              </div>
            ) : equipements.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
                <Wrench className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No equipements found for this property.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipements.data.map((equipement) => (
                  <EquipementCard
                    key={equipement.id}
                    equipement={equipement}
                    onStatusChange={handleStatusChange}
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