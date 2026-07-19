import React from 'react'

import { Luckiest_Guy } from "next/font/google";

const luckiestGuy = Luckiest_Guy({
  weight: "400",
  //subsets: ["latin"],
  //variable: "--font-luckiest-guy",
});

type LogoProps = {
  size?: string
}

export default function Logo({size}: LogoProps) {
  return (
    <h1 className={`${size} font-bold self-center ${luckiestGuy.className}`}>
      <span className="text-violet-500">CASA</span><span className="text-gray-800 dark:text-gray-200">HOST🏠</span>
    </h1>
  )
}
