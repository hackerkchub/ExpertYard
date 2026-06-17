import api from "./axiosInstance";

const SEARCH_BASE = "/search/v2";

const requestOptions = (params, signal) => ({
  params,
  signal,
  skipLoader: true,
});

export const globalSearch = ({ q, limit = 5, signal, ...params } = {}) =>
  api.get(`${SEARCH_BASE}/global`, requestOptions({ q, limit, ...params }, signal));

export const searchExperts = ({ signal, ...params } = {}) =>
  api.get(`${SEARCH_BASE}/experts`, requestOptions(params, signal));

export const searchCategories = ({ signal, ...params } = {}) =>
  api.get(`${SEARCH_BASE}/categories`, requestOptions(params, signal));

export const searchSubcategories = ({ signal, ...params } = {}) =>
  api.get(`${SEARCH_BASE}/subcategories`, requestOptions(params, signal));

export const nearbyExperts = ({
  latitude,
  longitude,
  category_id,
  subcategory_id,
  page = 1,
  limit = 20,
  signal
} = {}) =>
  api.get(
    `${SEARCH_BASE}/nearby-experts`,
    requestOptions(
      {
        latitude,
        longitude,
        category_id,
        subcategory_id,
        page,
        limit
      },
      signal
    )
  );
