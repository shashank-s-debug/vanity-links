import { Skeleton, PosterSkeleton } from "@/components/ui";

export default function AppLoading() {
  return (
    <div className="animate-fade-in">
      {/* hero skeleton */}
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[var(--maxw)] space-y-4 px-4 pb-16 sm:px-6 lg:px-8">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-14 w-80 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-32 rounded-full" />
          </div>
        </div>
      </div>

      {/* rails skeleton */}
      <div className="space-y-10 py-10">
        {Array.from({ length: 2 }).map((_, r) => (
          <div key={r} className="px-4 sm:px-6 lg:px-8">
            <Skeleton className="mb-4 h-6 w-48" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <PosterSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
