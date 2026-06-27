import { cn } from "@/src/lib/utils";
import type { InputProps } from "@/src/types/input";

export function Input({
  value,
  onChange,
  className,
  placeholder,
  type = "text",
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "cyber-clip min-w-0 flex-1 border border-border bg-surface px-3 py-3 text-sm text-foreground placeholder:text-foreground-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30",
        className,
      )}
    />
  );
}
