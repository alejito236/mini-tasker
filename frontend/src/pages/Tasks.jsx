import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, createTask, updateTask, setFilter } from "../store/tasksSlice";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Navbar from "../components/Navbar";

export default function Tasks() {
  const dispatch = useDispatch();
  const { items, filter } = useSelector((s) => s.tasks);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks(filter || undefined));
  }, [dispatch, filter]);

  const onCreate = async (payload) => {
    await dispatch(createTask(payload));
  };

  const onSave = async (changes) => {
    await dispatch(updateTask({ id: editing.id, changes }));
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-6">
        <Navbar />

        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="page-title">Mis tareas</h1>
          <div className="flex items-center gap-3">
            <label className="label mb-0">Filtrar</label>
            <select
              className="select w-48"
              value={filter}
              onChange={(e) => dispatch(setFilter(e.target.value))}
            >
              <option value="">Todas</option>
              <option value="pending">pending</option>
              <option value="in_progress">in_progress</option>
              <option value="done">done</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="card">
              {editing ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Editar tarea</h2>
                    <button
                      className="btn btn-outline"
                      onClick={() => setEditing(null)}
                      type="button"
                    >
                      Cancelar
                    </button>
                  </div>
                  <TaskForm
                    key={editing?.id ?? "editing"}
                    onSubmit={onSave}
                    initialValues={editing}
                    submitText="Guardar cambios"
                  />
                </>
              ) : (
                <>
                  <h2 className="mb-4 text-lg font-semibold">Nueva tarea</h2>
                  <TaskForm
                    key="create"
                    onSubmit={onCreate}
                    submitText="Crear tarea"
                  />
                </>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Consejo: usa estados <strong>pending</strong>, <strong>in_progress</strong> o{" "}
              <strong>done</strong> para organizarte mejor.
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="card">
              {(!items || items.length === 0) ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gray-100 p-2">
                    <svg
                      className="h-full w-full text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M8 8h8" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Aún no tienes tareas.</p>
                  <p className="text-sm text-gray-500">Crea tu primera desde el formulario.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <TaskList
                    tasks={items.map((t) => ({
                      ...t,
                      _badgeClass:
                        t.status === "done"
                          ? "bg-green-100 text-green-700"
                          : t.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700",
                    }))}
                    onEdit={setEditing}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
