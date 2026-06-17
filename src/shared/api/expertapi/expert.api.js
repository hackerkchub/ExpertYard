import api from "./axiosInstance";

/* =====================================================
   👤 EXPERT APIs
===================================================== */

export const getMyProfileApi = async () => {
  const { data } = await api.get("/expert/me");
  return data;
};
/**
 * 🔹 Get all experts
 * GET {{baseURL}}/api/expert/list
 */
export const getAllExpertsApi = async () => {
  const { data } = await api.get("/expert/list");
  return data;
};

/**
 * 🔹 Get expert by ID
 * GET {{baseURL}}/api/expert/:id
 */
export const getExpertByIdApi = async (expertId) => {
  const { data } = await api.get(`/expert/${expertId}`);
  return data;
};

/**
 * 🔹 Update expert status by ID
 * PUT {{baseURL}}/api/expert/status/:id
 * body: { status: 1 | 0 }
 */
export const updateExpertStatusApi = async (expertId, payload) => {
  const { data } = await api.put(
    `/expert/status/${expertId}`,
    payload
  );
  return data;
};


/* =====================================================
   🧾 EXPERT PROFILE APIs
===================================================== */

/**
 * 🔹 Get all expert profiles
 * GET {{baseURL}}/api/expert-profile/list
 */
export const getAllExpertProfilesApi = async () => {
  const { data } = await api.get("/expert-profile/list");
  return data;
};

/**
 * 🔹 Get expert profile by expert ID
 * GET {{baseURL}}/api/expert-profile/expert/:id
 */
export const getExpertProfileByExpertIdApi = async (expertId) => {
  const { data } = await api.get(
    `/expert-profile/expert/${expertId}`
  );
  return data;
};

/**
 * 🔹 Get experts by sub-category
 * GET {{baseURL}}/api/expert-profile/subcategory/:subCatId
 */
export const getExpertsBySubCategoryApi = async (subCategoryId) => {
  const { data } = await api.get(
    `/expert-profile/subcategory/${subCategoryId}`
  );
  return data;
};


/**
 * 🔥 Get Experts (WITH FILTERS)
 * GET /api/expert/public/list
 */
export const getExpertsApi = async (params = {}) => {
  const { signal, ...rest } = params;
  const query = new URLSearchParams();

  Object.entries(rest).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      query.append(key, val);
    }
  });

  if (!query.has("page")) query.append("page", "1");
  if (!query.has("limit")) query.append("limit", "20");

  const { data } = await api.get(`/expert/public/list?${query.toString()}`, { signal });
  return data;
};

/**
 * 🔹 Update expert profile by expert ID
 * PUT {{baseURL}}/api/expert-profile/expert/:id
 * FormData required
 */
// export const updateExpertProfileApi = async (expertId, formData) => {
//   const { data } = await api.put(
//     `/expert-profile/expert/${expertId}`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data"
//       }
//     }
//   );
//   return data;
// };


export const uploadExpertPhotoApi = async (expertId, formData) => {
  const { data } = await api.put(
    `/expert-profile/expert/${expertId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return data;
};
