import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiBookmark,
  FiAlertTriangle,
  FiVolume2,
  FiVolumeX,
  FiPhone,
  FiMessageSquare,
  FiCalendar,
  FiUser,
  FiPlay,
  FiPause
} from "react-icons/fi";
import Swal from "sweetalert2";
import { APP_CONFIG } from "../../../../config/appConfig";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import useChatRequest from "../../../../shared/hooks/useChatRequest";
import {
  getReelsFeedApi,
  getReelBySlugApi,
  logReelViewApi,
  likeReelApi,
  unlikeReelApi,
  addCommentApi,
  getReelCommentsApi,
  deleteReelCommentApi,
  saveReelApi,
  unsaveReelApi,
  logReelShareApi,
  reportReelApi
} from "../../../../shared/api/reels.api";

import {
  ReelsPageGlobalStyle,
  Container,
  ReelsFeed,
  ReelWrapper,
  PlayerSection,
  VideoContainer,
  VideoElement,
  VideoOverlay,
  MobileOverlayContent,
  ExpertMeta,
  Avatar,
  AvatarFallback,
  NameText,
  CategoryTag,
  TitleText,
  CaptionText,
  DesktopSidebar,
  DesktopHeader,
  DesktopInfo,
  SectionDivider,
  ActionColumn,
  ActionButton,
  ActionLabel,
  CommentsSection,
  CommentsHeader,
  CommentsList,
  CommentRow,
  CommentAvatar,
  CommentContent,
  CommentName,
  CommentText,
  CommentInputRow,
  CommentInput,
  CommentSubmitButton,
  MobileCommentsBackdrop,
  MobileCommentsPanel,
  MobileCommentsHeader,
  CtaRow,
  CtaButton,
  PlayToggleOverlay,
  SoundToggle,
  LoadingOverlay,
  Spinner
} from "./ReelsPage.styles";

const API_ORIGIN = APP_CONFIG.API_BASE_URL.replace(/\/api\/?$/, "");

const getOrCreateReelSessionId = () => {
  const key = "g9_reels_session_id";
  let value = localStorage.getItem(key);
  if (!value) {
    value = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, value);
  }
  return value;
};

const getErrorMessage = (err, fallback) => {
  if (typeof err === "string") return err;
  return err?.response?.data?.message || err?.message || fallback;
};

const getReelDisplayName = (reel) => {
  const value =
    reel?.expert_name ||
    reel?.expertName ||
    reel?.name ||
    reel?.full_name ||
    reel?.fullName ||
    reel?.username ||
    reel?.business_name ||
    reel?.businessName ||
    reel?.expert?.name ||
    reel?.expert?.full_name ||
    reel?.expert?.business_name ||
    reel?.user?.name ||
    reel?.user?.full_name ||
    "";
  const text = String(value || "").trim();
  return text && !/^\d+$/.test(text) ? text : "Expert";
};

const getReelExpertId = (reel) => (
  reel?.expert_id ||
  reel?.expertId ||
  reel?.expert?.expert_id ||
  reel?.expert?.id ||
  reel?.expert_user_id ||
  reel?.user_id ||
  null
);

const getExpertProfileRouteId = (reel) => {
  const slug =
    reel?.expert_slug ||
    reel?.expertSlug ||
    reel?.expert_profile_slug ||
    reel?.expertProfileSlug ||
    reel?.profile_slug ||
    reel?.profileSlug ||
    reel?.expert?.slug ||
    "";
  const cleanSlug = String(slug || "").trim();
  if (cleanSlug) return cleanSlug;
  return null;
};

const getInitials = (name) => {
  const parts = String(name || "G9")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return (parts[0]?.[0] || "G").toUpperCase() + (parts[1]?.[0] || "9").toUpperCase();
};

const resolveExpertAvatar = (reel) => {
  const raw =
    reel?.expert_profile_photo ||
    reel?.profile_picture ||
    reel?.profilePicture ||
    reel?.profile_photo ||
    reel?.profilePhoto ||
    reel?.profileImage ||
    reel?.profile_image ||
    reel?.avatar ||
    reel?.image ||
    reel?.expert_profile_picture ||
    reel?.expertProfilePicture ||
    reel?.expertProfilePhoto ||
    reel?.expert_profile_image ||
    reel?.expertProfileImage ||
    reel?.expert_image ||
    reel?.expertImage ||
    reel?.expert?.profile_picture ||
    reel?.expert?.profilePicture ||
    reel?.expert?.profile_photo ||
    reel?.expert?.profilePhoto ||
    reel?.expert?.avatar ||
    reel?.expert?.profile_image ||
    reel?.expert?.profileImage ||
    reel?.expert?.image ||
    reel?.user?.profile_picture ||
    reel?.user?.profilePicture ||
    reel?.user?.profile_photo ||
    reel?.user?.profilePhoto ||
    reel?.user?.profile_image ||
    reel?.user?.profileImage ||
    reel?.user?.avatar ||
    "";
  const value = String(raw || "").trim().replace(/\\/g, "/");
  if (!value || value === "null" || value === "undefined") return "";
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }
  if (value.startsWith("/api/uploads/")) {
    return `${API_ORIGIN}${value.replace(/^\/api/, "")}`;
  }
  if (value.startsWith("api/uploads/")) {
    return `${API_ORIGIN}/${value.replace(/^api\//, "")}`;
  }
  if (value.startsWith("/uploads/")) {
    return `${API_ORIGIN}${value}`;
  }
  if (value.startsWith("uploads/")) {
    return `${API_ORIGIN}/${value}`;
  }
  if (value.startsWith("/")) {
    return `${API_ORIGIN}${value}`;
  }
  return `${API_ORIGIN}/uploads/${value}`;
};

export default function ReelsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();
  const { startChat, ChatPopups } = useChatRequest();

  const [reels, setReels] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsReelId, setCommentsReelId] = useState(null);
  const [pendingActions, setPendingActions] = useState({});
  const [manualPausedReelIds, setManualPausedReelIds] = useState(() => new Set());
  const [playFeedback, setPlayFeedback] = useState(null);
  const [failedAvatarKeys, setFailedAvatarKeys] = useState(() => new Set());

  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const viewedReelsRef = useRef(new Set());
  const viewTimersRef = useRef({});
  const snapTimerRef = useRef(null);
  const snapLockRef = useRef(false);
  const playFeedbackTimerRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("g9-reels-page-active");
    document.documentElement.classList.add("g9-reels-page-active");

    return () => {
      document.body.classList.remove("g9-reels-page-active");
      document.documentElement.classList.remove("g9-reels-page-active");
      if (snapTimerRef.current) {
        window.clearTimeout(snapTimerRef.current);
      }
      if (playFeedbackTimerRef.current) {
        window.clearTimeout(playFeedbackTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setManualPausedReelIds(new Set());
    setPlayFeedback(null);
    if (playFeedbackTimerRef.current) {
      window.clearTimeout(playFeedbackTimerRef.current);
    }
  }, [activeIdx]);

  // 1. Fetch Reels Feed / Single Reel
  useEffect(() => {
    const fetchReels = async () => {
      setLoading(true);
      try {
        let list = [];
        const params = { user_id: user?.id || null, limit: 15, offset: 0 };

        if (slug) {
          // Fetch the shared reel first
          const singleRes = await getReelBySlugApi(slug, params);
          if (singleRes.data && singleRes.data.success && singleRes.data.data) {
            list.push(singleRes.data.data);
          }
        }

        // Fetch general feed
        const feedRes = await getReelsFeedApi(params);
        if (feedRes.data && feedRes.data.success) {
          const feedList = feedRes.data.data || [];
          // Filter out duplicate if slug-based reel was already added
          const filteredFeed = feedList.filter(item => !list.some(r => r.id === item.id));
          list = [...list, ...filteredFeed];
        }

        setReels(list);
      } catch (err) {
        console.error("Error loading reels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, [slug, user?.id]);

  const snapToReel = useCallback((index, behavior = "smooth") => {
    const container = containerRef.current;
    if (!container) return;

    const target = container.querySelector(`[data-index="${index}"]`);
    if (!target) return;

    snapLockRef.current = true;
    target.scrollIntoView({ block: "start", behavior });
    window.setTimeout(() => {
      snapLockRef.current = false;
    }, 420);
  }, []);

  const snapToNearestReel = useCallback(() => {
    const container = containerRef.current;
    if (!container || snapLockRef.current) return;

    const slides = Array.from(container.querySelectorAll(".reel-slide"));
    if (!slides.length) return;

    const containerRect = container.getBoundingClientRect();
    let bestIndex = activeIdx;
    let bestVisible = 0;

    slides.forEach((slide) => {
      const rect = slide.getBoundingClientRect();
      const visible = Math.max(
        0,
        Math.min(rect.bottom, containerRect.bottom) - Math.max(rect.top, containerRect.top)
      );
      if (visible > bestVisible) {
        bestVisible = visible;
        bestIndex = Number(slide.getAttribute("data-index") || 0);
      }
    });

    setActiveIdx(bestIndex);
    snapToReel(bestIndex);
  }, [activeIdx, snapToReel]);

  const handleReelsScroll = useCallback(() => {
    if (snapTimerRef.current) {
      window.clearTimeout(snapTimerRef.current);
    }

    snapTimerRef.current = window.setTimeout(() => {
      snapToNearestReel();
    }, 110);
  }, [snapToNearestReel]);

  const showPlayFeedback = useCallback((reelId, type, autoHide = true) => {
    if (playFeedbackTimerRef.current) {
      window.clearTimeout(playFeedbackTimerRef.current);
    }

    setPlayFeedback({ reelId, type, key: Date.now() });
    if (autoHide) {
      playFeedbackTimerRef.current = window.setTimeout(() => {
        setPlayFeedback((current) => (
          current?.reelId === reelId ? null : current
        ));
      }, 520);
    }
  }, []);

  const handleVideoToggle = useCallback((event, reel, index) => {
    event.stopPropagation();
    if (index !== activeIdx) return;

    const video = videoRefs.current[index];
    if (!video) return;

    const currentlyPaused = video.paused || manualPausedReelIds.has(reel.id);
    if (currentlyPaused) {
      setManualPausedReelIds((prev) => {
        const next = new Set(prev);
        next.delete(reel.id);
        return next;
      });
      video.play()
        .then(() => showPlayFeedback(reel.id, "play"))
        .catch(() => {
          setManualPausedReelIds((prev) => new Set(prev).add(reel.id));
          showPlayFeedback(reel.id, "play", false);
        });
    } else {
      video.pause();
      setManualPausedReelIds((prev) => new Set(prev).add(reel.id));
      showPlayFeedback(reel.id, "pause", false);
    }
  }, [activeIdx, manualPausedReelIds, showPlayFeedback]);

  // 2. IntersectionObserver to track visible video and play/pause
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]) {
          const index = parseInt(visibleEntries[0].target.getAttribute("data-index"), 10);
          setActiveIdx(index);
        }
      },
      {
        root: container,
        threshold: [0.55, 0.7, 0.85, 0.95],
      }
    );

    const elements = container.querySelectorAll(".reel-slide");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [reels]);

  const updateReelById = useCallback((reelId, updater) => {
    setReels((prev) => prev.map((item) => (
      Number(item.id) === Number(reelId) ? updater(item) : item
    )));
  }, []);

  const fetchComments = useCallback(async (reelId) => {
    setLoadingComments(true);
    try {
      const res = await getReelCommentsApi(reelId);
      if (res.data && res.data.success) {
        setComments(res.data.data || []);
      }
    } catch (err) {
      Swal.fire("Error", getErrorMessage(err, "Failed to load comments"), "error");
    } finally {
      setLoadingComments(false);
    }
  }, []);

  const openComments = useCallback((reel) => {
    setCommentsOpen(true);
    setCommentsReelId(reel.id);
    fetchComments(reel.id);
  }, [fetchComments]);

  const logMeaningfulView = useCallback(async (reel, watchTime, percentageWatched) => {
    if (!reel || viewedReelsRef.current.has(reel.id)) return;
    viewedReelsRef.current.add(reel.id);

    try {
      const res = await logReelViewApi(reel.id, {
        user_id: user?.id || null,
        session_id: getOrCreateReelSessionId(),
        watch_time: watchTime,
        percentage_watched: percentageWatched
      });

      if (res.data?.success && res.data?.data?.counted) {
        updateReelById(reel.id, (item) => ({
          ...item,
          views_count: res.data.data.views_count ?? item.views_count
        }));
      }
    } catch (err) {
      viewedReelsRef.current.delete(reel.id);
      console.error("View count error:", err);
    }
  }, [updateReelById, user?.id]);

  // Handle play/pause and meaningful view count based on active index
  useEffect(() => {
    if (reels.length === 0) return;

    const activeReel = reels[activeIdx];
    Object.values(viewTimersRef.current).forEach(clearTimeout);
    viewTimersRef.current = {};

    // Play active video, pause others
    Object.keys(videoRefs.current).forEach((key) => {
      const idx = parseInt(key, 10);
      const video = videoRefs.current[key];
      if (video) {
        if (idx === activeIdx) {
          const isManuallyPaused = activeReel && manualPausedReelIds.has(activeReel.id);
          if (isManuallyPaused) {
            video.pause();
            return;
          }

          video.play().catch(() => {});
          if (activeReel && !viewedReelsRef.current.has(activeReel.id)) {
            viewTimersRef.current[activeReel.id] = setTimeout(() => {
              const duration = Number(video.duration || 0);
              const currentTime = Number(video.currentTime || 3);
              const percent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 50;
              logMeaningfulView(activeReel, Math.max(3, currentTime), percent);
            }, 3000);
          }
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });

    return () => {
      Object.values(viewTimersRef.current).forEach(clearTimeout);
      viewTimersRef.current = {};
    };
  }, [activeIdx, reels, logMeaningfulView, manualPausedReelIds]);

  const handleVideoTimeUpdate = (reel, video) => {
    if (!video || viewedReelsRef.current.has(reel.id)) return;
    const duration = Number(video.duration || 0);
    if (!duration) return;
    const watchTime = Number(video.currentTime || 0);
    const percentageWatched = Math.min(100, (watchTime / duration) * 100);
    if (watchTime >= 3 || percentageWatched >= 50) {
      logMeaningfulView(reel, watchTime, percentageWatched);
    }
  };

  // 3. Reels Interactivity (Like, Save, Share, Comment, Report)
  const handleLike = async (reel, index) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: location } });
      return;
    }
    const actionKey = `like-${reel.id}`;
    if (pendingActions[actionKey]) return;

    const previous = reels;
    const item = reels[index];
    const nextLiked = !item.is_liked;

    setPendingActions((prev) => ({ ...prev, [actionKey]: true }));
    updateReelById(item.id, (current) => ({
      ...current,
      is_liked: nextLiked,
      likes_count: nextLiked
        ? Number(current.likes_count || 0) + 1
        : Math.max(0, Number(current.likes_count || 0) - 1)
    }));
    try {
      const res = nextLiked
        ? await likeReelApi(item.id, { user_id: user.id })
        : await unlikeReelApi(item.id, { user_id: user.id });
      if (res.data?.data) {
        updateReelById(item.id, (current) => ({ ...current, ...res.data.data }));
      }
    } catch (err) {
      setReels(previous);
      Swal.fire("Error", getErrorMessage(err, "Failed to update like"), "error");
    } finally {
      setPendingActions((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleSave = async (reel, index) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: location } });
      return;
    }
    const actionKey = `save-${reel.id}`;
    if (pendingActions[actionKey]) return;

    const previous = reels;
    const item = reels[index];
    const nextSaved = !item.is_saved;

    setPendingActions((prev) => ({ ...prev, [actionKey]: true }));
    updateReelById(item.id, (current) => ({
      ...current,
      is_saved: nextSaved,
      saves_count: nextSaved
        ? Number(current.saves_count || 0) + 1
        : Math.max(0, Number(current.saves_count || 0) - 1)
    }));
    try {
      const res = nextSaved
        ? await saveReelApi(item.id, { user_id: user.id })
        : await unsaveReelApi(item.id, { user_id: user.id });
      if (res.data?.data) {
        updateReelById(item.id, (current) => ({ ...current, ...res.data.data }));
      }
    } catch (err) {
      setReels(previous);
      Swal.fire("Error", getErrorMessage(err, "Failed to update save"), "error");
    } finally {
      setPendingActions((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleShare = async (reel) => {
    const shareUrl = `${window.location.origin}/user/reels/${reel.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: reel.title,
          text: reel.caption,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
      const res = await logReelShareApi(reel.id, { user_id: user?.id || null, platform: navigator.share ? "web_share" : "clipboard" });
      if (res.data?.data) {
        updateReelById(reel.id, (item) => ({ ...item, ...res.data.data }));
      }
      Swal.fire({
        title: navigator.share ? "Shared successfully" : "Reel link copied",
        icon: "success",
        timer: 1200,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  const handleCommentSubmit = async (e, reelId) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: location } });
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await addCommentApi(reelId, { user_id: user.id, comment: newComment });
      setNewComment("");
      if (res.data?.success && res.data?.data) {
        if (res.data.data.comment) {
          setComments((prev) => [res.data.data.comment, ...prev]);
        }
        updateReelById(reelId, (item) => ({
          ...item,
          comments_count: res.data.data.comments_count ?? Number(item.comments_count || 0) + 1
        }));
      }
    } catch (err) {
      Swal.fire("Error", getErrorMessage(err, "Failed to add comment"), "error");
    }
  };

  const handleDeleteComment = async (commentId, reelId) => {
    try {
      const res = await deleteReelCommentApi(reelId, commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      updateReelById(reelId, (item) => ({
        ...item,
        comments_count: res.data?.data?.comments_count ?? Math.max(0, Number(item.comments_count || 0) - 1)
      }));
    } catch (err) {
      Swal.fire("Error", getErrorMessage(err, "Failed to delete comment"), "error");
    }
  };

  const handleReport = async (reel) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: location } });
      return;
    }

    const { value: reason } = await Swal.fire({
      title: "Report Reel",
      input: "textarea",
      inputLabel: "Why are you reporting this video?",
      inputPlaceholder: "Type your reason here...",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "You need to write something!";
      }
    });

    if (reason) {
      try {
        await reportReelApi(reel.id, { user_id: user.id, reason });
        Swal.fire("Thank You!", "Your report has been submitted for review.", "success");
      } catch (err) {
        console.error("Report error:", err);
      }
    }
  };

  // 4. CTA Actions
  const handleChatCTA = (expertId) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: location } });
      return;
    }
    startChat(expertId);
  };

  const handleCallCTA = (expertId) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: location } });
      return;
    }
    navigate(`/user/voice-call/${expertId}`);
  };

  const handleProfileCTA = (reel, state) => {
    const routeId = getExpertProfileRouteId(reel);
    if (!routeId) {
      Swal.fire("Error", "Expert profile is not available for this reel.", "error");
      return;
    }
    navigate(`/user/experts/${routeId}`, state ? { state } : undefined);
  };

  const renderExpertAvatar = (reel, extraProps = {}) => {
    const avatarSrc = resolveExpertAvatar(reel);
    const avatarKey = `${reel?.id || "reel"}-${avatarSrc || "fallback"}`;
    const displayName = getReelDisplayName(reel);
    if (!avatarSrc || failedAvatarKeys.has(avatarKey)) {
      return (
        <AvatarFallback {...extraProps} aria-label={displayName}>
          {getInitials(displayName)}
        </AvatarFallback>
      );
    }

    return (
      <Avatar
        {...extraProps}
        src={avatarSrc}
        alt={displayName}
        onError={() => {
          setFailedAvatarKeys((prev) => new Set(prev).add(avatarKey));
        }}
      />
    );
  };

  // SEO details for active reel
  const currentReel = reels[activeIdx];

  return (
    <Container>
      <ReelsPageGlobalStyle />
      {ChatPopups}
      {currentReel && (
        <Helmet>
          <title>{`${currentReel.title} | G9Expert Reel`}</title>
          <meta name="description" content={currentReel.caption || currentReel.title} />
          <link rel="canonical" href={`${window.location.origin}/user/reels/${currentReel.slug}`} />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="video.other" />
          <meta property="og:title" content={currentReel.title} />
          <meta property="og:description" content={currentReel.caption || currentReel.title} />
          <meta property="og:image" content={currentReel.thumbnail_url} />
          <meta property="og:url" content={`${window.location.origin}/user/reels/${currentReel.slug}`} />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={currentReel.title} />
          <meta name="twitter:description" content={currentReel.caption || currentReel.title} />
          <meta name="twitter:image" content={currentReel.thumbnail_url} />

          {/* JSON-LD VideoObject Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": currentReel.title,
              "description": currentReel.caption || currentReel.title,
              "thumbnailUrl": currentReel.thumbnail_url || "https://g9expert.com/logo.webp",
              "uploadDate": currentReel.created_at,
              "contentUrl": currentReel.video_url,
              "embedUrl": `${window.location.origin}/user/reels/${currentReel.slug}`,
              "publisher": {
                "@type": "Organization",
                "name": "G9Expert",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://g9expert.com/logo.webp"
                }
              }
            })}
          </script>
        </Helmet>
      )}

      {loading ? (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      ) : reels.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h3>No Reels Available</h3>
          <p>Please check back later.</p>
        </div>
      ) : (
        <ReelsFeed ref={containerRef} onScroll={handleReelsScroll}>
          {reels.map((reel, index) => (
            <ReelWrapper key={reel.id} data-index={index} className="reel-slide">
              {(() => {
                const displayName = getReelDisplayName(reel);
                const expertId = getReelExpertId(reel);
                return (
                  <>
              {/* VIDEO SECTION */}
              <PlayerSection>
                <SoundToggle onClick={(event) => {
                  event.stopPropagation();
                  setIsMuted(!isMuted);
                }}>
                  {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                </SoundToggle>

                <VideoContainer onClick={(event) => handleVideoToggle(event, reel, index)}>
                  <VideoElement
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el;
                      else delete videoRefs.current[index];
                    }}
                    src={reel.video_url}
                    poster={reel.thumbnail_url}
                    loop
                    muted={isMuted}
                    playsInline
                    preload={index === activeIdx || index === activeIdx + 1 ? "metadata" : "none"}
                    onTimeUpdate={(event) => handleVideoTimeUpdate(reel, event.currentTarget)}
                  />

                  <PlayToggleOverlay
                    $visible={manualPausedReelIds.has(reel.id) || playFeedback?.reelId === reel.id}
                    $persistent={manualPausedReelIds.has(reel.id)}
                    aria-hidden="true"
                  >
                    {manualPausedReelIds.has(reel.id) || playFeedback?.type === "play" ? <FiPlay /> : <FiPause />}
                  </PlayToggleOverlay>

                  {/* Mobile Only Overlay */}
                  <VideoOverlay>
                    <MobileOverlayContent onClick={(event) => event.stopPropagation()}>
                      <ExpertMeta onClick={(event) => {
                        event.stopPropagation();
                        handleProfileCTA(reel);
                      }}>
                        {renderExpertAvatar(reel)}
                        <div>
                          <NameText>{displayName}</NameText>
                          {reel.category_name && <CategoryTag>{reel.category_name}</CategoryTag>}
                        </div>
                      </ExpertMeta>

                      <TitleText>{reel.title}</TitleText>
                      {reel.caption && <CaptionText>{reel.caption}</CaptionText>}
                    </MobileOverlayContent>
                  </VideoOverlay>

                  {/* Floating Action Column (Mobile Only) */}
                  <ActionColumn className="reel-actions-overlay" onClick={(event) => event.stopPropagation()}>
                    <ActionButton
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                      aria-label={isMuted ? "Turn audio on" : "Turn audio off"}
                    >
                      {isMuted ? <FiVolumeX /> : <FiVolume2 />}
                    </ActionButton>
                    <ActionLabel>Audio</ActionLabel>

                    <ActionButton active={reel.is_liked} disabled={pendingActions[`like-${reel.id}`]} onClick={(event) => {
                      event.stopPropagation();
                      handleLike(reel, index);
                    }}>
                      <FiHeart />
                    </ActionButton>
                    <ActionLabel>{reel.likes_count}</ActionLabel>

                    <ActionButton onClick={(event) => {
                      event.stopPropagation();
                      openComments(reel);
                    }}>
                      <FiMessageCircle />
                    </ActionButton>
                    <ActionLabel>{reel.comments_count}</ActionLabel>

                    <ActionButton active={reel.is_saved} disabled={pendingActions[`save-${reel.id}`]} onClick={(event) => {
                      event.stopPropagation();
                      handleSave(reel, index);
                    }}>
                      <FiBookmark />
                    </ActionButton>
                    <ActionLabel>{reel.saves_count}</ActionLabel>

                    <ActionButton onClick={(event) => {
                      event.stopPropagation();
                      handleShare(reel);
                    }}>
                      <FiShare2 />
                    </ActionButton>
                    <ActionLabel>Share</ActionLabel>

                    <ActionButton onClick={(event) => {
                      event.stopPropagation();
                      handleReport(reel);
                    }}>
                      <FiAlertTriangle />
                    </ActionButton>
                    <ActionLabel>Report</ActionLabel>
                  </ActionColumn>

                  {/* CTA Buttons (Mobile Only) */}
                  <CtaRow onClick={(event) => event.stopPropagation()}>
                    <CtaButton variant="primary" onClick={(event) => {
                      event.stopPropagation();
                      handleChatCTA(expertId);
                    }}>
                      <FiMessageSquare /> Chat
                    </CtaButton>
                    <CtaButton variant="primary" onClick={(event) => {
                      event.stopPropagation();
                      handleCallCTA(expertId);
                    }}>
                      <FiPhone /> Call
                    </CtaButton>
                    <CtaButton onClick={(event) => {
                      event.stopPropagation();
                      handleProfileCTA(reel);
                    }}>
                      <FiUser /> Profile
                    </CtaButton>
                    <CtaButton onClick={(event) => {
                      event.stopPropagation();
                      handleProfileCTA(reel, { scrollToBooking: true });
                    }}>
                      <FiCalendar /> Book
                    </CtaButton>
                  </CtaRow>
                </VideoContainer>
              </PlayerSection>

              {/* DESKTOP ONLY SIDEBAR */}
              <DesktopSidebar>
                <DesktopHeader>
                  {renderExpertAvatar(reel, { onClick: () => handleProfileCTA(reel) })}
                  <div>
                    <NameText onClick={() => handleProfileCTA(reel)}>{displayName}</NameText>
                    {reel.category_name && <CategoryTag>{reel.category_name}</CategoryTag>}
                  </div>
                </DesktopHeader>

                <DesktopInfo>
                  <TitleText>{reel.title}</TitleText>
                  {reel.caption && <CaptionText>{reel.caption}</CaptionText>}
                </DesktopInfo>

                <SectionDivider />

                {/* Inline Action Counts for Desktop */}
                <ActionColumn className="reel-actions-sidebar">
                  <ActionButton active={reel.is_liked} disabled={pendingActions[`like-${reel.id}`]} onClick={() => handleLike(reel, index)}>
                    <FiHeart />
                    <span>{reel.is_liked ? "Liked" : "Like"} ({reel.likes_count || 0})</span>
                  </ActionButton>

                  <ActionButton onClick={() => openComments(reel)}>
                    <FiMessageCircle />
                    <span>Comments ({reel.comments_count || 0})</span>
                  </ActionButton>

                  <ActionButton active={reel.is_saved} disabled={pendingActions[`save-${reel.id}`]} onClick={() => handleSave(reel, index)}>
                    <FiBookmark />
                    <span>{reel.is_saved ? "Saved" : "Save"} ({reel.saves_count || 0})</span>
                  </ActionButton>

                  <ActionButton onClick={() => handleShare(reel)}>
                    <FiShare2 />
                    <span>Share ({reel.shares_count || 0})</span>
                  </ActionButton>

                  <ActionButton onClick={() => handleReport(reel)}>
                    <FiAlertTriangle />
                    <span>Report</span>
                  </ActionButton>
                </ActionColumn>

                <SectionDivider />

                {/* Comments Listing */}
                <CommentsSection>
                  <CommentsHeader>Comments ({reel.comments_count || 0})</CommentsHeader>
                  <CommentsList>
                    {commentsReelId !== reel.id ? (
                      <p style={{ color: "#71717a", fontSize: "13px", textAlign: "center" }}>Open comments to join the conversation.</p>
                    ) : loadingComments ? (
                      <Spinner style={{ margin: "20px auto", width: "24px", height: "24px" }} />
                    ) : comments.length === 0 ? (
                      <p style={{ color: "#71717a", fontSize: "13px", textAlign: "center" }}>No comments yet. Start the conversation!</p>
                    ) : (
                      comments.map((comment) => (
                        <CommentRow key={comment.id}>
                          <CommentAvatar
                            src={comment.user_profile_photo || comment.expert_profile_photo || "https://placehold.co/100x100"}
                            alt={comment.user_name || comment.expert_name}
                          />
                          <CommentContent>
                            <CommentName>{comment.user_name || comment.expert_name || "User"}</CommentName>
                            <CommentText>{comment.comment}</CommentText>
                            {Number(comment.user_id) === Number(user?.id) && (
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(comment.id, reel.id)}
                                style={{ background: "none", border: 0, color: "#a1a1aa", padding: 0, textAlign: "left", cursor: "pointer", fontSize: "12px" }}
                              >
                                Delete
                              </button>
                            )}
                          </CommentContent>
                        </CommentRow>
                      ))
                    )}
                  </CommentsList>

                  {commentsReelId === reel.id && (
                    <CommentInputRow onSubmit={(e) => handleCommentSubmit(e, reel.id)}>
                      <CommentInput
                        id={`comments-input-${index}`}
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <CommentSubmitButton type="submit">Post</CommentSubmitButton>
                    </CommentInputRow>
                  )}
                </CommentsSection>

                <SectionDivider />

                {/* Desktop CTA row */}
                <CtaRow>
                  <CtaButton variant="primary" onClick={() => handleChatCTA(expertId)}>
                    <FiMessageSquare /> Chat with Expert
                  </CtaButton>
                  <CtaButton variant="primary" onClick={() => handleCallCTA(expertId)}>
                    <FiPhone /> Call Now
                  </CtaButton>
                  <CtaButton onClick={() => handleProfileCTA(reel)}>
                    <FiUser /> View Full Profile
                  </CtaButton>
                  <CtaButton onClick={() => handleProfileCTA(reel, { scrollToBooking: true })}>
                    <FiCalendar /> Book Consultation
                  </CtaButton>
                </CtaRow>
              </DesktopSidebar>
                  </>
                );
              })()}
            </ReelWrapper>
          ))}
        </ReelsFeed>
      )}

      {commentsOpen && currentReel && (
        <MobileCommentsBackdrop onClick={() => setCommentsOpen(false)}>
          <MobileCommentsPanel onClick={(event) => event.stopPropagation()}>
            <MobileCommentsHeader>
              <strong>Comments ({currentReel.comments_count || 0})</strong>
              <button type="button" onClick={() => setCommentsOpen(false)}>Close</button>
            </MobileCommentsHeader>
            <CommentsList>
              {loadingComments ? (
                <Spinner style={{ margin: "20px auto", width: "24px", height: "24px" }} />
              ) : comments.length === 0 ? (
                <p style={{ color: "#71717a", fontSize: "13px", textAlign: "center" }}>No comments yet. Start the conversation!</p>
              ) : (
                comments.map((comment) => (
                  <CommentRow key={comment.id}>
                    <CommentAvatar
                      src={comment.user_profile_photo || "https://placehold.co/100x100"}
                      alt={comment.user_name || "User"}
                    />
                    <CommentContent>
                      <CommentName>{comment.user_name || "User"}</CommentName>
                      <CommentText>{comment.comment}</CommentText>
                      {Number(comment.user_id) === Number(user?.id) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id, currentReel.id)}
                          style={{ background: "none", border: 0, color: "#a1a1aa", padding: 0, textAlign: "left", cursor: "pointer", fontSize: "12px" }}
                        >
                          Delete
                        </button>
                      )}
                    </CommentContent>
                  </CommentRow>
                ))
              )}
            </CommentsList>
            <CommentInputRow onSubmit={(e) => handleCommentSubmit(e, currentReel.id)}>
              <CommentInput
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <CommentSubmitButton type="submit">Post</CommentSubmitButton>
            </CommentInputRow>
          </MobileCommentsPanel>
        </MobileCommentsBackdrop>
      )}
    </Container>
  );
}
