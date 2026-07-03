import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-8 py-12 mx-auto font-sans bg-white">

      <header className="flex flex-col items-center text-center gap-6">
        <h1 className="text-[32px] md:text-5xl font-bold text-blue-900 leading-tight">
          404 — Página não encontrada
        </h1>

        <img
          src="/img/NotFound_img.avif"
          width={350}
          alt="Página não encontrada"
          className=""
        />

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-light text-blue-400 leading-tight">
            Parece que você se perdeu...
          </h2>
          <h2 className="text-xl md:text-2xl font-light text-blue-300 leading-tight">
            Vamos voltar?
          </h2>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-4 px-10 py-4 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          Voltar para o Início
        </button>
      </header>

    </main>
  );
}