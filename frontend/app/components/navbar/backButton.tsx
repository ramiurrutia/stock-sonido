"use client"

import { useRouter } from 'next/navigation'
import { BsArrowLeft } from 'react-icons/bs'

export default function BackButton() {

  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== "undefined") {
      const hasHistory = window.history.length > 1;
      const hasReferrer = Boolean(document.referrer);
      if (hasReferrer) {
        try {
          const referrerUrl = new URL(document.referrer);
          const isSameOriginReferrer = referrerUrl.origin === window.location.origin;
          const cameFromScan = referrerUrl.pathname === "/scan";

          if (cameFromScan) {
            router.push("/");
            return;
          }

          if (hasHistory && isSameOriginReferrer) {
            router.back();
            return;
          }
        } catch {
        }
      }
    }

    router.push("/");
  };

return <button
    onClick={handleBack}
    className="text-zinc-200 m-4 flex justify-center items-center text-2xl top-0 fixed left-0 z-50  hover:text-zinc-400 transition-colors"
  >
    <BsArrowLeft />
  </button>
}        
