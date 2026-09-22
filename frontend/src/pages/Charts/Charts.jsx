import D3BarChart from "./components/D3BarChart";
import { Wrench } from 'lucide-react';

export default function Charts() {
    return (
        <div className="w-full h-full flex text-gray-400 flex-col items-center justify-center gap-5 p-5">
            <Wrench width={200} height={200} />
            <h1>Em Desenvolvimento. Volte mais tarde!</h1>
        </div>
    )
}