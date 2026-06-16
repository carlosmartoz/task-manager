import type { Frequency } from "@/src/types";

export const FREQUENCY_META: Record<
  Frequency,
  { label: string; labelPlural: string; icon: string }
> = {
  daily: { label: "Daily", labelPlural: "Daily", icon: "sun" },
  weekly: { label: "Weekly", labelPlural: "Weekly", icon: "calendar-days" },
  monthly: { label: "Monthly", labelPlural: "Monthly", icon: "calendar-range" },
};

export const FREQUENCIES: Frequency[] = ["daily", "weekly", "monthly"];
