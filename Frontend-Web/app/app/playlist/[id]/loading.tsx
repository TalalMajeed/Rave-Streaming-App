import { Skeleton } from "@/components/ui/skeleton"

export default function PlaylistLoading() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Playlist Header Skeleton */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Skeleton className="w-48 h-48 md:w-64 md:h-64 rounded-md" />
          <div className="flex flex-col justify-end">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-12 w-64 md:w-96 mb-2" />
            <Skeleton className="h-4 w-48 mb-4" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />

          {/* Table Header Skeleton */}
          <div className="grid grid-cols-[auto_1fr_1fr_auto] md:grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-rave-dark-border">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20 hidden md:block" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </div>

          {/* Songs List Skeleton */}
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[auto_1fr_1fr_auto] md:grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 py-2 rounded-md"
              >
                <Skeleton className="h-4 w-6" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-32 hidden md:block" />
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center justify-end gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
