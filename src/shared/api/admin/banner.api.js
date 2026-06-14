import api from "./axiosInstance";

/* ===========================
   GET ACTIVE BANNERS
   API: /api/banner
=========================== */
export const getBannersApi = async (
  position = "home_hero"
) => {
  const { data } = await api.get(
    `/banner?position=${position}`
  );

  return data;
};

/* ===========================
   GET ALL BANNERS (ADMIN)
   API: /api/banner/admin
=========================== */
export const getAllBannersApi =
  async () => {
    const { data } = await api.get(
      "/banner/admin"
    );

    return data;
  };

/* ===========================
   GET SINGLE BANNER
   API: /api/banner/admin/:id
=========================== */
export const getBannerByIdApi =
  async (id) => {
    const { data } = await api.get(
      `/banner/admin/${id}`
    );

    return data;
  };

/* ===========================
   CREATE BANNER
=========================== */
export const createBannerApi = (
  formData
) => {
  return api.post(
    "/banner/admin",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};

/* ===========================
   UPDATE BANNER
=========================== */
export const updateBannerApi = (
  id,
  formData
) => {
  return api.put(
    `/banner/admin/${id}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};

/* ===========================
   UPDATE STATUS
=========================== */
export const updateBannerStatusApi =
  (id, is_active) => {
    return api.patch(
      `/banner/admin/${id}/status`,
      {
        is_active,
      }
    );
  };

/* ===========================
   DELETE BANNER
=========================== */
export const deleteBannerApi = (
  id
) => {
  return api.delete(
    `/banner/admin/${id}`
  );
};