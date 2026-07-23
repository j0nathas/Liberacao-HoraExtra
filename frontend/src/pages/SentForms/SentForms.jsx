import { useState } from 'react';
import Card from './components/Card'
import Header from './components/Header'
import CardInfo from './components/CardInfo';

const status = true;

export default function SentForms() {
    const [InfoOpen, setInfoOpen] = useState(false);

    const handleInfoOpen = () => {
        setInfoOpen(true)
    }

    const handleInfoClose = () => {
        setInfoOpen(false)
    }


    return (
        <>
            <main className='flex w-[100%] h-[100%] flex-col relative'>
                <Header />

                <div className='grid auto-rows-max md:grid-cols-2 md:gap-4 p-2 h-full bg-linear-to-b from-blue-100 to-purple-100 w-full'>
                    <Card status={status} openInfo={handleInfoOpen} />
                    <Card status={false} openInfo={handleInfoOpen} />
                </div>

                {InfoOpen && (
                    <CardInfo closeInfo={handleInfoClose} />
                )}
            </main>
        </>
    )
}