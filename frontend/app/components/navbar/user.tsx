"use client";

import { BsPersonCircle } from "react-icons/bs";
import Swal from "sweetalert2";

export default function User() {
  const handleOpen = async () => {
    const currentName = localStorage.getItem("userName") || "";
    const isLocked = localStorage.getItem("userNameLocked") === "true";

    const result = await Swal.fire({
      title: "Usuario",
      html: `
        <div class="text-left">
          <label class="text-sm text-zinc-400 block mb-1">Nombre</label>
          <input 
            id="userName" 
            type="text" 
            value="${currentName}" 
            ${isLocked ? 'disabled' : ''}
            class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Ingresá tu nombre"
          />
          ${isLocked ? '<p class="text-xs text-yellow-500">Nombre bloqueado</p>' : ''}
        </div>
      `,
      position: "top",
      width: "400px",
      showConfirmButton: isLocked ? false : true,
      showCancelButton: true,
      showDenyButton: isLocked,
      confirmButtonText: isLocked ? "Cerrar" : "Guardar",
      cancelButtonText: "Cancelar",
      cancelButtonColor: isLocked ? "#09090b" : "#0000",
      denyButtonText: "Editar",
      background: '#27272a',
      color: '#f4f4f5',
      confirmButtonColor: '#09090b',
      denyButtonColor: '#eab308',
      backdrop: '#0007',
      preConfirm: () => {
        if (!isLocked) {
          const input = document.getElementById("userName") as HTMLInputElement;
          return input?.value;
        }
      },
      didOpen: () => {
        if (!isLocked) {
          const input = document.getElementById("userName") as HTMLInputElement;
          input?.focus();
        }
      },
      didClose: () => {
        if (!isLocked) {
          localStorage.setItem("userNameLocked", "true");
        }
      }
    });

    // Si apretó "Editar" (deny), desbloquear y reabrir
    if (result.isDenied) {
      localStorage.setItem("userNameLocked", "false");
      handleOpen();
      return;
    }

    // Si confirmó y no está bloqueado, guardar y bloquear
    if (result.isConfirmed && !isLocked && result.value) {
      localStorage.setItem("userName", result.value);
      localStorage.setItem("userNameLocked", "true");
      Swal.fire({
        title: "Nombre guardado",
        toast: true,
        theme: "dark",
        position: "top",
        timer: 1700,
        showConfirmButton: false,
      });
    }
  };

  return (
    <BsPersonCircle
      className="fixed size-8 right-0 mr-4 text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors"
      onClick={handleOpen}
    />
  );
}