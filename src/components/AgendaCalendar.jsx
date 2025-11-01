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

  const handleEventDelete = (id) => deleteEvent(id);

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
      <div className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-hover)] rounded-3xl shadow-2xl p-6 border border-white/10 backdrop-blur-sm">
        {/* Header Mejorado */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-text)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Mi Agenda
            </h2>
            <p className="text-[var(--color-muted)] mt-2">
              Organiza tu tiempo de forma eficiente
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[var(--color-accent)]">
              {events.length}
            </div>
            <div className="text-sm text-[var(--color-muted)]">
              evento{events.length !== 1 ? "s" : ""} total
            </div>
          </div>
        </div>

        {/* Calendario Personalizado */}
        <div className="custom-calendar-theme">
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
            dayMaxEvents={3}
            views={{
              dayGridMonth: { dayMaxEventRows: 3 },
              dayGridWeek: { dayMaxEventRows: 6 },
            }}
            eventDisplay="block"
            titleFormat={{ year: "numeric", month: "long" }}
            customButtons={{
              prev: {
                text: "‹",
                click: function () {
                  // Navigate to previous month
                },
              },
              next: {
                text: "›",
                click: function () {
                  // Navigate to next month
                },
              },
            }}
          />
        </div>

        {/* Leyenda de Eventos */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--color-error)]"></div>
            <span className="text-[var(--color-muted)]">Hoy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--color-warning)]"></div>
            <span className="text-[var(--color-muted)]">Próximos 3 días</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--color-accent)]"></div>
            <span className="text-[var(--color-muted)]">Futuro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-[var(--color-muted)]">Pasado</span>
          </div>
        </div>
      </div>
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
