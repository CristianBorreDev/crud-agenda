import { useState } from "react";
import AgendaCalendar from "./components/AgendaCalendar";
import ModalAgenda from "./components/ModalAgenda";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg)] via-[var(--color-surface)] to-[var(--color-bg)] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Mejorado */}
        <header className="text-center mb-2 pt-2">
           <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-2 tracking-wide">
            Cada cita tiene su tiempo y su espacio
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-muted)]">
            Sistema funcional · Agenda visual y acción directa
          </p>
        </header>

        {/* Botón Principal Mejorado */}
        <div className="flex justify-start mb-2">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative px-6 cursor-pointer py-2 rounded-2xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] text-[var(--color-bg)] font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            Nuevo Evento
          </button>
        </div>

        {/* Calendario */}
        <AgendaCalendar />

        {/* Modal */}
        <ModalAgenda isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
}