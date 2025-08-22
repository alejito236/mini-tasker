export default function TaskList({ tasks = [], onEdit }) {
  if (!tasks?.length) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gray-100 p-2">
          <svg className="h-full w-full text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M8 8h8" />
          </svg>
        </div>
        <p className="text-gray-600">No hay tareas</p>
        <p className="text-sm text-gray-500">Crea una nueva desde el formulario.</p>
      </div>
    );
  }

  const badgeClass = (status) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-700 ring-1 ring-green-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 ring-1 ring-gray-200";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="hidden grid-cols-12 gap-4 border-b bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 sm:grid">
        <div className="col-span-6">Tarea</div>
        <div className="col-span-3">Estado</div>
        <div className="col-span-3 text-right">Acciones</div>
      </div>

      <ul className="divide-y">
        {tasks.map((t) => (
          <li key={t.id} className="px-4 py-4">
            <div className="grid grid-cols-12 items-center gap-3">
              <div className="col-span-12 sm:col-span-6">
                <div className="font-semibold text-gray-900">{t.title}</div>
                {t.description && (
                  <div className="mt-0.5 text-sm text-gray-500 line-clamp-2">{t.description}</div>
                )}
              </div>

              <div className="col-span-6 mt-2 sm:col-span-3 sm:mt-0">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${badgeClass(t.status)}`}>
                  {t.status.replace("_", " ")}
                </span>
              </div>

              <div className="col-span-6 sm:col-span-3 sm:text-right">
                <button
                  className="btn btn-outline"
                  onClick={() => onEdit?.(t)}
                >
                  Editar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
