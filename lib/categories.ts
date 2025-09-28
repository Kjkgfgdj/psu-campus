export const CATEGORY = {
  ALL: "All",
  PUBLIC: "Public facilities",
  EXAM: "Popular exam places",
  FOOD: "Food & drinks",
} as const;

export type CategoryFilter = (typeof CATEGORY)[keyof typeof CATEGORY];

export const CATEGORY_QUERY = {
  [CATEGORY.ALL]: "all",
  [CATEGORY.PUBLIC]: "public",
  [CATEGORY.EXAM]: "exam",
  [CATEGORY.FOOD]: "food",
} as const;

export type CategoryQueryValue = (typeof CATEGORY_QUERY)[CategoryFilter];

const CATEGORY_FROM_QUERY: Record<string, CategoryFilter> = {
  all: CATEGORY.ALL,
  public: CATEGORY.PUBLIC,
  exam: CATEGORY.EXAM,
  food: CATEGORY.FOOD,
};

export const CATEGORY_MATCH: Record<CategoryFilter, string[] | null> = {
  [CATEGORY.ALL]: null,
  [CATEGORY.PUBLIC]: ["Important places"],
  [CATEGORY.EXAM]: ["Popular exam places"],
  [CATEGORY.FOOD]: ["Food & drinks"],
};

export function matchCategory(ui: CategoryFilter, raw: string): boolean {
  const allow = CATEGORY_MATCH[ui];
  return !allow || allow.includes(raw);
}

export function categoryFromQuery(value: string | null | undefined): CategoryFilter {
  if (!value) return CATEGORY.ALL;
  return CATEGORY_FROM_QUERY[value] ?? CATEGORY.ALL;
}

export function categoryToQuery(value: CategoryFilter): CategoryQueryValue {
  return CATEGORY_QUERY[value];
}

export function badgeClasses(raw: string): string {
  if (raw === "Food & drinks") return "bg-green-50 text-green-700 ring-1 ring-green-200";
  if (raw === "Important places" || raw === "Public facilities") return "bg-red-50 text-red-700 ring-1 ring-red-200";
  if (raw === "Popular exam places") return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  return "bg-gray-50 text-gray-700 ring-1 ring-gray-200";
}

export function badgeTone(raw: string): { bg: string; text: string; border?: string } {
  if (raw === "Food & drinks") return { bg: "bg-green-50", text: "text-green-700", border: "ring-green-200" };
  if (raw === "Important places" || raw === "Public facilities") return { bg: "bg-red-50", text: "text-red-700", border: "ring-red-200" };
  if (raw === "Popular exam places") return { bg: "bg-amber-50", text: "text-amber-700", border: "ring-amber-200" };
  return { bg: "bg-gray-50", text: "text-gray-700", border: "ring-gray-200" };
}

export function pinColorForCategory(raw: string): string {
  if (raw === "Food & drinks") return "#16a34a";
  if (raw === "Important places" || raw === "Public facilities") return "#dc2626";
  if (raw === "Popular exam places") return "#d97706";
  return "#6b7280";
}

