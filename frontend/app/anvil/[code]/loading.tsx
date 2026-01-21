
import { Skeleton } from "@/app/components/ui/Skeleton";


export default function Loading() {
    return (
        <main className="flex flex-col items-center justify-center p-4 h-screen w-screen">

            <Skeleton className="w-7 h-7 fixed top-0 left-0 my-4 ml-4" />
            <Skeleton className="w-42.5 h-10 fixed top-0 my-2" />
            <Skeleton className="w-8 h-8 fixed top-0 right-0 my-3 mr-4 rounded-full" />
            <Skeleton className="h-80 w-96" />

        </main>
    );
}