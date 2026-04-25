import { create } from "zustand";
import axios from "axios";
import { ENDPOINTS } from "./endpoints.js";
import authStore from "./admin_store.js";
import log from "eslint-plugin-react/lib/util/log.js";

const homesStore = create((set, get) => ({
  loading: false,
  error: null,
  homes: [],
  admin_homes: [],
  hotHomes: [],
  totalCountOfHomes: null,
  createdHomeUuid: null,
  from: 0,
  hasMore: true,
  hasMoreHotHomes: true,
  homeByUuid: null,
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (error) => set({ error }),

  getHomes: async (isInitial = false, filterParams = {}) => {
    const { from, homes } = get();

    try {
      set({ loading: true });

      const start = isInitial ? 0 : from;

      const response = await axios.get(ENDPOINTS.getHomes, {
        params: {
          skip: start,
          limit: 10,
          is_active: true,
          ...filterParams,
        },
      });

      set({ totalCountOfHomes: response.data.total_count });
      const newHomes = response.data.results || [];

      set({
        homes: isInitial ? newHomes : [...homes, ...newHomes],
        from: start + 10,
        hasMore: newHomes.length === 10,
        loading: false,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
      set({ loading: false });
    }
  },
  getAdminHomes: async (isInitial = false, filterParams = {}) => {
    const { from, homes } = get();

    try {
      set({ loading: true });

      const start = isInitial ? 0 : from;

      const response = await axios.get(ENDPOINTS.getHomes, {
        params: {
          skip: start,
          limit: 10,
          ...filterParams,
        },
      });

      set({ totalCountOfHomes: response.data.total_count });
      const newHomes = response.data.results || [];

      set({
        admin_homes: isInitial ? newHomes : [...homes, ...newHomes],
        from: start + 10,
        hasMore: newHomes.length === 10,
        loading: false,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
      set({ loading: false });
    }
  },
  getHotHomes: async (isInitial = false) => {
    const { from, hotHomes } = get();
    try {
      set({ loading: true });
      const start = isInitial ? 0 : from;

      const response = await axios.get(ENDPOINTS.getHomes, {
        params: { skip: start, limit: 10, isHot: true, is_active: true },
      });

      console.log(response, "response");
      const newHomes = response.data.results || [];

      set({
        hotHomes: isInitial ? newHomes : [...hotHomes, ...newHomes],
        from: start + 10,
        hasMoreHotHomes: newHomes.length === 10,
        loading: false,
      });
    } catch (err) {
      console.log(err);
      set({ loading: false });
    }
  },
  createHome: async (homeData) => {
    try {
      set({ loading: true, error: null });

      const token = authStore.getState().fetchToken();
      if (!token)
        throw new Error("No access token found. Please log in again.");

      console.log(ENDPOINTS.createHome);
      const response = await axios.post(ENDPOINTS.createHome, homeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      const createdUuid = response.data.data.uuid;

      set({
        createdHomeUuid: createdUuid,
        loading: false,
      });

      return createdUuid;
    } catch (err) {
      console.error("Error creating home:", err.response?.data || err.message);
      set({
        error: err.response?.data || err.message || "Unknown error",
        loading: false,
      });
      throw err;
    }
  },
  uploadHomeImages: async (filesArray, uuid) => {
    try {
      set({ loading: true });

      const token = authStore.getState().fetchToken();
      if (!token)
        throw new Error("No access token found. Please log in again.");
      //
      // const uuid = get().createdHomeUuid;
      // if (!uuid) throw new Error("No UUID available for uploading images");

      const formData = new FormData();
      filesArray.forEach((img) => {
        formData.append("files", img.file); // not files[]
      });

      const response = await axios.post(
        ENDPOINTS.uploadMultipleImages(uuid),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({ loading: false });
      return response.data;
    } catch (err) {
      console.error(
        "Error uploading images:",
        err.response?.data || err.message
      );
      set({ error: err, loading: false });
      throw err;
    }
  },
  activateHome: async () => {
    try {
      set({ loading: true });

      const token = authStore.getState().fetchToken();
      if (!token)
        throw new Error("No access token found. Please log in again.");

      const uuid = get().createdHomeUuid;
      if (!uuid) throw new Error("No UUID available for uploading images");
      const response = await axios.patch(
        ENDPOINTS.activateHomeApi(uuid),
        { is_active: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (err) {
      console.error("Error activating:", err.response?.data || err.message);
      set({ error: err, loading: false });
      throw err;
    }
  },
  deactivateHome: async (active, uuid) => {
    try {
      set({ loading: true });

      const token = authStore.getState().fetchToken();
      if (!token)
        throw new Error("No access token found. Please log in again.");

      const response = await axios.patch(
        ENDPOINTS.activateHomeApi(uuid),
        { is_active: active },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local admin_homes
      set((state) => ({
        admin_homes: state.admin_homes.map((home) =>
          home.uuid === uuid ? { ...home, is_active: active } : home
        ),
        loading: false,
      }));

      console.log(response);
    } catch (err) {
      console.error("Error deactivating:", err.response?.data || err.message);
      set({ error: err, loading: false });
      throw err;
    }
  },
  deleteHome: async (uuid) => {
    try {
      set({ loading: true });

      const token = authStore.getState().fetchToken();
      if (!token)
        throw new Error("No access token found. Please log in again.");

      const response = await axios.delete(ENDPOINTS.deleteHomesApi(uuid), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        set((state) => ({
          homes: state.homes.filter((item) => item.uuid !== uuid),
          isLoading: false,
        }));
      }
      console.log(response);
    } catch (err) {
      console.error("Error deleting:", err.response?.data || err.message);
      set({ error: err, loading: false });
      throw err;
    }
  },
  editHome: async (uuid, postData) => {
    try {
      set({ loading: true });
      const token = authStore.getState().fetchToken();
      if (!token)
        throw new Error("No access token found. Please log in again.");

      const response = await axios.put(
        ENDPOINTS.deleteHomesApi(uuid),
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // if(response){
      //     set(state => ({
      //         homes: state.homes.filter((item)=>item.uuid !== uuid),
      //         isLoading: false,
      //     }));
      // }
      set({ loading: false });
      console.log(response, "editResponse");
    } catch (err) {
      console.error("Error deleting:", err.response?.data || err.message);
      set({ error: err, loading: false });
      throw err;
    }
  },
  deleteExistingImages: async (uuid, img_name) => {
    try {
      set({ loading: true });

      const token = authStore.getState().fetchToken();
      if (!token)
        throw new Error("No access token found. Please log in again.");

      const response = await axios.delete(
        ENDPOINTS.deleteImageApi(uuid, img_name),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
    } catch (err) {
      console.error(
        "Error deleting images:",
        err.response?.data || err.message
      );
      set({ error: err, loading: false });
      throw err;
    }
  },
  getHomeByUuid: async (uuid) => {
    try {
      set({ loading: true });
      console.log(uuid, "home uuid");

      const response = await axios.get(ENDPOINTS.getHomesByUuidApi(uuid));
      set({ homeByUuid: response.data });
      console.log(response);
    } catch (err) {
      console.error(
        "Error deleting images:",
        err.response?.data || err.message
      );
      set({ error: err, loading: false });
      throw err;
    }
  },
}));

export default homesStore;
