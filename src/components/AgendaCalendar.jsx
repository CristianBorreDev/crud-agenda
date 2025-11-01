import React, { useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAgendaStore } from "../store/useAgendaStore";
import ModalAgenda from "./ModalAgenda";

export default function AgendaCalendar() {
  const { events, addEvent, updateEvent, deleteEvent } = useAgendaStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // --- Handlers ---
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleEventClick = (info) => {
    const event = events.find((e) => e.id === info.event.id);
    setSelectedEvent(event);
    setSelectedDate(event.date);
    setModalOpen(true);
  };

  const handleEventSubmit = (data) => {
    if (data.id) updateEvent(data);
    else addEvent({ ...data, id: Date.now().toString() });
    setModalOpen(false);
  };

  const handleEventDelete = (id) => deleteEvent(id);

  // --- Colores por fecha ---
  const getEventColor = (date) => {
    const eventDate = new Date(date);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "#6b7280"; // Pasado
    if (diffDays === 0) return "#ef4444"; // Hoy
    if (diffDays <= 3) return "#f59e0b"; // Próximos 3 días
    return "#14b8a6"; // Futuro
  };

  // --- Generar eventos formateados para FullCalendar ---
  const calendarEvents = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.date,
        extendedProps: { description: e.description },
        backgroundColor: getEventColor(e.date),
        borderColor: getEventColor(e.date),
      })),
    [events]
  );

  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Mi Agenda
            </h2>
            <p className="text-[var(--color-muted)] text-sm sm:text-base mt-1">
              Organiza tu tiempo de forma eficiente
            </p>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-2xl font-bold text-[var(--color-accent)]">
              {events.length}
            </div>
            <div className="text-sm text-[var(--color-muted)]">
              evento{events.length !== 1 ? "s" : ""} total
            </div>
          </div>
        </div>

        {/* Calendario */}
        <div className="custom-calendar-theme rounded-2xl overflow-hidden border border-[var(--color-muted)]/10 shadow-inner bg-[var(--color-bg)]">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "today dayGridMonth,dayGridWeek",
            }}
            firstDay={1}
            height="auto"
            dayMaxEvents={2}
            views={{
              dayGridMonth: { dayMaxEventRows: 3 },
              dayGridWeek: { dayMaxEventRows: 6 },
            }}
            eventDisplay="block"
            titleFormat={{ year: "numeric", month: "long" }}
            customButtons={{
              prev: { text: "‹", click: () => {} },
              next: { text: "›", click: () => {} },
            }}
          />
        </div>

        {/* Leyenda */}
        <div className="mt-6 flex flex-wrap gap-3 sm:gap-4 justify-center text-xs sm:text-sm">
          <Legend color="var(--color-error)" label="Hoy" />
          <Legend color="var(--color-warning)" label="Próximos 3 días" />
          <Legend color="var(--color-accent)" label="Futuro" />
          <Legend color="#6b7280" label="Pasado" />
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ModalAgenda
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleEventSubmit}
          onDelete={handleEventDelete}
          eventData={selectedEvent}
          date={selectedDate}
        />
      )}
    </>
  );
}

/* Pequeño componente para la leyenda */
function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full shadow-sm"
        style={{ backgroundColor: color }}
      ></div>
      <span className="text-[var(--color-muted)]">{label}</span>
    </div>
  );
}
