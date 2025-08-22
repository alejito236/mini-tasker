import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/client";

export const login = createAsyncThunk("auth/login", async (payload) => {
  const { data } = await api.post("/api/login", payload);
  localStorage.setItem("token", data.token);
  return data.token;
});
export const registerUser = createAsyncThunk("auth/register", async (payload) => {
  await api.post("/api/register", payload);
});

const slice = createSlice({
  name: "auth",
  initialState: { token: localStorage.getItem("token") || null, status: "idle", error: null },
  reducers: {
    logout: (s) => { s.token = null; localStorage.removeItem("token"); }
  },
  extraReducers: (b) => {
    b.addCase(login.fulfilled, (s, a) => { s.token = a.payload; s.error = null; });
    b.addCase(login.rejected, (s, a) => { s.error = a.error.message; });
    b.addCase(registerUser.rejected, (s, a) => { s.error = a.error.message; });
  }
});
export const { logout } = slice.actions;
export default slice.reducer;
