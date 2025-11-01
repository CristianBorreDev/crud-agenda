import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X } from "lucide-react";

function toDateInputValue(input) {
  if (!input) {
    return new Date().toISOString().split("T")[0];
  }

  if (input instanceof Date) {
    return input.toISOString().split("T")[0];
  }

  if (typeof input === "string") {
    if (input.includes("T")) {
      return input.split("T")[0];
    }
    const parsed = new Date(input);
    if (!isNaN(parsed)) {
      return parsed.toISOString().split("T")[0];
    }
  }

  return new Date().toISOString().split("T")[0];
}

function toTimeValue(input, defaultTime = "09:00") {
  if (!input) return defaultTime;
  if (typeof input === "string") {
    if (input.includes("T")) {
      const [, timePart] = input.split("T");
      return timePart.slice(0, 5);
    }
    if (/^\d{2}:\d{2}$/.test(input)) return input;
    if (/^\d{2}:\d{2}:\d{2}$/.test(input)) return input.slice(0, 5);
    const parsed = new Date(input);
    if (!isNaN(parsed)) {
      return parsed.toTimeString().slice(0, 5);
    }
  }
  if (input instanceof Date) {
    return input.toTimeString().slice(0, 5);
  }
  return defaultTime;
}

export default function ModalAgenda({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  eventData,
  date,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: toDateInputValue(date),
    time: "09:00",
  });
  const [errors, setErrors] = useState({});
  const modalRef = useRef();

  useEffect(() => {
    
    if (eventData) {
      const normalizedDate = toDateInputValue(eventData.date || date);
      const normalizedTime = toTimeValue(
        eventData.time || eventData.date || date || "09:00"
      );

      setFormData({
        ...eventData,
        date: normalizedDate,
        time: normalizedTime,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: toDateInputValue(date),
        time: toTimeValue(date, "09:00"),
      });
    }
    setErrors({});
  }, [eventData, date]);

  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && onClose();

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "El título es requerido";
    if (!formData.date) newErrors.date = "La fecha es requerida";

    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    if (selectedDateTime < new Date()) {
      newErrors.date = "No puedes programar eventos en el pasado";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit({
      ...formData,
      date: `${formData.date}T${formData.time}`,
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "¿Eliminar evento?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-error)",
      cancelButtonColor: "var(--color-muted)",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "var(--color-surface)",
      color: "var(--color-text)",
      customClass: { popup: "rounded-3xl" },
    }).then((result) => {
      if (result.isConfirmed && formData.id) {
        onDelete(formData.id);
        onClose();
        Swal.fire({
          title: "¡Eliminado!",
          text: "El evento ha sido eliminado",
          icon: "success",
          confirmButtonColor: "var(--color-accent)",
          background: "var(--color-surface)",
          color: "var(--color-text)",
          customClass: { popup: "rounded-3xl" },
        });
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-[var(--color-surface)] rounded-3xl p-8 w-full max-w-md mx-4 shadow-[0_0_25px_rgba(0,0,0,0.4)] border border-[var(--color-muted)]/20 flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--color-accent)]" />
                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                  {formData.id ? "Editar Evento" : "Nuevo Evento"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--color-surface-hover)] transition-colors duration-200"
              >
                <X className="w-5 h-5 text-[var(--color-muted)]" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="¿Qué planeas hacer?"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-4 rounded-xl bg-[var(--color-bg)] text-[var(--color-text)] placeholder-gray-500 focus:outline-none shadow-inner focus:shadow-[0_0_0_2px_var(--color-accent)] transition-all ${
                    errors.title
                      ? "border border-[var(--color-error)]"
                      : "border border-[var(--color-muted)]/20"
                  }`}
                />
                {errors.title && (
                  <p className="text-[var(--color-error)] text-sm mt-2">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  placeholder="Detalles adicionales (opcional)"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-4 rounded-xl bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-muted)]/20 placeholder-gray-500 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-accent)] transition-all resize-none"
                />
              </div>

              {/* Fecha y hora */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full p-4 rounded-xl bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none transition-all ${
                      errors.date
                        ? "border border-[var(--color-error)]"
                        : "border border-[var(--color-muted)]/20 focus:shadow-[0_0_0_2px_var(--color-accent)]"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">
                    Hora
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-muted)]/20 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-accent)] transition-all"
                  />
                </div>
              </div>
              {errors.date && (
                <p className="text-[var(--color-error)] text-sm">
                  {errors.date}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-5 border-t border-[var(--color-muted)]/20">
              {formData.id && (
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 rounded-xl bg-[var(--color-error)] text-white hover:bg-[var(--color-error-hover)] transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Eliminar
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-[var(--color-muted)]/10 text-[var(--color-text)] hover:bg-[var(--color-muted)]/20 transition-all font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] text-white shadow-md hover:shadow-lg hover:brightness-110 transition-all font-medium"
              >
                {formData.id ? "Actualizar" : "Crear Evento"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
