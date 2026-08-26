import React from "react";

import { Luckiest_Guy } from "next/font/google";
import Link from "next/link";

const luckiestGuy = Luckiest_Guy({
  weight: "400",
});

type LogoProps = {
  size?: string;
};

export default function Logo({ size }: LogoProps) {
  return (
    <Link className=" self-center" href={"/"}>
      <h1 className={`${size} font-bold self-center ${luckiestGuy.className}`}>
        <span className="text-violet-500">CASA</span>
        <span className="text-gray-800 dark:text-gray-200">HOST🏠</span>
      </h1>
    </Link>
  );
}
