import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
import tasks from "./tasksSlice";
export default configureStore({ reducer: { auth, tasks } });
