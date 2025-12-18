import api from "./axiosInstance"; // 👈 same axios instance jo baaki APIs me use hota hai


// 🔹 FOLLOW EXPERT
export const followExpertApi = (expertId) => {
  return api.post("/followers/follow", {
    expert_id: expertId
  });
};

// 🔹 UNFOLLOW EXPERT
export const unfollowExpertApi = (expertId) => {
  return api.post("/followers/unfollow", {
    expert_id: expertId
  });
};

// 🔹 GET FOLLOWERS LIST (OPTIONAL – future use)
export const getExpertFollowersApi = (expertId) => {
  return api.get(`/followers/${expertId}/followers`);
};
