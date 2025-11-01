import { useState } from "react";
import AgendaCalendar from "./components/AgendaCalendar";
import ModalAgenda from "./components/ModalAgenda";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg)] via-[var(--color-surface)] to-[var(--color-bg)] p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <header className="text-center mb-2 pt-2">
          <h1 className="text-xl sm:text-3xl font-bold text-[var(--color-text)] mb-1 sm:mb-2 tracking-wide leading-snug">
            Cada cita tiene su tiempo y su espacio
          </h1>
          <p className="text-xs sm:text-base text-[var(--color-muted)]">
            Sistema funcional · Agenda visual y acción directa
          </p>
        </header>

        {/* Botón principal */}
        <div className="flex justify-center sm:justify-start mb-2">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative w-full sm:w-auto px-6 py-3 rounded-2xl 
                       bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] 
                       text-[var(--color-bg)] font-semibold text-sm sm:text-base 
                       shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 
                       flex items-center justify-center gap-2 active:scale-[0.97]"
          >
            <span>Nuevo Evento</span>
          </button>
        </div>

        {/* Calendario responsivo */}
        <div className="w-full overflow-hidden rounded-2xl shadow-inner bg-[var(--color-surface)] p-2 sm:p-4">
          <AgendaCalendar />
        </div>

        {/* Modal */}
        <ModalAgenda isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
