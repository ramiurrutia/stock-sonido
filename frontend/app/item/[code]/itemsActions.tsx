"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"
import { StatusButton } from "./components/statusButton";

export default function ItemActions({
    code,
    currentStatus,
}: {
    code: string;
    currentStatus: string;
}) {
    const router = useRouter();

    const changeStatus = async (newStatus: string) => {
        Swal.fire({
            title: "¿Confirmar cambios?",
            html: `<p>Vas a cambiar el estado de: ${currentStatus} a ${newStatus}</p>`,
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
            theme: "dark"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Cambios guardados!",
                    theme: "dark",
                    timer: 1700,
                    timerProgressBar: true,
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    animation: false
                })
                try {axios.put(`http://localhost:4000/items/${code}/status`, {
                    status: newStatus,
                });} catch (error) {
                    console.error(error)
                }
                router.refresh();
            } else if (result.isDenied) {
                return;
            }
        })


    };

    return (<>
        <h2 className="text-lg font-light pb-2">Cambiar estado</h2>
        <div className="grid grid-cols-2 gap-4 w-full">
            <StatusButton currentStatus={currentStatus} newButtonStatus="Guardado" onClick={() => (changeStatus("Guardado"))}/>
            <StatusButton currentStatus={currentStatus} newButtonStatus="En uso" onClick={() => (changeStatus("En uso"))}/>
            <StatusButton currentStatus={currentStatus} newButtonStatus="Backup" onClick={() => (changeStatus("Backup"))}/>
            <StatusButton currentStatus={currentStatus} newButtonStatus="Baja" onClick={() => (changeStatus("Baja"))}/>
        </div>
    </>
    );
}
