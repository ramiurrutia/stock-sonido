"use client";

import { BsPersonCircle } from "react-icons/bs";
import { useRouter } from "next/navigation";



export default function User() {
  const router = useRouter();
  return (
    <BsPersonCircle
      className="fixed size-8 right-0 mr-4 text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors"
      onClick={() => router.push("/login")}
    />
  );
}