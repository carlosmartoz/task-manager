import { appConfig } from "@/src/config/app.config";

export function Brand() {
  return (
    <div className="lg:mb-8 flex items-center gap-2">
      <span className="text-lg font-bold text-slate-50">
        {appConfig.brand.name}
      </span>
    </div>
  );
}
