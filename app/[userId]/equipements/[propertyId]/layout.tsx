import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CASAHOST",
};

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
