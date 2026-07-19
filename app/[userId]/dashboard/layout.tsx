import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - CASAHOST",
};

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
