/**
 * Central project configuration.
 *
 * Single source of truth for app-wide values (brand, theme references, etc.).
 * Import it anywhere with `import { appConfig } from "@/src/config/app.config";`.
 * The `as const` keeps every value as a precise literal type.
 */
export const appConfig = {
  brand: {
    /** Displayed app name (header / brand). */
    name: "Task Manager",
  },
  theme: {
    /**
     * Colors are defined as semantic design tokens in src/styles/globals.css
     * (the @theme block) — that is the single place to reskin the palette.
     * The accent is the Cyberpunk red; change --color-accent* there.
     */
    accent: "red",
  },
} as const;

export type AppConfig = typeof appConfig;
