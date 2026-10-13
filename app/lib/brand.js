// Normalize legacy CMS branding and public contact details without changing identifiers.
export function normalizeBrandContent(value, key = "") {
  if (typeof value === "string") {
    if (!/token|password|hash/i.test(key)) {
      value = value.replace(/\bcontact@ugicorpgroup\.com\b/gi, "contact@usgiepc.com");
    }
    if (/url|href|email|slug|token|password|hash|mime|provider|^id$|documentId/i.test(key)) return value;
    if (key === "name" && /\.[a-z0-9]{2,5}$/i.test(value)) return value;
    return value.replace(
      /<[^>]*>|(?:https?:\/\/|mailto:|tel:)[^\s<>"']+|\b[^\s<>"']+@[^\s<>"']+|\bUGI(?:\s+Corporation)?\b/gi,
      (match) => /^UGI(?:\s+Corporation)?$/i.test(match) ? "US GLOBAL IMPEX" : match,
    );
  }
  if (Array.isArray(value)) return value.map((item) => normalizeBrandContent(item, key));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([field, content]) => [field, normalizeBrandContent(content, field)]));
  }
  return value;
}
