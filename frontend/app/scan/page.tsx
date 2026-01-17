import QrScanner from "./components/qrScanner";
import BackButton from "../components/backButton";

export default function ScanPage() {

  return (
      <div className="flex flex-row items-center justify-center ">
      <div className= "w-screen h-screen p-6 flex flex-col justify-center items-center">
        <BackButton />
        <QrScanner/>
      </div>
    </div>
  );
}
