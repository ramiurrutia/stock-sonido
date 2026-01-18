import axios from "axios";
import Image from "next/image";
import StatusBadge from "../../components/ui/StatusBadge";
import ItemsActions from "./components/itemsActions"
import BackButton from "@/app/components/backButton";
import NavBar from '@/app/components/navBar'

export default async function ItemPage({ params, }: { params: Promise<{ code: string }>; }) {

    const { code } = await params;

    const itemData = await axios.get(`http://localhost:4000/items/${code}`);

    const data = itemData.data;

    return (
        <main className="flex flex-col items-center justify-center p-6 h-screen w-screen">
            <BackButton />
            <NavBar />
            <div className="">
            <div className="flex flex-col rounded-lg p-4 bg-linear-to-tl from-zinc-900 to-zinc-800 ring ring-zinc-600 mb-4">
                {data.imageUrl ? <Image src={data.imageUrl} alt={data.name} className="rounded-lg" /> : <p className="text-center">Imagen no encontrada</p>}
                <div className="text-center border-b border-zinc-400/80 p-2 mb-1">
                    <h2 className="font-bold text-lg text-zinc-200">{data.name}</h2>
                    <p className="font-medium text-sm text-zinc-400 tracking-wider">{data.code}</p>
                </div>
                <h3 className="text-sm text-zinc-400 mt-3 mb-1">Categoria</h3>
                <p className="text-zinc-200">{data.category}</p>
                <h3 className="text-sm text-zinc-400 mt-3 mb-1">Estado</h3>
                <p><StatusBadge status={data.status} /></p>
                <h3 className="text-sm text-zinc-400 mt-3 mb-1">Notas</h3>
                <p className="text-zinc-200">{data.notes}</p>
                
            </div>
            <ItemsActions code={data.code} currentStatus={data.status} />
            </div>
        </main>
    );
} 