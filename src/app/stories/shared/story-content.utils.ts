export type HtmlContent = string | null | undefined;

interface ComparisonRefs {
  fullSummary?: HtmlContent;
  fullStory?: HtmlContent;
  preview?: HtmlContent;
}

/**
 * Strip HTML tags and normalize whitespace so equality checks are content-aware.
 */
export function normalizeHtmlContent(value: HtmlContent): string {
  if (!value) {
    return '';
  }

  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Determine whether the bill text summary adds unique content compared to other sections.
 */
export function shouldShowBillTextSummary(
  billTextSummary: HtmlContent,
  refs: ComparisonRefs
): boolean {
  const normalizedBillText = normalizeHtmlContent(billTextSummary);
  if (!normalizedBillText) {
    return false;
  }

  return ![refs.fullSummary, refs.fullStory, refs.preview]
    .map(normalizeHtmlContent)
    .filter(Boolean)
    .some((candidate) => candidate === normalizedBillText);
}
