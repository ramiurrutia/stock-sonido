import StatusBadge from '@/app/components/ui/StatusBadge';
import BackButton from "../components/navbar/backButton";
import Link from 'next/link';
import { BsLink45Deg } from 'react-icons/bs';

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

async function getAnvils() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anvils`, { cache: 'no-store' });
  
  if (!res.ok) {
    throw new Error('Error al cargar los anviles');
  }
  
  return res.json();
}

export default async function AnvilsPage() {
  const anvils: Anvil[] = await getAnvils();

  return (
    <div>
      <BackButton />
      <div className="flex flex-col min-h-screen min-w-screen justify-center items-center">
        <h1 className="font-semibold text-xl items-center m-4">
          Anviles: {anvils.length}
        </h1>

        {anvils.map((anvil) => (
          <Link 
            href={`/anvil/${anvil.code}`}
            key={anvil.id} 
            className="flex flex-col bg-linear-to-tl from-zinc-900 to-zinc-800 ring-1 p-4 rounded-lg ring-zinc-600 mb-4 w-90"
          >
            <div className="flex flex-row justify-between items-center mb-1 border-b border-zinc-600">
              <h2 className="text-center flex flex-row underline underline-offset-2">{anvil.name}<BsLink45Deg className="size-6 ml-1" /></h2>
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
          </Link>
        ))}
      </div>
    </div>
  );
}