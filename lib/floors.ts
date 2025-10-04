export const BUILDING_FLOORS: Record<number, number[]> = {
  101: [0, 1, 2],
  104: [0, 1, 2, 3],
  105: [0, 1, 2],
};

export const FLOOR_LABEL: Record<number, string> = {
  0: "G",
  1: "1",
  2: "2",
  3: "3",
};

export const parseFloor = (v: string | null | undefined, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback; // default to Ground
};