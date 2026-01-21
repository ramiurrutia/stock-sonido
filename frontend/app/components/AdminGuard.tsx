"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("userName");
        if (!user) {
            router.push("/");
        } else {
            setTimeout(() => { setAuthorized(true); }, 0)
        }
    }, [router]);

    if (!authorized) return null;
    return <>{children}</>;
}