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
    /** Accent color used across interactive elements. */
    accent: "indigo",
  },
} as const;

export type AppConfig = typeof appConfig;
