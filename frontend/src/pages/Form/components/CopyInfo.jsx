import { useEffect, useState } from 'react';
import { Copy, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CopyInfo({ isMinimized, setIsMinimized, currentForm, onClose, onCopy, duration = 8000 }) {
    const [progress, setProgress] = useState(100);
    const [barraVisivel, setBarraVisivel] = useState(true);

    const fecharGuia = () => {
        setIsMinimized(true);
        setBarraVisivel(false);
    }

    useEffect(() => {
        if (isMinimized) return;

        setProgress(100);
        const frame = requestAnimationFrame(() => setProgress(0));

        const timer = setTimeout(() => {
            fecharGuia()
        }, duration);

        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(timer);
        };
    }, [isMinimized, duration]);

    return (
        <AnimatePresence mode="wait">
            {isMinimized ? (
                <motion.nav
                    key="minimized"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={() => setIsMinimized(false)}
                    title="Copiar solicitação anterior"
                    className="flex items-center gap-1.5 hover:text-blue-300 text-blue-600 rounded-full cursor-pointer group"
                >
                    <Copy size={16} />
                </motion.nav>
            ) : (
                <motion.aside
                    key="expanded"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-0 lg:right-[8%] lg:top-7 w-56 p-4 border shadow-2xl rounded-2xl lg:rounded-[0px_10px_10px_10px] lg:translate-x-[100%] z-10 bg-white border-gray-200"
                >
                    <div className="flex gap-2.5 pr-1">
                        <div className="bg-blue-50 text-blue-600 p-1.5 rounded-md h-fit shrink-0">
                            <Copy size={14} />
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold text-gray-900 leading-tight">
                                Copiar última solicitação?
                            </h3>
                            <p className="text-[11px] hidden md:block text-gray-500 mt-0.5 leading-tight">
                                Reutilize as informações da solicitação anterior.
                            </p>
                        </div>
                    </div>

                    <div className="mt-2.5 flex justify-center gap-4">
                        <nav
                            onClick={() => fecharGuia()}
                            role="close"
                            className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-all hover:scale-110 shadow-xs cursor-pointer"
                        >
                            <X size={14} />
                        </nav>
                        <nav
                            onClick={() => onCopy(currentForm)}
                            role="copy"
                            className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-full hover:scale-110 transition-all shadow-xs cursor-pointer"
                        >
                            <Check size={14} />
                        </nav>
                    </div>

                    {
                        barraVisivel && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[90%] h-1 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                    className="h-full bg-blue-200 transition-all ease-linear"
                                    style={{
                                        width: `${progress}%`,
                                        transitionDuration: `${duration}ms`
                                    }}
                                />
                            </div>
                        )
                    }

                </motion.aside>
            )}
        </AnimatePresence>
    );
}