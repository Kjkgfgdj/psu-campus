import { FLOOR_LABEL } from "@/lib/floors";
import { Button } from "@/components/ui/button";

type FloorPickerProps = {
  value: number;
  onChange: (n: number) => void;
  floors: number[];
};

export default function FloorPicker({ value, onChange, floors }: FloorPickerProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex flex-col gap-1">
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
              className="w-12 h-10"
            >
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}