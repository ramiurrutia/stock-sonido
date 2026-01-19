"use client";

import axios from "axios";
import Swal from "sweetalert2";
import { StatusButton } from "./statusButton";

export default function ItemActions({
    code,
    currentStatus,
    onStatusChange,
}: {
    code: string;
    currentStatus: string;
    onStatusChange?: () => void;
}) {
    const changeStatus = async (newStatus: string) => {
        const result = await Swal.fire({
            title: "¿Confirmar cambios?",
            html: `<p>Vas a cambiar el estado de: ${currentStatus} a ${newStatus}</p>`,
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
            theme: "dark"
        });

        if (result.isConfirmed) {
            try {
                await axios.put(`http://localhost:4000/items/${code}/status`, {
                    status: newStatus,
                });

                // Refresca los datos del padre
                if (onStatusChange) {
                    onStatusChange();
                }

                Swal.fire({
                    title: "Cambios guardados!",
                    theme: "dark",
                    timer: 1700,
                    timerProgressBar: true,
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: "Error al cambiar estado",
                    theme: "dark",
                    icon: "error",
                    toast: true,
                });
            }
        }
    };

    return (
        <>
            <h2 className="text-sm font-light pb-2 text-center">Cambiar estado</h2>
            <div className="grid grid-cols-2 gap-4 w-full">
                <StatusButton currentStatus={currentStatus} newButtonStatus="Guardado" onClick={() => changeStatus("Guardado")} />
                <StatusButton currentStatus={currentStatus} newButtonStatus="En uso" onClick={() => changeStatus("En uso")} />
                <StatusButton currentStatus={currentStatus} newButtonStatus="Enviado" onClick={() => changeStatus("Enviado")} />
                <StatusButton currentStatus={currentStatus} newButtonStatus="Baja" onClick={() => changeStatus("Baja")} />
            </div>
        </>
    );
}