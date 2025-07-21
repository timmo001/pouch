export function getLinkTitle({
  description,
  url,
}: {
  url: string;
  description?: string;
}) {
  if (description?.length) {
    return description;
  }

  return url;
}
