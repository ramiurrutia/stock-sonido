"use client";
import { BsPinMap , BsBoxArrowInDown, BsBoxArrowUp, BsArchive } from "react-icons/bs";
import Swal from "sweetalert2";

export function StatusButton({ currentStatus, newButtonStatus, onClick }: { currentStatus: string, newButtonStatus: string, onClick: () => void }) {
    let statusSVG = <></>
    const isActive = currentStatus == newButtonStatus;

    let styleButton = "";

    if (isActive) {
        styleButton = "text-zinc-700 bg-zinc-900/80"
    } else {
        styleButton = "text-zinc-200 bg-linear-to-tl from-zinc-900 to-zinc-800 hover:bg-zinc-50/10 active:bg-zinc-100/15 ring ring-zinc-600"
    }

    switch (newButtonStatus) {
        case "Guardado":
            statusSVG = <BsBoxArrowInDown className="size-6 mb-1" />
            break;
        case "En uso":
            statusSVG = <BsBoxArrowUp className="size-6 mb-1" />
            break;
        case "Enviado":
            statusSVG = <BsPinMap className="size-6 mb-1" />
            break;
        case "Baja":
            statusSVG = <BsArchive className="size-6 mb-1" />
            break;
    }

    return <button onClick={() => {
        if (isActive) {
            Swal.fire({
                title: "El item ya está en este estado",
                theme: "dark",
                timer: 1700,
                timerProgressBar: true,
                toast: true,
                position: "top",
                showConfirmButton: false
            });
            return;
        } else {
            onClick()
        }
    }} className={`text-sm min-h-22 min-w-22 flex flex-col items-center justify-center rounded-lg transition-all ${styleButton}`}>
        {statusSVG}{newButtonStatus}
    </button>
}