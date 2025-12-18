import api from "./axiosInstance";

// --------------------
// POSTS APIs
// --------------------

// GET ALL POSTS
// ✅ CORRECT WAY
export const getPostsApi = (expert_id) =>
  api.get("/expert-post", {
    params: { expert_id }
  });

// CREATE POST
export const createPostApi = (payload) =>
  api.post("/expert-post", payload);

// UPDATE POST
export const updatePostApi = (id, payload) =>
  api.put(`/expert-post/${id}`, payload);

// DELETE POST
export const deletePostApi = (id, expert_id) =>
  api.delete(`/expert-post/${id}`, {
    data: { expert_id }   // 👈 BODY yahan aata hai
  });