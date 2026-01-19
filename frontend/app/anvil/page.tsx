"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import StatusBadge from '@/app/components/ui/StatusBadge';
import BackButton from "../components/navbar/backButton";

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
      <BackButton />
      <div className="flex flex-col h-screen w-screen justify-center items-center">
        <h1 className="font-semibold text-xl items-center m-4">Anviles: {anvils.length}</h1>

        {anvils.map((anvil) => (
          <div key={anvil.id} className="flex flex-col bg-linear-to-tl from-zinc-900 to-zinc-800 ring-1 p-4 rounded-lg ring-zinc-600">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-center">{anvil.name}</h2>
              <span className="text-zinc-500 ml-12">{anvil.code}</span>
            </div>
            <div className="flex flex-row justify-between">
              <div>
                <h3 className="text-zinc-500 text-xs">Estado</h3>
                <StatusBadge status={anvil.status} />
              </div>
              <div>
                <h3 className="text-zinc-500 text-xs">Items dentro:</h3>
                <p className="text-right">{anvil.items_count}</p>
              </div>
            </div>


          </div>
        ))}
      </div>
    </div>
  );
}