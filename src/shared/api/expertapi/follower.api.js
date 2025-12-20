// shared/api/expertApi/follower.api.js
import api from "./axiosInstance";

// Body: { user_id, expert_id }
export const followExpertApi = ({ user_id, expert_id }) => {
  return api.post("/followers/follow", { user_id, expert_id });
};

export const unfollowExpertApi = ({ user_id, expert_id }) => {
  return api.post("/followers/unfollow", { user_id, expert_id });
};

// GET /followers/expert/:id
export const getExpertFollowersApi = (expertId) => {
  return api.get(`/followers/${expertId}/followers`);
};
