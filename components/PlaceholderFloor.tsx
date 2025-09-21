import { FLOOR_LABEL } from "@/lib/floors";

type Props = {
  building: string;
  floor: number;
};

export default function PlaceholderFloor({ building, floor }: Props) {
  const floorLabel = FLOOR_LABEL[floor] ?? String(floor);
  
  return (
    <div className="w-full bg-gray-100 rounded-lg aspect-[16/9] flex items-center justify-center">
      <p className="text-2xl text-gray-600">
        Building {building} — Floor {floorLabel}
      </p>
    </div>
  );
}