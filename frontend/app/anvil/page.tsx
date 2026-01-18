"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import StatusBadge from '@/app/components/ui/StatusBadge';

interface Anvil {
  id: number;
  code: string;
  name: string;
  status: string;
  image_url: string | null;
  notes: string | null;
  created_at: string;
  items_count: number;
}

export default function AnvilsPage() {
  const [anvils, setAnvils] = useState<Anvil[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnvils = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/anvils");
        setAnvils(data);
      } catch (error) {
        console.error("Error fetching anvils:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnvils();
  }, []);

  if (loading) return <p>Cargando anvils...</p>;

  return (
    <div>
      <h1>Anvils ({anvils.length})</h1>

      {anvils.map((anvil) => (
        <div key={anvil.id}>
          <h2>{anvil.name}</h2>
          <p>Código: {anvil.code}</p>
          <p>Estado: <StatusBadge status={anvil.status}/></p>
          <p>Items dentro: {anvil.items_count}</p>
          <p>Notas: {anvil.notes || "Sin notas"}</p>
        </div>
      ))}
    </div>
  );
}