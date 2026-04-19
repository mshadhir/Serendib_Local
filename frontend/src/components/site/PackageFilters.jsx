import { FILTERS } from "@/lib/packages";

export default function PackageFilters({ duration, setDuration, types, toggleType }) {
  return (
    <div data-testid="package-filters" className="mb-12">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Duration */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#4B5563]">Length</span>
          <div className="flex flex-wrap gap-2">
            {FILTERS.duration.map((f) => (
              <button
                key={f.id}
                onClick={() => setDuration(f.id)}
                data-testid={`filter-duration-${f.id}`}
                className={`rounded-full px-4 py-1.5 text-sm border transition-all ${
                  duration === f.id
                    ? "bg-jungle-700 border-jungle-700 text-sand-50"
                    : "bg-sand-50 border-sand-200 text-[#111827] hover:border-jungle-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <span className="hidden lg:inline-block h-6 w-px bg-sand-200" />

        {/* Type */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#4B5563]">Style</span>
          <div className="flex flex-wrap gap-2">
            {FILTERS.type.map((f) => {
              const active = types.includes(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => toggleType(f.id)}
                  data-testid={`filter-type-${f.id}`}
                  className={`rounded-full px-4 py-1.5 text-sm border transition-all ${
                    active
                      ? "bg-clay-500 border-clay-500 text-sand-50"
                      : "bg-sand-50 border-sand-200 text-[#111827] hover:border-clay-500"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
