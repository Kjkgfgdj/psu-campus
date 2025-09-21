import { FLOOR_LABEL } from "@/lib/floors";

type Props = {
  building: string;
  floor: number;
};

export default function PlaceholderFloor({ building, floor }: Props) {
  const floorLabel = FLOOR_LABEL[floor] ?? String(floor);
  
  return (
    <div className="relative w-full rounded-2xl border bg-muted/40">
      <div className="min-h-[70vh] md:min-h-[75vh] lg:min-h-[78vh] flex items-center justify-center text-lg sm:text-xl text-muted-foreground">
        Building {building} — Floor {floorLabel}
      </div>
    </div>
  );
}