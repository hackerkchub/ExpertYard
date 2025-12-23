import api from "./axiosInstance";

/* =====================
   POSTS
===================== */

// GET ALL POSTS (optional expert_id)
export const getPostsApi = (expert_id) =>
  api.get("/expert-post", {
    params: expert_id ? { expert_id } : {}
  });

// GET FOLLOWING FEED (MY OFFERS)
export const getFollowingFeedApi = (user_id) =>
  api.get(`/expert-post/feed/following/${user_id}`);

// CREATE POST
export const createPostApi = (payload) =>
  api.post("/expert-post", payload);

// UPDATE POST
export const updatePostApi = (id, payload) =>
  api.put(`/expert-post/${id}`, payload);

// DELETE POST
export const deletePostApi = (id, expert_id) =>
  api.delete(`/expert-post/${id}`, {
    data: { expert_id }
  });

/* =====================
   LIKES
===================== */

// LIKE POST
// body: { post_id, user_id }
export const likePostApi = ({ post_id, user_id }) =>
  api.post("/expert-post/like", { post_id, user_id });

// UNLIKE POST
export const unlikePostApi = ({ post_id, user_id }) =>
  api.post("/expert-post/unlike", { post_id, user_id });
  
/* =====================
   COMMENTS
===================== */

// ADD COMMENT
// body: { post_id, expert_id, comment }
export const addCommentApi = ({ post_id, expert_id, comment }) =>
  api.post("/expert-post/comments", { post_id, expert_id, comment });

// GET COMMENTS OF POST
export const getCommentsApi = (post_id) =>
  api.get(`/expert-post/${post_id}/comments`);

// UPDATE COMMENT
export const updateCommentApi = ({ id, expert_id, comment }) =>
  api.put(`/expert-post/comments/${id}`, { expert_id, comment });

// DELETE COMMENT
export const deleteCommentApi = ({ id, expert_id }) =>
  api.delete(`/expert-post/comments/${id}`, {
    data: { expert_id }
  });
