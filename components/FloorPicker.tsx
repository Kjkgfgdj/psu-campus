import { FLOOR_LABEL } from "@/lib/floors";

type FloorPickerProps = {
  value: number;
  onChange: (n: number) => void;
  floors: number[];
};

export default function FloorPicker({ value, onChange, floors }: FloorPickerProps) {
  return (
    <div 
      className="inline-flex items-center gap-0.5 bg-[#F1F5F9] p-1 rounded-full border border-[#E2E8F0]"
      role="tablist"
      aria-label="Floor selection"
    >
      {floors.map((floor) => {
        const isActive = floor === value;
        const label = FLOOR_LABEL[floor] ?? String(floor);

        return (
          <button
            key={floor}
            onClick={() => onChange(floor)}
            role="tab"
            aria-pressed={isActive}
            aria-selected={isActive}
            className={`
              px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${isActive 
                ? "bg-white text-slate-900 border border-[#E2E8F0] shadow-sm" 
                : "text-slate-600 hover:text-slate-900"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
