import { Skeleton } from "../components/ui/Skeleton";


export default function Loading() {
  return (
    <main className="flex flex-col items-center justify-center p-4 h-screen w-screen">

      <Skeleton className="w-7 h-7 fixed top-0 left-0 my-4 ml-4" />
      <Skeleton className="h-7 w-28 mb-5"/>
      <Skeleton className="h-22 w-70" />
    </main>
  );
}