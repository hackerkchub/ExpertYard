export const EXPERT_POST_LIKE_SYNC_EVENT = "g9-expert-post-like-sync";
const STORAGE_KEY = "g9_expert_post_like_sync";

export const getExpertPostId = (post) => post?.data?.post_id || post?.post_id || post?.id;

export const normalizeExpertPostLikeState = ({
  postId,
  response,
  isLiked,
  likesCount,
}) => {
  const payload = response?.data || response || {};
  const nextLikes = Number(
    payload.likes_count ?? payload.like_count ?? payload.likes ?? likesCount ?? 0
  );

  return {
    post_id: payload.post_id || postId,
    is_liked: Boolean(payload.is_liked ?? payload.liked ?? isLiked),
    likes_count: Number.isFinite(nextLikes) ? nextLikes : 0,
  };
};

export const updatePostLikeState = (posts, postId, likeState) =>
  posts.map((post) => {
    if (post?.type === "expert_post") {
      const data = post.data || {};
      if (String(getExpertPostId(post)) !== String(postId)) return post;

      return {
        ...post,
        data: {
          ...data,
          is_liked: likeState.is_liked,
          likes: likeState.likes_count,
          likes_count: likeState.likes_count,
        },
      };
    }

    if (String(getExpertPostId(post)) !== String(postId)) return post;

    return {
      ...post,
      is_liked: likeState.is_liked,
      likes: likeState.likes_count,
      likes_count: likeState.likes_count,
    };
  });

export const emitExpertPostLikeSync = (likeState) => {
  if (typeof window === "undefined" || !likeState?.post_id) return;

  window.dispatchEvent(new CustomEvent(EXPERT_POST_LIKE_SYNC_EVENT, { detail: likeState }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...likeState, synced_at: Date.now() }));
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage sync is best-effort; same-window event above is the primary path.
  }
};

export const subscribeExpertPostLikeSync = (handler) => {
  if (typeof window === "undefined") return () => {};

  const onSync = (event) => handler(event.detail);
  const onStorage = (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      handler(JSON.parse(event.newValue));
    } catch {
      // Ignore malformed cross-tab payloads.
    }
  };

  window.addEventListener(EXPERT_POST_LIKE_SYNC_EVENT, onSync);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(EXPERT_POST_LIKE_SYNC_EVENT, onSync);
    window.removeEventListener("storage", onStorage);
  };
};
