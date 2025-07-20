import { useMemo } from "react";

export function DateLocale({
  date,
  showDate,
  showTime,
}: {
  date: Date;
  showDate?: boolean;
  showTime?: boolean;
}) {
  const formattedString = useMemo(() => {
    if (!showDate && !showTime) {
      return "";
    }

    const browserLocale =
      typeof navigator !== "undefined" ? navigator.language : "en-US";

    if (showDate && showTime) {
      return date.toLocaleString(browserLocale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (showDate) {
      return date.toLocaleDateString(browserLocale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } else if (showTime) {
      return date.toLocaleTimeString(browserLocale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    return "";
  }, [date, showDate, showTime]);

  return formattedString;
}
