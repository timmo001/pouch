export function getListItemTitle({
  description,
  value,
}: {
  value: string;
  description?: string;
}) {
  if (description?.length) {
    return description;
  }

  return value;
}
