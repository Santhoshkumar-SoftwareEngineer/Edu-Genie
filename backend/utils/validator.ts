export function validateRequiredFields<T extends Record<string, any>>(
  body: T,
  requiredFields: (keyof T)[]
): { valid: boolean; missingField?: string } {
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || body[field] === "") {
      return { valid: false, missingField: String(field) };
    }
  }
  return { valid: true };
}

export function sanitizeText(text: string): string {
  if (typeof text !== "string") return "";
  return text.trim().slice(0, 50000); // 50k char boundary
}

export function cleanJsonResponse(rawText: string): string {
  let cleaned = rawText.trim();
  // Remove markdown code fences ```json ... ``` or ``` ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  
  // Find first { or [ and last } or ]
  const firstCurly = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  const firstIndex =
    firstCurly !== -1 && firstBracket !== -1
      ? Math.min(firstCurly, firstBracket)
      : firstCurly !== -1
      ? firstCurly
      : firstBracket;

  const lastCurly = cleaned.lastIndexOf("}");
  const lastBracket = cleaned.lastIndexOf("]");
  const lastIndex = Math.max(lastCurly, lastBracket);

  if (firstIndex !== -1 && lastIndex !== -1 && lastIndex > firstIndex) {
    cleaned = cleaned.substring(firstIndex, lastIndex + 1);
  }

  return cleaned.trim();
}
