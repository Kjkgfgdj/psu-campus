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
        "aspect-[16/10] lg:aspect-[16/9] max-h-[78vh]",
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