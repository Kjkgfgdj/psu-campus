import { FLOOR_LABEL } from "@/lib/floors";

type Props = {
  building: string;
  floor: number;
};

export default function PlaceholderFloor({ building, floor }: Props) {
  const floorLabel = FLOOR_LABEL[floor] ?? String(floor);
  
  return (
    <div className="relative w-full rounded-2xl border bg-muted/40 shadow-sm">
      <div className="flex items-center justify-center min-h-[78vh] md:min-h-[84vh] lg:min-h-[86vh] text-muted-foreground">
        <span className="text-lg sm:text-xl">Building {building} — Floor {floorLabel}</span>
      </div>
    </div>
  );
}