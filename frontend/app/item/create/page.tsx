"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import BackButton from "@/app/components/navbar/backButton";
import NavBar from "@/app/components/navbar/navBar";

const categories = [
  "Cable",
  "Consola",
  "Microfono",
  "Parlante",
  "Potencia",
  "Tripode",
  "Electricidad",
  "Accesorio",
  "Anvil",
];

const statuses = ["Guardado", "En uso", "Enviado", "Baja"];

export default function CreateItemPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const canCreate = session?.user?.permissions?.includes("item.create");

  const [form, setForm] = useState({
    code: "",
    name: "",
    category: "Accesorio",
    status: "Guardado",
    image_url: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!session?.user?.accessToken || saving) return;

    if (!form.code.trim() || !form.name.trim()) {
      Swal.fire({
        title: "Faltan datos",
        text: "Codigo y nombre son obligatorios",
        icon: "warning",
        theme: "dark",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          code: form.code.trim(),
          name: form.name.trim(),
          category: form.category,
          status: form.status,
          image_url: form.image_url.trim() || null,
          notes: form.notes.trim() || null,
        }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error || "No se pudo crear el item");

      await Swal.fire({
        title: "Item creado",
        text: payload?.code || form.code.trim(),
        icon: "success",
        theme: "dark",
        timer: 1300,
        showConfirmButton: false,
      });

      router.push(`/item/${payload.code || form.code.trim()}`);
    } catch (error) {
      Swal.fire({
        title: "Error al crear item",
        text: error instanceof Error ? error.message : "Error inesperado",
        icon: "error",
        theme: "dark",
      });
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") return null;

  if (!canCreate) {
    return (
      <main className="min-h-screen w-full p-4 flex items-center justify-center text-zinc-200">
        <BackButton />
        <p className="text-zinc-400">No tienes permiso para crear items.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full p-4 pt-20 pb-8 flex justify-center text-zinc-200">
      <BackButton />
      <NavBar />
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 h-fit"
      >
        <h1 className="text-lg font-semibold mb-4">Crear Item</h1>

        <label className="text-xs text-zinc-400">Codigo *</label>
        <input
          value={form.code}
          onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
          className="w-full mt-1 mb-3 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm"
          placeholder="EJ: MICR-0012"
        />

        <label className="text-xs text-zinc-400">Nombre *</label>
        <input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full mt-1 mb-3 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm"
          placeholder="Nombre del item"
        />

        <label className="text-xs text-zinc-400">Categoria *</label>
        <select
          value={form.category}
          onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          className="w-full mt-1 mb-3 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label className="text-xs text-zinc-400">Estado</label>
        <select
          value={form.status}
          onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
          className="w-full mt-1 mb-3 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm"
        >
          {statuses.map((statusItem) => (
            <option key={statusItem} value={statusItem}>
              {statusItem}
            </option>
          ))}
        </select>

        <label className="text-xs text-zinc-400">URL de imagen</label>
        <input
          value={form.image_url}
          onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
          className="w-full mt-1 mb-3 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm"
          placeholder="/assets/item.png"
        />

        <label className="text-xs text-zinc-400">Notas</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          className="w-full mt-1 mb-4 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm min-h-24"
          placeholder="Notas opcionales"
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-zinc-200 text-zinc-900 py-2 font-medium hover:bg-zinc-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Creando..." : "Crear item"}
        </button>
      </form>
    </main>
  );
}

