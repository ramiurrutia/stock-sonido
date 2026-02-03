"use client"
import { BsLink45Deg } from "react-icons/bs";
import BackButton from "../components/navbar/backButton";
import GoogleButton from "./components/googleButton";
import LogOut from "./components/logout";
import { useRouter } from "next/navigation";

export default function LoginPage() {
        const router = useRouter();
        return (<div className="w-screen h-screen flex flex-col justify-center items-center">
                <BackButton />
                <div className="flex flex-col justify-center items-center bg-zinc-900 p-4 rounded-lg ring-1 ring-zinc-700 w-70">
                                <h1 className="text-3xl font-semibold text-center bg-clip-text text-transparent bg-linear-to-t from-zinc-400 to-zinc-200 my-12">Iniciar sesión</h1>
                        <div className="flex flex-col justify-center items-center">
                                <GoogleButton />
                                <div className="py-3">
                                        <span className="flex items-center">
                                                <span className="h-px flex-1 bg-zinc-500 w-20"></span>
                                                <span className="px-4 text-zinc-400"> O </span>
                                                <span className="h-px flex-1 bg-zinc-500 w-20"></span>
                                        </span>
                                </div>
                                <LogOut />
                        </div>
                <span onClick={() => router.push("/privacy")} className="text-zinc-500 text-sm mt-12 flex flex-row underline underline-offset-2 items-center justify-center">Politicas de Privacidad <BsLink45Deg /></span>
                </div>
                <p className="text-zinc-400 text-xs mt-3 font-light">Pronto más opciones de inicio de sesión</p>
        </div>)
}
