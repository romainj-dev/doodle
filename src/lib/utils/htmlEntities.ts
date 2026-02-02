import he from "he";

/**
 * Encodes special characters to HTML entities (e.g., ' -> &#39;, & -> &amp;)
 * Prevents XSS and ensures proper HTML rendering
 */
export function encodeHtmlEntities(text: string): string {
  return he.encode(text);
}

/**
 * Decodes HTML entities in a string (e.g., &#39; -> ', &amp; -> &)
 * Handles all named, decimal, and hexadecimal entities
 */
export function decodeHtmlEntities(text: string): string {
  return he.decode(text);
}
