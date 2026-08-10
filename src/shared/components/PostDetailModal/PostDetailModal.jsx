import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiX,
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiShare2,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { useAuth } from "../../context/UserAuthContext";
import {
  likePostApi,
  unlikePostApi,
  getCommentsApi,
  addCommentApi,
} from "../../api/expertapi/post.api";
import { APP_CONFIG } from "../../../config/appConfig";
import "./PostDetailModal.css";

const API_BASE = APP_CONFIG.API_BASE_URL;

const resolveMediaUrl = (url) => {
  if (!url) return "";
  const cleanUrl = String(url).trim().replace(/\\/g, "/");
  if (
    /^(https?:)?\/\//i.test(cleanUrl) ||
    cleanUrl.startsWith("data:") ||
    cleanUrl.startsWith("blob:")
  ) {
    return cleanUrl;
  }
  const apiOrigin = API_BASE.replace(/\/api\/?$/, "");
  if (cleanUrl.startsWith("/")) {
    return `${apiOrigin}${cleanUrl}`;
  }
  return `${apiOrigin}/uploads/${cleanUrl}`;
};

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return "Just now";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Recently";
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function PostDetailModal({ post, isOpen, onClose, expertProfile }) {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const postId = post?.post_id || post?.id || post?._id;

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likeLock, setLikeLock] = useState(false);

  // Sync post data when opened
  useEffect(() => {
    if (!isOpen || !post) return;

    setLiked(Boolean(post.is_liked || post.liked));
    setLikesCount(Number(post.likes_count || post.likes || 0));
    setCommentsCount(Number(post.comments_count || post.commentsCount || 0));
    setCommentInput("");

    // Fetch comments for this post
    if (postId) {
      setLoadingComments(true);
      getCommentsApi(postId)
        .then((res) => {
          const rawComments = res.data?.data || res.data || [];
          setComments(Array.isArray(rawComments) ? rawComments : []);
        })
        .catch((err) => console.error("Failed to load comments:", err))
        .finally(() => setLoadingComments(false));
    }
  }, [isOpen, post, postId]);

  if (!isOpen || !post) return null;

  const expertName =
    post.expert_name ||
    post.author_name ||
    post.expertName ||
    expertProfile?.name ||
    "Expert Consultant";
  const expertPhoto = resolveMediaUrl(
    post.profile_photo || post.expert_photo || expertProfile?.profile_photo
  );
  const expertPosition =
    post.position ||
    post.expert_position ||
    expertProfile?.position ||
    "Verified Expert";
  const expertSlugOrId =
    post.expert_slug ||
    post.expert_id ||
    expertProfile?.id ||
    expertProfile?.expert_id;
  const imageUrl = resolveMediaUrl(
    post.image_url || post.image || post.media_url || post.cover_image
  );
  const title = post.title || post.name || "Expert Post";
  const description = post.description || post.content || post.text || post.body || "";

  const handleLikeToggle = async () => {
    if (!isLoggedIn || !user) {
      onClose();
      navigate("/user/auth", { state: { from: location.pathname } });
      return;
    }

    if (likeLock || !postId) return;
    setLikeLock(true);

    const prevLiked = liked;
    const nextLiked = !prevLiked;
    setLiked(nextLiked);
    setLikesCount((prev) => prev + (nextLiked ? 1 : -1));

    try {
      if (prevLiked) {
        await unlikePostApi({ post_id: postId, user_id: user.id });
      } else {
        await likePostApi({ post_id: postId, user_id: user.id });
      }
    } catch (err) {
      console.error("Like toggle failed:", err);
      setLiked(prevLiked);
      setLikesCount((prev) => prev + (prevLiked ? 1 : -1));
    } finally {
      setLikeLock(false);
    }
  };

  const handleAddComment = async (e) => {
    if (e && e.key && e.key !== "Enter") return;
    if (!isLoggedIn || !user) {
      onClose();
      navigate("/user/auth", { state: { from: location.pathname } });
      return;
    }

    const text = commentInput.trim();
    if (!text || submittingComment || !postId) return;

    setSubmittingComment(true);
    try {
      const res = await addCommentApi({
        post_id: postId,
        expert_id: post.expert_id || expertProfile?.id,
        comment: text,
      });

      const newComment = {
        id: res.data?.data?.id || Date.now(),
        comment: text,
        user_id: user.id,
        first_name: user.first_name || user.name || "You",
        last_name: user.last_name || "",
        created_at: new Date().toISOString(),
      };

      setComments((prev) => [...prev, newComment]);
      setCommentsCount((prev) => prev + 1);
      setCommentInput("");
    } catch (err) {
      console.error("Add comment failed:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    const shareTitle = title;
    const shareText = description.slice(0, 100);
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share error:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Post link copied to clipboard!");
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="post-detail-modal-overlay" onClick={onClose}>
      <div
        className="post-detail-modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="post-detail-modal-header">
          <div className="post-author-row">
            {expertSlugOrId ? (
              <Link
                to={`/user/experts/${expertSlugOrId}`}
                onClick={onClose}
                className="post-author-avatar-link"
              >
                {expertPhoto ? (
                  <img
                    src={expertPhoto}
                    alt={expertName}
                    className="post-author-avatar"
                  />
                ) : (
                  <div className="post-author-fallback">
                    {expertName.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
            ) : (
              <div className="post-author-avatar-link">
                {expertPhoto ? (
                  <img
                    src={expertPhoto}
                    alt={expertName}
                    className="post-author-avatar"
                  />
                ) : (
                  <div className="post-author-fallback">
                    {expertName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            )}

            <div className="post-author-info">
              <h4 className="post-author-name">
                {expertName}
                <FiCheckCircle className="verified-badge" />
              </h4>
              <span className="post-author-role">{expertPosition}</span>
            </div>
          </div>

          <button
            type="button"
            className="post-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="post-detail-modal-body">
          <h2 className="post-full-title">{title}</h2>

          {imageUrl && (
            <div className="post-media-wrap">
              <img src={imageUrl} alt={title} className="post-full-image" />
            </div>
          )}

          {description && (
            <div className="post-full-description">{description}</div>
          )}

          {/* Action Row */}
          <div className="post-modal-actions-bar">
            <button
              type="button"
              className={`post-action-button like-btn ${liked ? "liked" : ""}`}
              onClick={handleLikeToggle}
            >
              <FiHeart
                className="action-icon"
                fill={liked ? "#ef4444" : "none"}
                stroke={liked ? "#ef4444" : "#475569"}
              />
      
            </button>

            <div className="post-action-button comment-btn">
              <FiMessageCircle className="action-icon" />
             
            </div>

            <button
              type="button"
              className="post-action-button share-btn"
              onClick={handleShare}
            >
              <FiShare2 className="action-icon" />
              <span>Share</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="post-modal-comments-section">
            <h3 className="comments-section-title">
              Comments ({comments.length})
            </h3>

            {loadingComments ? (
              <div className="comments-loading">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="comments-empty">
                No comments yet. Be the first to join the conversation!
              </div>
            ) : (
              <div className="post-comments-list">
                {comments
                  .filter((c) => c && (c.comment || c.text))
                  .map((c) => (
                    <div key={c.id || Math.random()} className="comment-card">
                      <div className="comment-header">
                        <div className="comment-user-info">
                          <div className="comment-avatar">
                            {(c.first_name || c.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <span className="comment-author-name">
                            {`${c.first_name || ""} ${c.last_name || ""}`.trim() ||
                              c.name ||
                              "User"}
                          </span>
                          {c.user_id === user?.id && (
                            <span className="comment-you-badge">You</span>
                          )}
                        </div>
                        <span className="comment-time">
                          <FiClock size={11} />
                          {formatRelativeTime(c.created_at)}
                        </span>
                      </div>
                      <p className="comment-text-body">{c.comment || c.text}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Input Footer for Writing Comments */}
        <div className="post-modal-footer">
          <input
            type="text"
            className="post-modal-comment-input"
            placeholder="Write a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={handleAddComment}
            disabled={submittingComment}
          />
          <button
            type="button"
            className="post-modal-send-btn"
            onClick={() => handleAddComment()}
            disabled={!commentInput.trim() || submittingComment}
          >
            <FiSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
