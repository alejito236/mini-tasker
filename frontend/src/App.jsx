import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "./store";
import GuardedRoute from "./components/GuardedRoute";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/" element={<GuardedRoute><Tasks/></GuardedRoute>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
