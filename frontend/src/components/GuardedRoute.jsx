import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
export default function GuardedRoute({ children }) {
  const token = useSelector(s => s.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
