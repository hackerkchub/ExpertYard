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
  FiPause,
  FiEye,
  FiStar,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiX
} from "react-icons/fi";
import Swal from "sweetalert2";
import PremiumCenterLoader from "../../../../shared/components/Loader/PremiumCenterLoader";
import { APP_CONFIG } from "../../../../config/appConfig";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import useChatRequest from "../../../../shared/hooks/useChatRequest";
import {
  getReelsFeedApi,
  getReelByIdApi,
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

import "./ReelsPage.css";

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
  const [isMuted, setIsMuted] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsReelId, setCommentsReelId] = useState(null);
  const [pendingActions, setPendingActions] = useState({});
  const [manualPausedReelIds, setManualPausedReelIds] = useState(() => new Set());
  const [playFeedback, setPlayFeedback] = useState(null);
  const [failedAvatarKeys, setFailedAvatarKeys] = useState(() => new Set());
  const [showDesktopComments, setShowDesktopComments] = useState(false);

  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const viewedReelsRef = useRef(new Set());
  const viewTimersRef = useRef({});
  const snapTimerRef = useRef(null);
  const snapLockRef = useRef(false);
  const playFeedbackTimerRef = useRef(null);
  const allReelsPoolRef = useRef([]);

  // One-gesture navigation lock refs
  const isNavigatingRef = useRef(false);
  const lastNavTimeRef = useRef(0);
  const wheelLockTimeoutRef = useRef(null);
  const touchStartYRef = useRef(null);
  const activeIdxRef = useRef(activeIdx);

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  // Utility to shuffle an array (Fisher-Yates)
  const shuffleArray = useCallback((array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // Infinite loop: append a reshuffled batch of reels when reaching near the end
  const appendMoreReels = useCallback(() => {
    const pool = allReelsPoolRef.current;
    if (!pool || pool.length === 0) return;

    setReels((prevReels) => {
      if (prevReels.length === 0) return prevReels;
      const lastReel = prevReels[prevReels.length - 1];

      let shuffled = shuffleArray(pool);

      // Prevent immediate duplicate if first item of new shuffle matches last reel
      if (shuffled.length > 1 && String(shuffled[0].id) === String(lastReel.id)) {
        const temp = shuffled[0];
        shuffled[0] = shuffled[1];
        shuffled[1] = temp;
      }

      return [...prevReels, ...shuffled];
    });
  }, [shuffleArray]);

  const snapToReel = useCallback((index, behavior = "smooth") => {
    const container = containerRef.current;
    if (!container) return;

    const target = container.querySelector(`[data-index="${index}"]`);
    if (!target) return;

    isNavigatingRef.current = true;
    snapLockRef.current = true;
    lastNavTimeRef.current = Date.now();

    if (wheelLockTimeoutRef.current) {
      window.clearTimeout(wheelLockTimeoutRef.current);
    }

    target.scrollIntoView({ block: "start", behavior });

    wheelLockTimeoutRef.current = window.setTimeout(() => {
      snapLockRef.current = false;
      isNavigatingRef.current = false;
    }, 550);
  }, []);

  const navigateToReel = useCallback((direction) => {
    const now = Date.now();
    if (isNavigatingRef.current || snapLockRef.current || now - lastNavTimeRef.current < 500) {
      return false;
    }

    const currentIdx = activeIdxRef.current;
    let targetIdx = currentIdx;

    if (direction === "next" && currentIdx < reels.length - 1) {
      targetIdx = currentIdx + 1;
    } else if (direction === "prev" && currentIdx > 0) {
      targetIdx = currentIdx - 1;
    } else {
      return false;
    }

    if (targetIdx !== currentIdx) {
      setShowDesktopComments(false);
      snapToReel(targetIdx);
      return true;
    }
    return false;
  }, [reels.length, snapToReel]);

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
      if (wheelLockTimeoutRef.current) {
        window.clearTimeout(wheelLockTimeoutRef.current);
      }
    };
  }, []);

  // Wheel / Trackpad One-Gesture Lock Listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const handleWheelEvent = (e) => {
      if (
        e.target.closest('.desktop-sidebar-card') ||
        e.target.closest('.desktop-scrollable-content') ||
        e.target.closest('.desktop-expert-header-box') ||
        e.target.closest('.desktop-fixed-actions-footer') ||
        e.target.closest('.mobile-comments-panel') ||
        e.target.closest('.desktop-comments-expanded') ||
        e.target.closest('textarea') ||
        e.target.closest('input') ||
        e.target.closest('.MuiDialog-root')
      ) {
        return;
      }

      e.preventDefault();

      const delta = e.deltaY;
      if (Math.abs(delta) < 20) return;

      if (delta > 0) {
        navigateToReel("next");
      } else if (delta < 0) {
        navigateToReel("prev");
      }
    };

    container.addEventListener("wheel", handleWheelEvent, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheelEvent);
    };
  }, [navigateToReel]);

  // Touch Swipe One-Gesture Lock Listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e) => {
      if (touchStartYRef.current === null || e.changedTouches.length === 0) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartYRef.current - touchEndY;
      touchStartYRef.current = null;

      if (
        e.target.closest('.mobile-comments-panel') ||
        e.target.closest('.desktop-scrollable-content') ||
        e.target.closest('textarea') ||
        e.target.closest('input')
      ) {
        return;
      }

      if (Math.abs(diffY) > 40) {
        if (diffY > 0) {
          navigateToReel("next");
        } else {
          navigateToReel("prev");
        }
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigateToReel]);

  // Keyboard ArrowDown / ArrowUp Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        navigateToReel('next');
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        navigateToReel('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateToReel]);

  useEffect(() => {
    setManualPausedReelIds(new Set());
    setPlayFeedback(null);
    if (playFeedbackTimerRef.current) {
      window.clearTimeout(playFeedbackTimerRef.current);
    }
  }, [activeIdx]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (window.innerWidth < 992) return;
      if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (activeIdx < reels.length - 1) {
          e.preventDefault();
          snapToReel(activeIdx + 1);
          setShowDesktopComments(false);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (activeIdx > 0) {
          e.preventDefault();
          snapToReel(activeIdx - 1);
          setShowDesktopComments(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx, reels.length, snapToReel]);

  // Initial Reel Loading: Clicked Reel locked at Index 0 & Remaining Shuffled
  useEffect(() => {
    const fetchReels = async () => {
      setLoading(true);
      setActiveIdx(0);
      try {
        const searchParams = new URLSearchParams(location.search);
        const targetIdOrSlug =
          slug ||
          searchParams.get("id") ||
          searchParams.get("slug") ||
          searchParams.get("reel_id") ||
          searchParams.get("reelId") ||
          location.state?.id ||
          location.state?.reelId ||
          location.state?.slug;

        const params = { user_id: user?.id || null, limit: 50, offset: 0 };
        const feedRes = await getReelsFeedApi(params);
        let feedList = [];

        if (feedRes.data && feedRes.data.success) {
          feedList = feedRes.data.data || [];
        }

        let clickedReel = null;

        if (targetIdOrSlug) {
          clickedReel = feedList.find(
            (r) =>
              String(r.id) === String(targetIdOrSlug) ||
              String(r.slug) === String(targetIdOrSlug)
          );

          if (!clickedReel) {
            try {
              const isNumeric = /^\d+$/.test(String(targetIdOrSlug));
              const singleRes = isNumeric
                ? await getReelByIdApi(targetIdOrSlug)
                : await getReelBySlugApi(targetIdOrSlug, params);

              if (singleRes.data && singleRes.data.success && singleRes.data.data) {
                clickedReel = singleRes.data.data;
              }
            } catch (singleErr) {
              console.warn("Could not fetch single reel by identifier:", targetIdOrSlug, singleErr);
            }
          }
        }

        let remaining = feedList;
        if (clickedReel) {
          remaining = feedList.filter((r) => String(r.id) !== String(clickedReel.id));
        }

        const shuffledRemaining = shuffleArray(remaining);

        let initialList = [];
        if (clickedReel) {
          initialList = [clickedReel, ...shuffledRemaining];
        } else {
          initialList = shuffleArray(feedList);
        }

        const fullPool = clickedReel
          ? [clickedReel, ...remaining]
          : feedList;
        allReelsPoolRef.current = fullPool;

        setReels(initialList);

        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
        }
      } catch (err) {
        console.error("Error loading reels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, [slug, location.search, location.state, user?.id, shuffleArray]);

  // Infinite Scroll Trigger: Auto-append reshuffled pool when within 3 reels of the end
  useEffect(() => {
    if (reels.length > 0 && activeIdx >= reels.length - 3) {
      appendMoreReels();
    }
  }, [activeIdx, reels.length, appendMoreReels]);

  const snapToNearestReel = useCallback(() => {
    const container = containerRef.current;
    if (!container || snapLockRef.current || isNavigatingRef.current) return;

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
          setActiveIdx((prevIdx) => {
            if (prevIdx !== index) {
              setShowDesktopComments(false);
              return index;
            }
            return prevIdx;
          });
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

  const toggleDesktopComments = useCallback((reel) => {
    if (showDesktopComments && commentsReelId === reel.id) {
      setShowDesktopComments(false);
      return;
    }
    setShowDesktopComments(true);
    setCommentsReelId(reel.id);
    fetchComments(reel.id);
  }, [fetchComments, showDesktopComments, commentsReelId]);

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

  useEffect(() => {
    if (reels.length === 0) return;

    const activeReel = reels[activeIdx];
    Object.values(viewTimersRef.current).forEach(clearTimeout);
    viewTimersRef.current = {};

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

          video.play().catch(() => {
            if (!video.muted) {
              video.muted = true;
              video.play().catch(() => {});
            }
          });
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
    const commentText = newComment.trim();
    if (!commentText) return;

    try {
      const res = await addCommentApi(reelId, { user_id: user.id, comment: commentText });
      setNewComment("");
      if (res.data?.success) {
        const returnedComment = res.data?.data?.comment || res.data?.data;
        const normalized = {
          id: returnedComment?.id || Date.now(),
          user_id: user?.id,
          user_name: returnedComment?.user_name || user?.name || user?.full_name || user?.username || "User",
          user_profile_photo: returnedComment?.user_profile_photo || user?.profile_picture || user?.profile_photo || null,
          comment: returnedComment?.comment || commentText,
          created_at: returnedComment?.created_at || new Date().toISOString()
        };

        setComments((prev) => [normalized, ...prev]);

        updateReelById(reelId, (item) => ({
          ...item,
          comments_count: res.data?.data?.comments_count ?? Number(item.comments_count || 0) + 1
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

  const currentReel = reels[activeIdx];

  return (
    <Container>
      <ReelsPageGlobalStyle />
      {typeof ChatPopups === "function" ? <ChatPopups /> : ChatPopups}
      {currentReel && (
        <Helmet>
          <title>{`${currentReel.title} | G9Expert Reel`}</title>
          <meta name="description" content={currentReel.caption || currentReel.title} />
          <link rel="canonical" href={`${window.location.origin}/user/reels/${currentReel.slug}`} />
          <meta property="og:type" content="video.other" />
          <meta property="og:title" content={currentReel.title} />
          <meta property="og:description" content={currentReel.caption || currentReel.title} />
          <meta property="og:image" content={currentReel.thumbnail_url} />
          <meta property="og:url" content={`${window.location.origin}/user/reels/${currentReel.slug}`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={currentReel.title} />
          <meta name="twitter:description" content={currentReel.caption || currentReel.title} />
          <meta name="twitter:image" content={currentReel.thumbnail_url} />
        </Helmet>
      )}

      {loading ? (
        <PremiumCenterLoader />
      ) : reels.length === 0 ? (
        <div className="reels-empty-state">
          <h3>No Reels Available</h3>
          <p>Check back later for expert video consultations.</p>
        </div>
      ) : (
        <ReelsFeed ref={containerRef}>
          {reels.map((reel, index) => (
            <ReelWrapper
              key={`${reel.id}-${index}`}
              data-index={index}
              className={`reel-slide ${index === activeIdx ? 'active-desktop-reel' : ''}`}
              $isActive={index === activeIdx}
            >
              {(() => {
                const displayName = getReelDisplayName(reel);
                const expertId = getReelExpertId(reel);
                const rating = Number(reel?.expert_rating || reel?.avg_rating || 4.8).toFixed(1);
                const experience = reel?.experience || reel?.expert_experience || "5+";
                
                return (
                  <>
                    {/* VIDEO SECTION */}
                    <PlayerSection>
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

                        {/* Floating Action Column - Mobile Only */}
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

                          <ActionButton $active={reel.is_liked} disabled={pendingActions[`like-${reel.id}`]} onClick={(event) => {
                            event.stopPropagation();
                            handleLike(reel, index);
                          }}>
                            <FiHeart />
                          </ActionButton>
                          <ActionLabel>{reel.likes_count}</ActionLabel>

                          <ActionButton onClick={(event) => {
                            event.stopPropagation();
                            openComments(reel);
                            if (window.innerWidth >= 992) {
                              toggleDesktopComments(reel);
                            }
                          }}>
                            <FiMessageCircle />
                          </ActionButton>
                          <ActionLabel>{reel.comments_count}</ActionLabel>

                          <ActionButton $active={reel.is_saved} disabled={pendingActions[`save-${reel.id}`]} onClick={(event) => {
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

                        {/* CTA Buttons - Mobile Only */}
                        <CtaRow onClick={(event) => event.stopPropagation()}>
                          <CtaButton $variant="primary" onClick={(event) => {
                            event.stopPropagation();
                            handleChatCTA(expertId);
                          }}>
                            <FiMessageSquare /> Chat
                          </CtaButton>
                          <CtaButton $variant="primary" onClick={(event) => {
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

                    {/* DESKTOP SIDEBAR - Only visible on desktop */}
                    <DesktopSidebar className="desktop-sidebar-card">
                      {/* 1. EXPERT INFORMATION HEADER (Fixed Top Horizontal Row) */}
                      <div className="desktop-expert-header-box">
                        <div className="desktop-expert-header-row">
                          <div className="desktop-expert-header-left">
                            <div className="desktop-expert-avatar-wrapper">
                              {renderExpertAvatar(reel, { onClick: () => handleProfileCTA(reel) })}
                            </div>
                            <div className="desktop-expert-info">
                              <NameText onClick={() => handleProfileCTA(reel)} className="desktop-expert-name">
                                {displayName}
                              </NameText>
                              <div className="desktop-expert-category">
                                {reel.category_name || "G9 Expert Consultant"}
                              </div>
                              <div className="desktop-expert-meta">
                                <span className="desktop-expert-rating">
                                  <FiStar size={13} fill="#FBBF24" color="#FBBF24" /> {rating}
                                </span>
                                <span className="desktop-expert-meta-sep">|</span>
                                <span className="desktop-expert-exp">
                                  <FiClock size={13} /> {experience} Yrs Exp
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="desktop-expert-header-right">
                            <span className="desktop-online-indicator" title="Online"></span>
                          </div>
                        </div>
                      </div>

                      {/* 2. MIDDLE SCROLLABLE SECTION (Always visible underneath) */}
                      <div className="desktop-scrollable-content">
                        <div>
                          <TitleText style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', lineHeight: '1.4', marginBottom: '10px' }}>
                            {reel.title}
                          </TitleText>
                          {reel.caption && (
                            <p style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.5', margin: '0 0 10px' }}>
                              {reel.caption}
                            </p>
                          )}
                          {reel.category_name && (
                            <div className="flex flex-wrap gap-2 mt-2" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: '#60a5fa', background: 'rgba(96, 165, 250, 0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                                #{reel.category_name.replace(/\s+/g, '')}
                              </span>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: '#60a5fa', background: 'rgba(96, 165, 250, 0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                                #G9Expert
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Reel Insights / Statistics Box */}
                        <div className="desktop-insights-box">
                          <h3 className="desktop-insights-title">Reel Insights</h3>
                          
                          <div className="desktop-stats-grid" style={{ paddingBottom: 0, marginBottom: 0, borderBottom: 'none' }}>
                            <div className="desktop-stat-item" onClick={() => handleLike(reel, index)} style={{ cursor: 'pointer' }}>
                              <FiHeart className="stat-icon" style={{ color: reel.is_liked ? '#ef4444' : '#3b82f6' }} />
                              <span className="stat-val">{reel.likes_count || 0}</span>
                              <span className="stat-lbl">Likes</span>
                            </div>
                            <div className="desktop-stat-item">
                              <FiEye className="stat-icon" />
                              <span className="stat-val">{reel.views_count || 0}</span>
                              <span className="stat-lbl">Views</span>
                            </div>
                            <div className="desktop-stat-item" onClick={() => toggleDesktopComments(reel)} style={{ cursor: 'pointer' }}>
                              <FiMessageCircle className="stat-icon" style={{ color: '#3b82f6' }} />
                              <span className="stat-val">{reel.comments_count || 0}</span>
                              <span className="stat-lbl">Comments</span>
                            </div>
                            <div className="desktop-stat-item" onClick={() => handleSave(reel, index)} style={{ cursor: 'pointer' }}>
                              <FiBookmark className="stat-icon" style={{ color: reel.is_saved ? '#3b82f6' : '#9ca3af' }} />
                              <span className="stat-val">{reel.saves_count || 0}</span>
                              <span className="stat-lbl">Saves</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. FLOATING OVERLAY COMMENTS MODAL (Appears floating over the expert panel on desktop) */}
                      {showDesktopComments && commentsReelId === reel.id && (
                        <div className="desktop-right-comments-card">
                          <div className="desktop-comments-header">
                            <span>Comments ({reel.comments_count || comments.length || 0})</span>
                            <button className="desktop-comments-header-close" type="button" onClick={() => setShowDesktopComments(false)}>
                              <FiX size={18} />
                            </button>
                          </div>
                          
                          <div className="desktop-comments-body">
                            {loadingComments ? (
                              <Spinner style={{ margin: "30px auto", width: "24px", height: "24px" }} />
                            ) : comments.length === 0 ? (
                              <p style={{ color: "#a1a1aa", fontSize: "13px", textAlign: "center", margin: "auto 0" }}>
                                No comments yet. Be the first to start the conversation!
                              </p>
                            ) : (
                              comments.map((c) => (
                                <div className="desktop-comment-item" key={c.id}>
                                  {c.user_profile_photo ? (
                                    <img className="desktop-comment-avatar" src={c.user_profile_photo} alt={c.user_name || "User"} />
                                  ) : (
                                    <div className="desktop-comment-avatar-fallback">
                                      {getInitials(c.user_name || "U")}
                                    </div>
                                  )}
                                  <div className="desktop-comment-main">
                                    <div className="desktop-comment-user-row">
                                      <span className="desktop-comment-user">{c.user_name || "User"}</span>
                                      <span className="desktop-comment-time">{c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}</span>
                                    </div>
                                    <p className="desktop-comment-text">{c.comment}</p>
                                    {Number(c.user_id) === Number(user?.id) && (
                                      <div className="desktop-comment-actions">
                                        <button
                                          type="button"
                                          className="desktop-comment-reply-btn delete-btn"
                                          onClick={() => handleDeleteComment(c.id, reel.id)}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          <form className="desktop-comments-footer-input" onSubmit={(e) => handleCommentSubmit(e, reel.id)}>
                            <input
                              type="text"
                              className="desktop-comment-input"
                              placeholder="Add a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button type="submit" className="desktop-comment-post-btn" disabled={!newComment.trim()}>
                              Post
                            </button>
                          </form>
                        </div>
                      )}

                      {/* 4. CONSULTATION ACTIONS (Fixed Bottom Footer) */}
                      <div className="desktop-fixed-actions-footer">
                        <div className="desktop-cta-row-primary">
                          <button className="btn-chat-now" onClick={() => handleChatCTA(expertId)}>
                            <FiMessageSquare size={18} /> Chat Now
                          </button>
                          <button className="btn-call-now" onClick={() => handleCallCTA(expertId)}>
                            <FiPhone size={18} /> Call Now
                          </button>
                        </div>
                        <div className="desktop-cta-row-secondary">
                          <button className="btn-view-profile" onClick={() => handleProfileCTA(reel)}>
                            View Profile
                          </button>
                          <button className="btn-book-consult" onClick={() => handleProfileCTA(reel, { scrollToBooking: true })}>
                            Book Consult
                          </button>
                        </div>
                      </div>
                    </DesktopSidebar>
                  </>
                );
              })()}
            </ReelWrapper>
          ))}
        </ReelsFeed>
      )}

      {/* Mobile Comments Modal */}
      {commentsOpen && currentReel && (
        <MobileCommentsBackdrop onClick={() => setCommentsOpen(false)}>
          <MobileCommentsPanel onClick={(event) => event.stopPropagation()}>
            <MobileCommentsHeader>
              <strong>Comments ({currentReel.comments_count || 0})</strong>
              <button type="button" onClick={() => setCommentsOpen(false)}>
                <FiX size={20} />
              </button>
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