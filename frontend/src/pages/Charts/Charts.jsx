import D3BarChart from "./components/D3BarChart";
import { Inbox, Users, User } from 'lucide-react';

export default function Charts() {
    return (
        <div className="flex relative flex-col items-center justify-center  w-full h-full gap-5">
            <div
                className="pointer-events-none w-full h-full z-0 absolute opacity-[0.4]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #9c9c9c 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                }}
            />
            <div className="w-max z-1 bg-white shadow-xl p-2 border-2 border-slate-100 rounded-2xl flex items-center justify-center">
                <D3BarChart />

            </div>
        </div>
    )
}