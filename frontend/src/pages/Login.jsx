import { useDispatch } from "react-redux";
import { useState } from "react";
import { login } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

const isValidEmail = (str) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

export default function Login() {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uiError, setUiError] = useState(null);

  const dispatch = useDispatch();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setUiError(null);


    if (!isValidEmail(email)) {
      setUiError("Por favor ingresa un email válido (ej: nombre@dominio.com).");
      return;
    }
 
    if (password.length < 6) {
      setUiError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setSubmitting(true);
    const res = await dispatch(login({ email, password }));
    setSubmitting(false);

    if (res.meta.requestStatus === "fulfilled") {
      nav("/");
    } else {
      
      setUiError(
        res.payload && typeof res.payload === "string"
          ? res.payload
          : "Credenciales inválidas"
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="pointer-events-none absolute -top-32 -left-20 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-16 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5h6M9 3h6a2 2 0 0 1 2 2v2H7V5a2 2 0 0 1 2-2z" />
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7z" />
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m9 14 2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Mini Tasker</h1>
            <p className="mt-1 text-sm text-gray-500">Entra para gestionar tus tareas</p>
          </div>

          <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
            {uiError && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {uiError}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4" noValidate>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <input
                    className="input pr-10"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    title="Debe tener el formato nombre@dominio.com"
                    required
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                      viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.94 6.34A2 2 0 0 1 4.5 5h11a2 2 0 0 1 1.56.76l-7.06 4.41L2.94 6.34Z" />
                      <path d="M18 8.12v5.38A2.5 2.5 0 0 1 15.5 16h-11A2.5 2.5 0 0 1 2 13.5V8.12l6.9 4.31a2 2 0 0 0 2.2 0L18 8.12Z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    className="input pr-24"
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute inset-y-0 right-2 my-1 inline-flex items-center rounded-lg px-2 text-sm text-gray-600 hover:bg-gray-100"
                    title={show ? "Ocultar" : "Mostrar"}
                  >
                    {show ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres.</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full disabled:opacity-70"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"/>
                    </svg>
                    Entrando…
                  </span>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>


            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-gray-500">¿No tienes cuenta?</span>
              <Link to="/register" className="font-medium text-blue-700 hover:underline">
                Crear una
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Al continuar aceptas nuestros términos y política de privacidad.
          </p>
        </div>
      </div>
    </div>
  );
}
