import { describe, it, expect } from "vitest";
import enMessages from "../../../messages/en.json";
import ptBrMessages from "../../../messages/pt-br.json";

function flattenKeys(obj: Record<string, any>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

describe("i18n completeness", () => {
  const enKeys = flattenKeys(enMessages);
  const ptBrKeys = flattenKeys(ptBrMessages);

  it("en.json has all keys", () => {
    expect(enKeys.length).toBeGreaterThan(100);
  });

  it("pt-br.json has all keys that en.json has", () => {
    const missingInPtBr = enKeys.filter((k) => !ptBrKeys.includes(k));
    if (missingInPtBr.length > 0) {
      console.log("Missing in pt-br.json:", missingInPtBr);
    }
    expect(missingInPtBr).toEqual([]);
  });

  it("pt-br.json has no extra keys that en.json lacks", () => {
    const extraInPtBr = ptBrKeys.filter((k) => !enKeys.includes(k));
    if (extraInPtBr.length > 0) {
      console.log("Extra in pt-br.json:", extraInPtBr);
    }
    expect(extraInPtBr).toEqual([]);
  });

  it("no values in en.json are empty strings", () => {
    const emptyKeys = enKeys.filter((k) => {
      const val = k.split(".").reduce((obj: any, key) => obj?.[key], enMessages);
      return val === "";
    });
    expect(emptyKeys).toEqual([]);
  });

  it("no values in pt-br.json are empty strings", () => {
    const emptyKeys = ptBrKeys.filter((k) => {
      const val = k.split(".").reduce((obj: any, key) => obj?.[key], ptBrMessages);
      return val === "";
    });
    expect(emptyKeys).toEqual([]);
  });

  it("critical sections exist in both locales", () => {
    const requiredSections = [
      "common", "nav", "home", "cases", "caseSolver", "caseStudy",
      "solution", "auth", "help", "blog", "gameApp", "license", "checkout",
    ];
    for (const section of requiredSections) {
      expect(enMessages).toHaveProperty(section);
      expect(ptBrMessages).toHaveProperty(section);
    }
  });
});
