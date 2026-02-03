"use client";

import axios from "axios";
import Swal from "sweetalert2";
import { StatusButton } from "./statusButton";
import { useUser } from "@/app/hooks/useUser";
import { useSession } from "next-auth/react";



export default function ItemActions({
    code,
    currentStatus,
    onStatusChange,
}: {
    code: string;
    currentStatus: string;
    onStatusChange?: () => void;
}) {
    const { name } = useUser();
    const { data: session } = useSession();

    const changeStatus = async (newStatus: string) => {
        if (!session?.user?.accessToken) return;
        const result = await Swal.fire({
            title: "¿Confirmar cambios?",
            html: `<p>Vas a cambiar el estado de <span style="font-weight: 600;">${currentStatus}</span> a <span style="font-weight: 600;">${newStatus}</span></p>`,
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
            theme: "dark"
        });

        if (result.isConfirmed) {
            try {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/items/${code}/status`, {
                    status: newStatus, userName: name 
                },{
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });

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