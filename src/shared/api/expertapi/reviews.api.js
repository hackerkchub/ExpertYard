import api from "./axiosInstance";

/* =========================
   ADD / UPDATE REVIEW
   (JWT se user_id backend lega)
========================= */
export const addOrUpdateReviewApi = ({
  user_id,
  expert_id,
  rating_number,
  review_text
}) => {
  return api.post("/reviews/add-update", {
    user_id,
    expert_id,
    rating_number,
    review_text
  });
};

/* =========================
   GET REVIEWS BY EXPERT
========================= */
export const getReviewsByExpertApi = (expertId) => {
  return api.get(`/reviews/expert/${expertId}`);
};

/* =========================
   DELETE REVIEW
========================= */
export const deleteReviewApi = (expertId) => {
  return api.post("/reviews/delete", {
    expert_id: expertId
  });
};
