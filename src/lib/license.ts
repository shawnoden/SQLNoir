import type { Case } from "@/types";

// Cases 1-2 (beginner) are free. Cases 3-6 (intermediate + advanced) require a license.
const FREE_CATEGORIES = new Set(["beginner"]);

export function isCaseFree(caseData: Case): boolean {
  return FREE_CATEGORIES.has(caseData.category);
}

export function isCaseLocked(caseData: Case, hasLicense: boolean): boolean {
  if (isCaseFree(caseData)) return false;
  return !hasLicense;
}

export function isCategoryLocked(
  categoryId: string,
  hasLicense: boolean
): boolean {
  if (FREE_CATEGORIES.has(categoryId)) return false;
  return !hasLicense;
}

export function getUserHasLicense(userInfo: any): boolean {
  if (!userInfo) return false;
  return Boolean(userInfo.has_license);
}
