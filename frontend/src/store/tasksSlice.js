import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/client";

export const fetchTasks = createAsyncThunk("tasks/fetch", async (status) => {
  const url = status ? `/api/tasks?status=${status}` : "/api/tasks";
  const { data } = await api.get(url);
  return data;
});
export const createTask = createAsyncThunk("tasks/create", async (payload) => {
  const { data } = await api.post("/api/tasks", payload);
  return { id: data.id, ...payload };
});
export const updateTask = createAsyncThunk("tasks/update", async ({ id, changes }) => {
  await api.put(`/api/tasks/${id}`, changes);
  return { id, changes };
});

const slice = createSlice({
  name: "tasks",
  initialState: { items: [], status: "idle", error: null, filter: "" },
  reducers: { setFilter: (s, a) => { s.filter = a.payload; } },
  extraReducers: (b) => {
    b.addCase(fetchTasks.fulfilled, (s, a) => { s.items = a.payload; s.status = "succeeded"; });
    b.addCase(createTask.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(updateTask.fulfilled, (s, a) => {
      const i = s.items.findIndex(t => t.id === a.payload.id);
      if (i >= 0) s.items[i] = { ...s.items[i], ...a.payload.changes };
    });
  }
});
export const { setFilter } = slice.actions;
export default slice.reducer;
