import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-primary/10', className)}
      {...props}
    />
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-6 shadow">
          <div className="flex items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-16 mt-2" />
          <Skeleton className="h-3 w-20 mt-2" />
        </div>
      ))}
    </div>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20 mt-1" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-12 mt-1" />
          </div>
          <div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-2 w-full mt-1" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24 ml-auto" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow">
      <Skeleton className="h-5 w-40 mb-4" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
