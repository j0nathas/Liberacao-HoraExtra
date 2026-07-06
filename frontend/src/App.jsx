import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import Form from './pages/Form/Form.jsx'
import DocumentPDF from './PDF/DocumentPDF.jsx'
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useState } from 'react'
import HomeIcon from '../img/home.svg?react'
import FormIcon from '../img/form.svg?react'
import MenuIcon from '../img/menu.svg?react'
import CloseIcon from '../img/close.svg?react'
import ProfileIcon from '../img/profile.svg?react'
import ClockIcon from '../img/clock.svg?react'

const btnMenu = [
  { name: "Home", path: "/home", icon: <HomeIcon width={35} height={35} />, element: Home },
  { name: "Form", path: "/form", icon: <FormIcon width={35} height={35} />, element: Form },
  { name: "Document", path: "/document", icon: <FormIcon width={35} height={35} />, element: <PDFViewer width="100%" height="800"><DocumentPDF /></PDFViewer> },
  /* { name: Chart, path: "/Chart", icon: "", element: Chart } */
]

// ... imports
export default function App() {
  const navigate = useNavigate();
  const [hamburguer, setHamburguer] = useState(false);

  return (
    <>
      <header className='w-full flex items-center justify-between p-4 shadow-sm bg-white relative'>

        <div className='flex items-center gap-2 text-sm'>
          <button onClick={() => setHamburguer(!hamburguer)} className={`bg-gray-100 shadow-2xs rounded-sm p-2 transition-all active:bg-blue-300 ${hamburguer ? 'text-red-400 bg-red-200' : 'text-black'}`}>
            {hamburguer ? <CloseIcon width={28} height={28} /> : <MenuIcon width={28} height={28} />}
          </button>
        </div>

        {hamburguer && (
          <div className='absolute top-full z-10 left-0 flex-col justify-center items-center w-5/12 bg-white rounded-b-lg gap-5 overflow-hidden shadow-xl'>
            {btnMenu.map((btn) => (
              <button key={btn.path} onClick={() => navigate(btn.path)} className='flex items-center gap-2 bg-white w-full border-b-1 p-2 text-gray-500 border-gray-200 transition hover:bg-gray-100 active:bg-blue-100 active:text-blue-500'>
                {btn.icon}{btn.name}
              </button>
            ))}
          </div>
        )}

        <div className='bg-blue-50 p-2 rounded-full'><ClockIcon width={45} height={45} /></div>

        <section className=' w-[48px] h-[48px] bg-gray-200 rounded-full flex justify-center items-center overflow-hidden text-gray-400'>
          <ProfileIcon width={30} height={30} />
        </section>

      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        {btnMenu.map((btn) => (
          <Route
            key={btn.path}
            path={btn.path}
            element={btn.path === "/document" ? btn.element : <btn.element />}
          />
        ))}
      </Routes>
    </>
  )
}