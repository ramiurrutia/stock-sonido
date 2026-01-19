"use client";

import { useState } from "react";
import { BsPersonCircle, BsLock, BsUnlock } from "react-icons/bs";
import Swal from "sweetalert2";

export default function User() {
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userName") || "";
    }
    return "";
  });
  const [isLocked, setIsLocked] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userNameLocked") === "true";
    }
    return false;
  });

  const handleOpen = async () => {
    const result = await Swal.fire({
      title: "Usuario",
      html: `
        <div class="text-left">
          <label class="text-sm text-zinc-500 mb-1">Nombre</label>
          <input 
            id="userName" 
            type="text" 
            value="${userName}" 
            ${isLocked ? 'disabled' : ''}
            class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50"
            placeholder="Ingresá tu nombre"
          />
          <p class="text-xs text-zinc-500 mt-1">
            ${isLocked ? 'Nombre bloqueado. Desbloqueá para editar.' : 'Bloqueá el nombre para evitar cambios accidentales.'}
          </p>
          ${userName ? `<p class="text-xs text-zinc-400 mt-3">Usuario actual: <span class="text-zinc-200 font-medium">${userName}</span></p>` : ''}
        </div>
      `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: isLocked ? "Cerrar" : "Guardar",
      cancelButtonText: "Cancelar",
      denyButtonText: isLocked ? `<BsLock className="size-4" /> Desbloquear` : `<BsLock className="size-4" />Bloquear`,
      background: '#27272a',
      color: '#e4e4e7',
      confirmButtonColor: isLocked ? '#3f3f46' : '#2563eb',
      cancelButtonColor: '#3f3f46',
      denyButtonColor: isLocked ? '#dc2626' : '#3f3f46',
      preConfirm: () => {
        const input = document.getElementById("userName") as HTMLInputElement;
        return input?.value;
      },
      didOpen: () => {
        const input = document.getElementById("userName") as HTMLInputElement;
        if (!isLocked) {
          input?.focus();
        }
      }
    });

    // Si apretó el botón de lock/unlock
    if (result.isDenied) {
      const newLockState = !isLocked;
      setIsLocked(newLockState);
      localStorage.setItem("userNameLocked", newLockState.toString());
      handleOpen(); // Reabrir el modal con el nuevo estado
      return;
    }

    // Si confirmó y no está bloqueado, guardar
    if (result.isConfirmed && !isLocked && result.value) {
      localStorage.setItem("userName", result.value);
      setUserName(result.value);
      Swal.fire({
        title: "Nombre guardado",
        toast: true,
        theme: "dark",
        position: "top",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      });
    }
  };

  return (
    <BsPersonCircle 
      className="fixed size-6 right-0 mx-4 text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors" 
      onClick={handleOpen}
    />
  );
}