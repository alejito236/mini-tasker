import { useEffect, useState } from "react";

const EMPTY = { title: "", description: "", status: "pending" };

export default function TaskForm({ onSubmit, initialValues, submitText }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title ?? "",
        description: initialValues.description ?? "",
        status: initialValues.status ?? "pending",
      });
    } else {
      setForm(EMPTY);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description?.trim() || "",
        status: form.status,
      });
      if (!initialValues) setForm(EMPTY); 
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="label">Título</label>
        <input
          className="input"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ej. Preparar demo"
          required
        />
      </div>

      <div>
        <label className="label">Descripción</label>
        <input
          className="input"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Opcional"
        />
      </div>

      <div>
        <label className="label">Estado</label>
        <select
          className="select"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="pending">pending</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </select>
      </div>

      <button
        className="btn btn-primary w-full disabled:opacity-60"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Guardando…" : (submitText || (initialValues ? "Guardar cambios" : "Crear tarea"))}
      </button>
    </form>
  );
}
