import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-white dark:bg-[#0b0f1a]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-muted-foreground">
              <span>© 2026 CASAHOST. Tous droits réservés.</span>
              <span className="hidden sm:inline text-border">|</span>
              <span className="font-semibold tracking-wide text-foreground/70 uppercase text-xs">
                PILOTEZ. ANTICIPEZ. OPTIMISEZ.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a
                href="#"
                className="transition-colors hover:text-foreground"
                id="footer-privacy"
              >
                Confidentialité
              </a>
              <a
                href="#"
                className="transition-colors hover:text-foreground"
                id="footer-terms"
              >
                Conditions
              </a>
              <a
                href="#"
                className="transition-colors hover:text-foreground"
                id="footer-compliance"
              >
                Conformité
              </a>
            </div>
          </div>
        </div>
      </footer>
  )
}
