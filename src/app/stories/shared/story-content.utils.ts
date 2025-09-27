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

function normalizeForComparison(value: HtmlContent): string {
  return normalizeHtmlContent(value)
    .replace(/\.\.\.$/, '')
    .toLowerCase();
}

function hasUniqueContent(candidate: HtmlContent, ...refs: Array<HtmlContent>): boolean {
  const normalizedCandidate = normalizeForComparison(candidate);
  if (!normalizedCandidate) {
    return false;
  }

  return !refs
    .map((ref) => normalizeForComparison(ref))
    .filter(Boolean)
    .some((value) => value === normalizedCandidate);
}

export function shouldShowExpandedSummary(content: HtmlContent, refs: Array<HtmlContent>): boolean {
  return hasUniqueContent(content, ...refs);
}

/**
 * Determine whether the bill text summary adds unique content compared to other sections.
 */
export function shouldShowBillTextSummary(
  billTextSummary: HtmlContent,
  refs: ComparisonRefs
): boolean {
  return hasUniqueContent(
    billTextSummary,
    refs.fullSummary,
    refs.fullStory,
    refs.preview
  );
}
