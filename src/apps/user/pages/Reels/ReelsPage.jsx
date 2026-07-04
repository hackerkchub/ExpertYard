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
  FiUser
} from "react-icons/fi";
import Swal from "sweetalert2";
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
  saveReelApi,
  unsaveReelApi,
  logReelShareApi,
  reportReelApi
} from "../../../../shared/api/reels.api";

import {
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
  CtaRow,
  CtaButton,
  SoundToggle,
  LoadingOverlay,
  Spinner
} from "./ReelsPage.styles";

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

  const containerRef = useRef(null);
  const videoRefs = useRef({});

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

  // 2. IntersectionObserver to track visible video and play/pause
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index"), 10);
            setActiveIdx(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    const elements = document.querySelectorAll(".reel-slide");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [reels]);

  // Handle play/pause, view log based on active index
  useEffect(() => {
    if (reels.length === 0) return;

    // Log view for the active reel
    const activeReel = reels[activeIdx];
    if (activeReel) {
      logReelViewApi(activeReel.id, {
        user_id: user?.id || null,
        watch_time: 0,
        percentage_watched: 0
      }).catch(console.error);

      // Fetch comments for active reel
      setLoadingComments(true);
      getReelCommentsApi(activeReel.id)
        .then((res) => {
          if (res.data && res.data.success) {
            setComments(res.data.data || []);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingComments(false));
    }

    // Play active video, pause others
    Object.keys(videoRefs.current).forEach((key) => {
      const idx = parseInt(key, 10);
      const video = videoRefs.current[key];
      if (video) {
        if (idx === activeIdx) {
          video.play().catch((err) => console.log("Auto-play blocked:", err));
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [activeIdx, reels, user?.id]);

  // 3. Reels Interactivity (Like, Save, Share, Comment, Report)
  const handleLike = async (reel, index) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: location } });
      return;
    }

    const updated = [...reels];
    const item = updated[index];

    try {
      if (item.is_liked) {
        item.is_liked = 0;
        item.likes_count = Math.max(0, item.likes_count - 1);
        await unlikeReelApi(item.id, { user_id: user.id });
      } else {
        item.is_liked = 1;
        item.likes_count = item.likes_count + 1;
        await likeReelApi(item.id, { user_id: user.id });
      }
      setReels(updated);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleSave = async (reel, index) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: location } });
      return;
    }

    const updated = [...reels];
    const item = updated[index];

    try {
      if (item.is_saved) {
        item.is_saved = 0;
        item.saves_count = Math.max(0, item.saves_count - 1);
        await unsaveReelApi(item.id, { user_id: user.id });
      } else {
        item.is_saved = 1;
        item.saves_count = item.saves_count + 1;
        await saveReelApi(item.id, { user_id: user.id });
      }
      setReels(updated);
    } catch (err) {
      console.error("Save error:", err);
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
        Swal.fire({
          title: "Link Copied!",
          text: "Reel link copied to clipboard.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      }
      await logReelShareApi(reel.id, { user_id: user?.id || null, platform: "web_share" });
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
      await addCommentApi(reelId, { user_id: user.id, comment: newComment });
      setNewComment("");

      // Refresh comments
      const res = await getReelCommentsApi(reelId);
      if (res.data && res.data.success) {
        setComments(res.data.data || []);
      }
    } catch (err) {
      console.error("Comment submit error:", err);
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

  const handleProfileCTA = (expertId) => {
    navigate(`/user/experts/${expertId}`);
  };

  // SEO details for active reel
  const currentReel = reels[activeIdx];

  return (
    <Container>
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
        <ReelsFeed ref={containerRef}>
          {reels.map((reel, index) => (
            <ReelWrapper key={reel.id} data-index={index} className="reel-slide">
              {/* VIDEO SECTION */}
              <PlayerSection>
                <SoundToggle onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                </SoundToggle>

                <VideoContainer>
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
                  />

                  {/* Mobile Only Overlay */}
                  <VideoOverlay>
                    <MobileOverlayContent>
                      <ExpertMeta onClick={() => handleProfileCTA(reel.expert_id)}>
                        <Avatar src={reel.expert_profile_photo || "https://placehold.co/100x100"} alt={reel.expert_name} />
                        <div>
                          <NameText>{reel.expert_name}</NameText>
                          {reel.category_name && <CategoryTag>{reel.category_name}</CategoryTag>}
                        </div>
                      </ExpertMeta>

                      <TitleText>{reel.title}</TitleText>
                      {reel.caption && <CaptionText>{reel.caption}</CaptionText>}
                    </MobileOverlayContent>
                  </VideoOverlay>

                  {/* Floating Action Column (Mobile Only) */}
                  <ActionColumn>
                    <ActionButton active={reel.is_liked} onClick={() => handleLike(reel, index)}>
                      <FiHeart />
                    </ActionButton>
                    <ActionLabel>{reel.likes_count}</ActionLabel>

                    <ActionButton onClick={() => {
                      // Trigger comments modal or scroll on desktop
                      const element = document.getElementById(`comments-input-${index}`);
                      if (element) element.focus();
                    }}>
                      <FiMessageCircle />
                    </ActionButton>
                    <ActionLabel>{reel.comments_count}</ActionLabel>

                    <ActionButton active={reel.is_saved} onClick={() => handleSave(reel, index)}>
                      <FiBookmark />
                    </ActionButton>
                    <ActionLabel>{reel.saves_count}</ActionLabel>

                    <ActionButton onClick={() => handleShare(reel)}>
                      <FiShare2 />
                    </ActionButton>
                    <ActionLabel>Share</ActionLabel>

                    <ActionButton onClick={() => handleReport(reel)}>
                      <FiAlertTriangle />
                    </ActionButton>
                    <ActionLabel>Report</ActionLabel>
                  </ActionColumn>

                  {/* CTA Buttons (Mobile Only) */}
                  <CtaRow>
                    <CtaButton variant="primary" onClick={() => handleChatCTA(reel.expert_id)}>
                      <FiMessageSquare /> Chat
                    </CtaButton>
                    <CtaButton variant="primary" onClick={() => handleCallCTA(reel.expert_id)}>
                      <FiPhone /> Call
                    </CtaButton>
                    <CtaButton onClick={() => handleProfileCTA(reel.expert_id)}>
                      <FiUser /> Profile
                    </CtaButton>
                    <CtaButton onClick={() => handleProfileCTA(reel.expert_id)}>
                      <FiCalendar /> Book
                    </CtaButton>
                  </CtaRow>
                </VideoContainer>
              </PlayerSection>

              {/* DESKTOP ONLY SIDEBAR */}
              <DesktopSidebar>
                <DesktopHeader>
                  <Avatar src={reel.expert_profile_photo || "https://placehold.co/100x100"} alt={reel.expert_name} />
                  <div>
                    <NameText>{reel.expert_name}</NameText>
                    {reel.category_name && <CategoryTag>{reel.category_name}</CategoryTag>}
                  </div>
                </DesktopHeader>

                <DesktopInfo>
                  <TitleText>{reel.title}</TitleText>
                  {reel.caption && <CaptionText style={{ WebkitLineClamp: "initial", overflow: "visible" }}>{reel.caption}</CaptionText>}
                </DesktopInfo>

                <SectionDivider />

                {/* Inline Action Counts for Desktop */}
                <ActionColumn>
                  <ActionButton active={reel.is_liked} onClick={() => handleLike(reel, index)}>
                    <FiHeart />
                    <span>{reel.is_liked ? "Liked" : "Like"}</span>
                  </ActionButton>

                  <ActionButton active={reel.is_saved} onClick={() => handleSave(reel, index)}>
                    <FiBookmark />
                    <span>{reel.is_saved ? "Saved" : "Save"}</span>
                  </ActionButton>

                  <ActionButton onClick={() => handleShare(reel)}>
                    <FiShare2 />
                    <span>Share</span>
                  </ActionButton>

                  <ActionButton onClick={() => handleReport(reel)}>
                    <FiAlertTriangle />
                    <span>Report</span>
                  </ActionButton>
                </ActionColumn>

                <SectionDivider />

                {/* Comments Listing */}
                <CommentsSection>
                  <CommentsHeader>Comments ({comments.length})</CommentsHeader>
                  <CommentsList>
                    {loadingComments ? (
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
                          </CommentContent>
                        </CommentRow>
                      ))
                    )}
                  </CommentsList>

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
                </CommentsSection>

                <SectionDivider />

                {/* Desktop CTA row */}
                <CtaRow>
                  <CtaButton variant="primary" onClick={() => handleChatCTA(reel.expert_id)}>
                    <FiMessageSquare /> Chat with Expert
                  </CtaButton>
                  <CtaButton variant="primary" onClick={() => handleCallCTA(reel.expert_id)}>
                    <FiPhone /> Call Now
                  </CtaButton>
                  <CtaButton onClick={() => handleProfileCTA(reel.expert_id)}>
                    <FiUser /> View Full Profile
                  </CtaButton>
                  <CtaButton onClick={() => handleProfileCTA(reel.expert_id)}>
                    <FiCalendar /> Book Consultation
                  </CtaButton>
                </CtaRow>
              </DesktopSidebar>
            </ReelWrapper>
          ))}
        </ReelsFeed>
      )}
    </Container>
  );
}
