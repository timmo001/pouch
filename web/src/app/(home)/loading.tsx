export default function Loading() {
  return (
    <div className="flex h-[calc(100dvh-6rem)] w-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Loading...</h1>
      <p className="text-muted-foreground">This may take a few seconds.</p>
    </div>
  );
}
