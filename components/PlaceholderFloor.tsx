import { FLOOR_LABEL } from "@/lib/floors";

type Props = {
  building: string;
  floor: number;
  className?: string;
};

export default function PlaceholderFloor({ building, floor, className = "" }: Props) {
  const floorLabel = FLOOR_LABEL[floor] ?? String(floor);

  return (
    <div
      className={[
        "relative",
        "w-full rounded-2xl border bg-muted shadow-sm overflow-hidden",
        "h-[56vh] sm:h-[60vh] md:h-[64vh] lg:h-[68vh] xl:h-[72vh] min-h-[420px]",
        className,
      ].join(" ")}
    >
      {/* When we add the real SVG, it will live here with object-contain */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <span className="text-muted-foreground">
          Building {building} — Floor {floorLabel}
        </span>
      </div>
    </div>
  );
}