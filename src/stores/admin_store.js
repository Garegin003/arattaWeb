import { create } from "zustand";
import axios from "axios";
import { ENDPOINTS } from "./endpoints.js";

const authStore = create((set, get) => ({
  token: "",
  isAuthenticated: false,
  loading: false,
  error: null,

  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (error) => set({ error }),

  setToken: (token) => {
    localStorage.setItem("access_token", token);
    set({ token, isAuthenticated: true });
  },

  fetchToken: () => {
    const localToken = localStorage.getItem("access_token");
    if (localToken) {
      set({ token: localToken, isAuthenticated: true });
      return localToken;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    set({ token: "", isAuthenticated: false });
  },
}));

export const login = async (loginData) => {
  try {
    authStore.getState().setLoading(true);
    const response = await axios.post(ENDPOINTS.login, loginData);
    authStore.getState().setLoading(false);

    if (response.data.status === false) {
      authStore.getState().setError(response.data.message || "Login failed");
      return;
    }

    const token = response.data.access_token;
    authStore.getState().setToken(token);
    return response;
  } catch (error) {
    console.log(error.response.data.details);
    authStore.getState().setLoading(false);
    authStore
      .getState()
      .setError(error.response?.data?.detail || error.message);
  }
};

export default authStore;
