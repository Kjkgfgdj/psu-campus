import { FLOOR_LABEL } from "@/lib/floors";
import { Button } from "@/components/ui/button";

type FloorPickerProps = {
  value: number;
  onChange: (n: number) => void;
  floors: number[];
};

export default function FloorPicker({ value, onChange, floors }: FloorPickerProps) {
  return (
    <div className="rounded-xl bg-amber-50/95 backdrop-blur border-2 border-amber-200 shadow-lg p-1.5">
      <div className="flex flex-col gap-1">
        {floors.map((floor) => {
          const isActive = floor === value;
          const label = FLOOR_LABEL[floor] ?? String(floor);

          return (
            <Button
              key={floor}
              onClick={() => onChange(floor)}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              aria-pressed={isActive}
              className={`w-12 h-10 font-semibold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-amber-700 to-orange-600 text-white hover:from-amber-800 hover:to-orange-700 shadow-md"
                  : "text-amber-800 hover:bg-amber-100 hover:text-amber-900"
              }`}
            >
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}