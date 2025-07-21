export function getListItemTitle({
  type,
  description,
  value,
}: {
  type: "text" | "url";
  value: string;
  description?: string;
}) {
  switch (type) {
    case "url":
      if (description?.length) {
        return description;
      }

      return value;
    // case "text":
    default:
      return value;
  }
}
