import { Skeleton } from "./components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="flex flex-col items-center justify-center p-4 h-screen w-screen">
      <Skeleton className="w-42.5 h-10 fixed top-0 my-2" />
      <Skeleton className="w-8 h-8 fixed top-0 right-0 my-3 mr-4 rounded-full" />
      <Skeleton className="h-20 w-48 mb-12"/>
      <div className="flex flex-row gap-4">
        <Skeleton className="h-32 w-32" />
        <Skeleton className="h-32 w-32" />
      </div>
      
      <Skeleton className="h-20 w-68 mt-12" />
    </main>
  );
}