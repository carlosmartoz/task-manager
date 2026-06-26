// Configuration
export const appConfig = {
  brand: {
    name: "Task Manager",
  },
  theme: {
    accent: "red",
  },
} as const;

export type AppConfig = typeof appConfig;
