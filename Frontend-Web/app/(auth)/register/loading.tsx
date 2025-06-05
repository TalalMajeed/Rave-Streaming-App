import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function RegisterLoading() {
  return (
    <Card className="border-rave-dark-border bg-rave-dark-card shadow-lg">
      <CardHeader className="space-y-2">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-10 w-full" />

        <div className="pt-6 mt-6 border-t border-rave-dark-border">
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </CardContent>
    </Card>
  )
}
