import { FLOOR_LABEL } from "@/lib/floors";

type FloorPickerProps = {
  value: number;
  onChange: (n: number) => void;
  floors: number[];
};

export default function FloorPicker({ value, onChange, floors }: FloorPickerProps) {
  return (
    <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
      {floors.map((floor) => {
        const isActive = floor === value;
        const label = FLOOR_LABEL[floor] ?? String(floor);

        return (
          <button
            key={floor}
            onClick={() => onChange(floor)}
            aria-pressed={isActive}
            className={`
              px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${isActive 
                ? "bg-green-600 text-white shadow-sm" 
                : "text-slate-700 hover:bg-slate-200"
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
