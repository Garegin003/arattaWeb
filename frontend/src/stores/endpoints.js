const BASE_URL = "https://api.arattarealestate.com/api/v1/";

export const ENDPOINTS = {
  login: `${BASE_URL}auth/login`,
  getHomes: `${BASE_URL}homes`,
  getHomesByUuidApi: (uuid) => `${BASE_URL}homes/${uuid}`,
  createHome: `${BASE_URL}homes`,
  uploadMultipleImages: (uuid) => `${BASE_URL}images/upload-multiple/${uuid}`,
  activateHomeApi: (uuid) => `${BASE_URL}homes/${uuid}/activate`,
  deleteHomesApi: (uuid) => `${BASE_URL}homes/${uuid}`,
  deleteImageApi: (uuid, img_name) => `${BASE_URL}images/${uuid}/${img_name}`,
};
