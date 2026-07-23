import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";

type Props = {
  params: Promise<{ propertyId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { propertyId: id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("properties")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: data?.name ? `${data.name} - CASAHOST` : "CASAHOST",
  };
}

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
