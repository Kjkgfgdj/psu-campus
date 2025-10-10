export const CATEGORY = {
  ALL: "All",
  PUBLIC: "Public facilities",
  EXAM: "Popular exam places",
  FOOD: "Food & drinks",
  CLASSROOM: "Classroom",
  IMPORTANT: "Important places",
} as const;

export type CategoryFilter = (typeof CATEGORY)[keyof typeof CATEGORY];

export const CATEGORY_QUERY = {
  [CATEGORY.ALL]: "all",
  [CATEGORY.PUBLIC]: "public",
  [CATEGORY.EXAM]: "exam",
  [CATEGORY.FOOD]: "food",
  [CATEGORY.CLASSROOM]: "classroom",
  [CATEGORY.IMPORTANT]: "important",
} as const;

export type CategoryQueryValue = (typeof CATEGORY_QUERY)[CategoryFilter];

const CATEGORY_FROM_QUERY: Record<string, CategoryFilter> = {
  all: CATEGORY.ALL,
  public: CATEGORY.PUBLIC,
  exam: CATEGORY.EXAM,
  food: CATEGORY.FOOD,
  classroom: CATEGORY.CLASSROOM,
  important: CATEGORY.IMPORTANT,
};

export const CANONICAL_CATEGORIES = [
  "Food & drinks",
  "Important places",
  "Popular exam places",
  "Public facilities",
  "Classroom",
] as const;

export const CATEGORY_SLUGS = ["food", "important", "exam", "public", "classroom"] as const;
export const CATEGORY_LABEL: Record<string, string> = {
  food: "Food & drinks",
  important: "Important places",
  exam: "Popular exam places",
  public: "Public facilities",
  classroom: "Classroom",
};
export const CATEGORY_ALIAS: Record<string, string> = { exams: "exam" };
export const isValidCat = (v?: string) => !!v && (CATEGORY_SLUGS as readonly string[]).includes(v);

const FOOD_SYNONYMS = new Set(["food", "food-drinks", "cafe", "caf\u00e9", "restaurant"]);

export function normalizeCategory(raw?: string): string {
  const k = (raw ?? "").toLowerCase().trim();
  if (!k) return "";
  if (FOOD_SYNONYMS.has(k)) return "Food & drinks";
  const canonical = CANONICAL_CATEGORIES.find((label) => label.toLowerCase() === k);
  return canonical ?? (raw ?? "");
}

export function matchCategory(ui: CategoryFilter, raw: string): boolean {
  if (ui === CATEGORY.ALL) return true;
  const canonical = normalizeCategory(raw);
  const uiCanonical = normalizeCategory(displayForCategory(ui));
  return canonical === uiCanonical;
}

export function categoryFromQuery(value: string | null | undefined): CategoryFilter {
  if (!value) return CATEGORY.ALL;
  return CATEGORY_FROM_QUERY[value] ?? CATEGORY.ALL;
}

export function categoryToQuery(value: CategoryFilter): CategoryQueryValue {
  return CATEGORY_QUERY[value];
}

export function displayForCategory(value: CategoryFilter): string {
  return value;
}

export function badgeClasses(raw: string): string {
  const canonical = normalizeCategory(raw);
  if (canonical === "Food & drinks") return "bg-green-50 text-green-700 ring-1 ring-green-200";
  if (canonical === "Important places" || canonical === "Public facilities") return "bg-red-50 text-red-700 ring-1 ring-red-200";
  if (canonical === "Popular exam places") return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  return "bg-gray-50 text-gray-700 ring-1 ring-gray-200";
}

export function badgeTone(raw: string): { bg: string; text: string; border?: string } {
  const canonical = normalizeCategory(raw);
  if (canonical === "Food & drinks") return { bg: "bg-green-50", text: "text-green-700", border: "ring-green-200" };
  if (canonical === "Important places" || canonical === "Public facilities") return { bg: "bg-red-50", text: "text-red-700", border: "ring-red-200" };
  if (canonical === "Popular exam places") return { bg: "bg-amber-50", text: "text-amber-700", border: "ring-amber-200" };
  return { bg: "bg-gray-50", text: "text-gray-700", border: "ring-gray-200" };
}

export function pinColorForCategory(raw: string): string {
  const canonical = normalizeCategory(raw);
  if (canonical === "Food & drinks") return "#16a34a";
  if (canonical === "Important places" || canonical === "Public facilities") return "#dc2626";
  if (canonical === "Popular exam places") return "#d97706";
  return "#6b7280";
}

