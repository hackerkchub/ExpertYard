import api from "./axiosInstance";

/* =====================
   FOLLOW / UNFOLLOW
===================== */

// FOLLOW EXPERT
// body: { user_id, expert_id }
export const followExpertApi = ({ user_id, expert_id }) =>
  api.post("/followers/follow", { user_id, expert_id });

// UNFOLLOW EXPERT
export const unfollowExpertApi = ({ user_id, expert_id }) =>
  api.post("/followers/unfollow", { user_id, expert_id });

/* =====================
   FOLLOWERS / FOLLOWING
===================== */

// GET FOLLOWERS OF EXPERT
export const getExpertFollowersApi = (expert_id) =>
  api.get(`/followers/${expert_id}/followers`);

// GET FOLLOWING EXPERTS BY USER (FOR AVATAR STRIP)
export const getFollowingExpertsApi = (user_id) =>
  api.get(`/followers/user/${user_id}/following`);
