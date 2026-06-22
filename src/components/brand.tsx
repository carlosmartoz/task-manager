import { appConfig } from "@/src/config/app.config";

export function Brand() {
  return (
    <div className="lg:mb-8 flex items-center gap-2">
      <span className="h-5 w-1 bg-accent" />

      <span className="font-mono text-lg font-bold uppercase tracking-widest text-fg-strong">
        {appConfig.brand.name}
      </span>
    </div>
  );
}
