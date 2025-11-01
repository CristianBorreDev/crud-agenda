import { create } from "zustand";

export const useAgendaStore = create((set, get) => ({
  events: JSON.parse(localStorage.getItem("agendaData")) || [],

  addEvent: (event) => {
    const newEvents = [...get().events, event];
    set({ events: newEvents });
    localStorage.setItem("agendaData", JSON.stringify(newEvents));
  },

  updateEvent: (updatedEvent) => {
    const newEvents = get().events.map((e) =>
      e.id === updatedEvent.id ? updatedEvent : e
    );
    set({ events: newEvents });
    localStorage.setItem("agendaData", JSON.stringify(newEvents));
  },

  deleteEvent: (id) => {
    const newEvents = get().events.filter((e) => e.id !== id);
    set({ events: newEvents });
    localStorage.setItem("agendaData", JSON.stringify(newEvents));
  },
}));
