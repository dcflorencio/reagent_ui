import { Skeleton } from "@/components/ui/skeleton"

export function PropertyCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <Skeleton className="h-48 w-full rounded-md" /> {/* Image placeholder */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/2" /> {/* Price placeholder */}
        <Skeleton className="h-4 w-1/4" /> {/* Type placeholder */}
        <Skeleton className="h-4 w-3/4" /> {/* Address placeholder */}
        <div className="flex space-x-4">
          <Skeleton className="h-4 w-1/4" /> {/* Beds placeholder */}
          <Skeleton className="h-4 w-1/4" /> {/* Baths placeholder */}
        </div>
        <Skeleton className="h-10 w-full" /> {/* Button placeholder */}
      </div>
    </div>
  )
}