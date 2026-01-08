import axios from "axios";
import Image from "next/image";
import { StatusBadge } from "@/app/components/badges/StatusBadge";
import ItemsActions from "./itemsActions"

export default async function ItemPage({ params, }: { params: Promise<{ code: string }>; }) {

    const code = (await params).code;

    const itemData = await axios.get(`http://localhost:4000/items/${code}`);

    const data = itemData.data;

    return (
        <main className="flex flex-col items-center justify-center">
            <div className="flex flex-col bg-slate-900 m-4 rounded-lg p-4 max-h-xl max-w-xl">
                {data.imageUrl ? <Image src={data.imageUrl} alt={data.name} className="rounded-lg" /> : <p className="text-center">Imagen no encontrada</p>}
                <div className="text-center border-b border-gray-400/80 p-2 mb-1">
                    <h2 className="font-bold text-xl text-gray-200">{data.name}</h2>
                    <p className="font-medium text-sm text-gray-400 tracking-wider">{data.code}</p>
                </div>
                <h3 className="text-sm text-gray-400 mt-3 mb-1">Categoria</h3>
                <p className="text-xl text-gray-200">{data.category}</p>
                <h3 className="text-sm text-gray-400 mt-3 mb-1">Estado</h3>
                <p><StatusBadge status={data.status} /></p>
                <h3 className="text-sm text-gray-400 mt-3 mb-1">Notas</h3>
                <p className="text-gray-200">{data.notes}</p>
                
            </div>
            <ItemsActions code={data.code} currentStatus={data.status} />
        </main>
    );
} 