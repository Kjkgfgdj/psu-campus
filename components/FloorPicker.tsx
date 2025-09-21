import { FLOOR_LABEL } from "@/lib/floors";
import { Button } from "@/components/ui/button";

type FloorPickerProps = {
  value: number;
  onChange: (n: number) => void;
  floors: number[];
};

export default function FloorPicker({ value, onChange, floors }: FloorPickerProps) {
  return (
    <div className="rounded-xl bg-background/90 backdrop-blur border shadow-sm p-1">
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