"use client"

import { useRouter } from 'next/navigation'
import { BsArrowLeft } from 'react-icons/bs'

export default function BackButton() {

  const router = useRouter()

return <button
    onClick={() => router.push('/')}
    className="text-white m-6 flex justify-center items-center text-2xl top-0 fixed left-0 z-50"
  >
    <BsArrowLeft />
  </button>
}        