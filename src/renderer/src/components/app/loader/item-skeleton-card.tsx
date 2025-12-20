import { Skeleton } from '@/components/common/skeleton';

export function ItemSkeletonCard() {
  return (
    <div className="w-full h-full flex flex-col p-5 items-center justify-center">
      <div className="flex flex-col space-y-3 w-full h-full">
        <Skeleton className="h-8 w-full rounded-xl" />
        <div className="flex gap-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="flex-1 h-full w-full rounded-xl" />
      </div>
    </div>
  );
}
