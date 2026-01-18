export default function StatusBadge({ status }: { status: string }) {

    let colorBadge = ""

    switch (status) {
        case "Guardado":
            colorBadge = "text-emerald-200 bg-emerald-500/15 ring-emerald-500/80"
            break;
        case "En uso":
            colorBadge = "text-amber-200 bg-amber-300/15 ring-amber-300/80"
            break;
        case "Enviado":
            colorBadge = "text-sky-200 bg-sky-600/15 ring-sky-600/80"
            break;
        case "Baja":
            colorBadge = "text-red-300 bg-red-600/15 ring-red-400/60"
            break;
    }
    return (<span className={`inline-flex items-center px-2 py-1 ring-1 ring-inset text-sm font-medium rounded ${colorBadge}`}>{(status)}</span>)
}