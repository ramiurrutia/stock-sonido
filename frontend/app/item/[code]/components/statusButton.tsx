"use client";
import { BsArrowRepeat, BsBoxArrowInDown, BsBoxArrowUp, BsArchive } from "react-icons/bs";
import Swal from "sweetalert2";

export function StatusButton({ currentStatus, newButtonStatus, onClick }: { currentStatus: string, newButtonStatus: string, onClick: () => void }) {
    let statusSVG = <></>
    const isActive = currentStatus == newButtonStatus;

    let styleButton = "";

    if (isActive) {
        styleButton = "text-slate-700 bg-slate-900"
    } else {
        styleButton = "text-slate-200 bg-slate-900 hover:bg-slate-50/10 active:bg-slate-100/15"
    }

    switch (newButtonStatus) {
        case "Guardado":
            statusSVG = <BsBoxArrowInDown className="size-10 mb-2" />
            break;
        case "En uso":
            statusSVG = <BsBoxArrowUp className="size-10 mb-2" />
            break;
        case "Backup":
            statusSVG = <BsArrowRepeat className="size-10 mb-2" />
            break;
        case "Baja":
            statusSVG = <BsArchive className="size-10 mb-2" />
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
    }} className={`text-sm min-h-32 min-w-32 flex flex-col items-center justify-center rounded-lg transition-all ${styleButton}`}>
        {statusSVG}{newButtonStatus}
    </button>
}