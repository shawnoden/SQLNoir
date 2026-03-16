import type { Case } from "@/types";

// When NEXT_PUBLIC_ENABLE_MONETIZATION is not set or "0", the entire app is free.
const monetizationEnabled =
  process.env.NEXT_PUBLIC_ENABLE_MONETIZATION === "1";

// Cases 1-2 (beginner) are free. Cases 3-6 (intermediate + advanced) require a license.
const FREE_CATEGORIES = new Set(["beginner"]);

export function isCaseFree(caseData: Case): boolean {
  if (!monetizationEnabled) return true;
  return FREE_CATEGORIES.has(caseData.category);
}

export function isCaseLocked(caseData: Case, hasLicense: boolean): boolean {
  if (!monetizationEnabled) return false;
  if (isCaseFree(caseData)) return false;
  return !hasLicense;
}

export function isCategoryLocked(
  categoryId: string,
  hasLicense: boolean
): boolean {
  if (!monetizationEnabled) return false;
  if (FREE_CATEGORIES.has(categoryId)) return false;
  return !hasLicense;
}

export function getUserHasLicense(userInfo: any): boolean {
  if (!monetizationEnabled) return true;
  if (!userInfo) return false;
  return Boolean(userInfo.has_license);
}
