import { cn } from "~/lib/utils";

export function Dots({
  count = 3,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={cn("animate-pulse", className)}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: "1.4s",
          }}
        >
          .
        </span>
      ))}
    </>
  );
}
