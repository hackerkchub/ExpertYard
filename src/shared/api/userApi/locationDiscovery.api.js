import api from "./axiosInstance";

const requestOptions = (params, signal) => ({
  params,
  signal,
  skipLoader: true,
});

export const discoverExperts = ({ signal, ...params } = {}) =>
  api.get("/experts/discover", requestOptions(params, signal));

export const searchWithLocation = ({ signal, ...params } = {}) =>
  api.get("/search", requestOptions(params, signal));

export const autocompleteLocation = (q, signal) =>
  api.get("/locations/search", requestOptions({ q }, signal));

export const reverseGeocode = (lat, lng, signal) =>
  api.get("/locations/reverse", requestOptions({ lat, lng }, signal));

export const getSeoLocationPage = ({ category, city, area, pincode, signal } = {}) =>
  api.get("/seo/location-page", requestOptions({ category, city, area, pincode }, signal));

export const getExpertLocations = (expertId) =>
  api.get(`/experts/location/${expertId}`);

export const createExpertLocation = (data) =>
  api.post("/experts/location", data);

export const updateExpertLocation = (id, data) =>
  api.put(`/experts/location/${id}`, data);

export const deleteExpertLocation = (id) =>
  api.delete(`/experts/location/${id}`);
