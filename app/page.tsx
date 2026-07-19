"use client";

import { useState } from "react";
import Link from "next/link";
import { Sora, Manrope } from "next/font/google";
import { Typewriter } from 'react-simple-typewriter'

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
});

const SERVICES = [
  {
    title: "Éclairage intelligent",
    desc: "Programmez, tamisez et pilotez chaque pièce depuis votre téléphone ou par la voix.",
    icon: (
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6v.5h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z" />
    ),
  },
  {
    title: "Volets & stores",
    desc: "Ouverture et fermeture automatiques selon la lumière du jour, la météo ou vos horaires.",
    icon: <path d="M4 4h16v16H4V4Zm0 4h16M4 12h16M4 16h16" />,
  },
  {
    title: "Cuisine connectée",
    desc: "Préchauffez le four à distance et recevez une alerte dès que le plat est prêt.",
    icon: <path d="M4 7h16v13H4V7Zm3-3h10v3H7V4Zm5 7v6m-3-3h6" />,
  },
  {
    title: "Climatisation",
    desc: "Une température idéale dans chaque pièce, ajustée automatiquement selon vos habitudes.",
    icon: <path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9" />,
  },
  {
    title: "Sécurité & caméras",
    desc: "Surveillez votre maison en direct et recevez une alerte au moindre mouvement suspect.",
    icon: (
      <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Zm-2 9 2 2 4-4" />
    ),
  },
  {
    title: "Multimédia & son",
    desc: "Diffusez votre musique et gérez vos écrans dans toute la maison, pièce par pièce.",
    icon: <path d="M4 17V9l6-3v14l-6-3Zm10-11v12M18 9v6M22 11v2" />,
  },
];

const HERO_LINE_1 = "Votre maison,";
const HERO_LINE_2 = "elle s'occupe du reste.";

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div
      className={`${sora.variable} ${manrope.variable} font-[family-name:var(--font-manrope)] bg-white text-gray-900 dark:bg-[#0b0f1a] dark:text-white`}
    >
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-white/10">
        {/* grille circuit en fond — inversée selon le thème */}
        <div
          className="absolute inset-0 opacity-[0.06] dark:hidden"
          style={{
            backgroundImage:
              "linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07] hidden dark:block"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* halo ambre */}
        <div className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(242,169,59,0.25),transparent)] blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-40 pb-28 grid lg:grid-cols-2 gap-16 items-center">
          {/* Texte */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium tracking-wide text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
              Maison connectée, nouvelle génération
            </span>

            <h1 className="mt-6 font-[family-name:var(--font-sora)] font-extrabold leading-[1.05] text-4xl sm:text-5xl lg:text-6xl">
              <span className="relative inline-block min-h-[1.2em]">
                <span className="invisible">{HERO_LINE_1}</span>
                <span className="absolute inset-0">
                  <Typewriter
                    words={[HERO_LINE_1]}
                    loop={1}
                    typeSpeed={50}
                    delaySpeed={500}
                  />
                </span>
              </span>
              <br />
              <span className="relative inline-block min-h-[1.2em] text-amber-600 dark:text-amber-400">
                <span className="invisible">{HERO_LINE_2}</span>
                <span className="absolute inset-0">
                  <Typewriter
                    words={[HERO_LINE_2]}
                    loop={1}
                    typeSpeed={100}
                    delaySpeed={1000}
                  />
                </span>
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              CASAHOT automatise vos lumières, vos stores, votre four et bien
              plus, pour une maison qui s&apos;adapte à vous, jour après jour.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="#contact"
                className="rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-[#0b0f1a] shadow-lg shadow-amber-500/20 transition-transform hover:scale-[1.03]"
              >
                Demander une démo
              </Link>
              <Link
                href="#services"
                className="rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3 text-sm font-semibold transition-colors dark:border-white/15 dark:text-white/90 dark:hover:bg-white/5"
              >
                Découvrir nos services
              </Link>
            </div>
          </div>

          {/* Illustration : façade avec fenêtres qui s'allument */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-white/10 dark:bg-white/[0.03] backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md bg-amber-400 dark:bg-amber-300/90 animate-pulse"
                    style={{
                      animationDelay: `${i * 0.35}s`,
                      animationDuration: "3.2s",
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 h-4 rounded-full bg-gray-200 dark:bg-white/10" />
              <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400 tracking-wide">
                Séquence automatique — coucher de soleil
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUI SOMMES-NOUS ================= */}
      <section id="about" className="border-b border-gray-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-amber-600 dark:text-amber-400 uppercase">
              Qui sommes-nous ?
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-sora)] font-bold text-3xl sm:text-4xl leading-tight">
              L&apos;automatisation pensée pour votre quotidien
            </h2>
          </div>
          <div className="space-y-5 text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              CASAHOT conçoit des solutions domotiques pour rendre chaque foyer
              plus simple à vivre. Nous connectons vos lumières, vos stores, vos
              équipements de cuisine et vos systèmes de sécurité sur une seule
              plateforme, pilotable depuis votre téléphone.
            </p>
            <p>
              Notre équipe accompagne chaque client de l&apos;installation à la
              prise en main, avec du matériel fiable et une application pensée
              pour rester simple, même pour les foyers les moins connectés.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6">
              {[
                ["+500", "Maisons équipées"],
                ["24/7", "Suivi & assistance"],
                ["100%", "Contrôle à distance"],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="font-[family-name:var(--font-sora)] text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {value}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section
        id="services"
        className="border-b border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/[0.02]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-[0.2em] text-amber-600 dark:text-amber-400 uppercase">
              Ce que nous automatisons
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-sora)] font-bold text-3xl sm:text-4xl leading-tight">
              Un seul système, toute la maison
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Chaque équipement de votre maison, connecté et coordonné pour
              fonctionner ensemble, automatiquement.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="group relative rounded-xl border border-gray-200 bg-white shadow-sm hover:border-amber-400/60 dark:border-white/10 dark:bg-[#0e1320] dark:shadow-none dark:hover:border-amber-400/40 p-6 transition-colors"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 transition-colors group-hover:bg-amber-200 dark:group-hover:bg-amber-400/20">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    {s.icon}
                  </svg>
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-sora)] font-semibold text-lg">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-[1fr_1.2fr] gap-16">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-amber-600 dark:text-amber-400 uppercase">
              Contact
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-sora)] font-bold text-3xl sm:text-4xl leading-tight">
              Parlons de votre maison
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-sm">
              Une question, un projet d&apos;installation ? Notre équipe vous
              répond sous 24h.
            </p>

            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <span className="h-8 w-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-white/5 dark:text-amber-400">
                  ✉
                </span>
                contact@casahot.ma
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <span className="h-8 w-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-white/5 dark:text-amber-400">
                  ☎
                </span>
                +212 5 00 00 00 00
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <span className="h-8 w-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-white/5 dark:text-amber-400">
                  ⌂
                </span>
                Marrakech, Maroc
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/[0.03] p-8 space-y-5"
          >
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Nom complet
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 dark:border-white/10 dark:bg-[#0b0f1a] dark:text-white dark:placeholder:text-gray-500 px-4 py-2.5 text-sm outline-none focus:border-amber-500 dark:focus:border-amber-400/50"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 dark:border-white/10 dark:bg-[#0b0f1a] dark:text-white dark:placeholder:text-gray-500 px-4 py-2.5 text-sm outline-none focus:border-amber-500 dark:focus:border-amber-400/50"
                placeholder="vous@exemple.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Message
              </label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 dark:border-white/10 dark:bg-[#0b0f1a] dark:text-white dark:placeholder:text-gray-500 px-4 py-2.5 text-sm outline-none focus:border-amber-500 dark:focus:border-amber-400/50"
                placeholder="Parlez-nous de votre projet"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-gray-950 transition-transform hover:scale-[1.01]"
            >
              {sent ? "Message envoyé ✓" : "Envoyer le message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}