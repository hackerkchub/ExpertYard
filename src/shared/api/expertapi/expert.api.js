import api from "./axiosInstance";

/* =====================================================
   👤 EXPERT APIs
===================================================== */

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
 * GET /api/expert/list
 */
export const getExpertsApi = async (params = {}) => {
  const {
    page = 1,
    limit = 20,
    category,
    subcategory,
    search,
    sortBy,
    order,
    top
  } = params;

  const query = new URLSearchParams();

  query.append("page", page);
  query.append("limit", limit);

  if (category) query.append("category", category);
  if (subcategory) query.append("subcategory", subcategory);
  if (search) query.append("search", search);
  if (sortBy) query.append("sortBy", sortBy);
  if (order) query.append("order", order);
  if (top) query.append("top", "true");

  const { data } = await api.get(`/expert/public/list?${query.toString()}`);

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