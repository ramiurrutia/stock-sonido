import {BsQrCodeScan, BsBoxSeam, BsSearch} from "react-icons/bs";

export default function Button({ textButton, onClick}: { textButton: string, onClick: () => void}) {
    let buttonSVG = <></>

    switch (textButton) {
        case "Escanear":
            buttonSVG = <BsQrCodeScan className="size-10 mb-2" />
            break;
        case "Anviles":
            buttonSVG = <BsBoxSeam className="size-10 mb-2" />
            break;
        case "Buscar":
            buttonSVG = <BsSearch className="size-10 mb-2" />
            break;
    }

    return <button onClick={onClick} className={`text-sm min-h-36 min-w-36 flex flex-col items-center justify-center rounded-lg transition-all text-zinc-200 bg-linear-to-tl from-zinc-900 to-zinc-800 hover:bg-zinc-50/10 active:bg-zinc-100/15 ring ring-zinc-600`}>
        {buttonSVG}{textButton}
    </button>
}