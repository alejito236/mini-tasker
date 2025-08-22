import { useDispatch } from "react-redux";
import { useState } from "react";
import { registerUser, login } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const r = await dispatch(registerUser({ email, password }));
    if (r.meta.requestStatus === "fulfilled") {
      await dispatch(login({ email, password }));
      nav("/");
    }
    setSubmitting(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
    
      <div className="pointer-events-none absolute -top-32 -left-20 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-16 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
        <div className="w-full max-w-md">
       
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
          
              <svg xmlns="http://www.w3.org/2000/svg"
                   width="24" height="24" className="h-6 w-6"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c3.866 0 7 1.79 7 4v2H5v-2c0-2.21 3.134-4 7-4Zm0-2a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm7 1v-2m-1 1h2" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Crear cuenta</h1>
            <p className="mt-1 text-sm text-gray-500">Regístrate para comenzar</p>
          </div>

        
          <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <input
                    className="input pr-10"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="20" height="20" className="h-5 w-5"
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
                    <svg className="h-4 w-4 animate-spin" width="16" height="16" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"/>
                    </svg>
                    Creando…
                  </span>
                ) : (
                  "Crear cuenta"
                )}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-gray-500">¿Ya tienes cuenta?</span>
              <Link to="/login" className="font-medium text-blue-700 hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Al registrarte aceptas nuestros términos y política de privacidad.
          </p>
        </div>
      </div>
    </div>
  );
}
