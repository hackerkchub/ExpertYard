// ManageReels.jsx - Updated with video playback - FIXED VERSION
import React, { useState, useEffect, useRef } from "react";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { getServicesByExpert } from "../../../../shared/api/service.api";
import {
  getExpertReelsApi,
  createExpertReelApi,
  updateExpertReelApi,
  deleteExpertReelApi,
  submitExpertReelApi
} from "../../../../shared/api/reels.api";

import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiX,
  FiEye,
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiShare2,
  FiPlay,
  FiPause,
  FiAlertCircle
} from "react-icons/fi";
import Swal from "sweetalert2";

import {
  PageContainer,
  HeaderRow,
  HeaderLeft,
  Title,
  Subtitle,
  UploadButton,
  ReelsGrid,
  ReelCard,
  VideoPreviewWrapper,
  CardVideo,
  CardThumbnail,
  ThumbnailOverlay,
  PlayIcon,
  StatusBadge,
  StatusDot,
  ReelContent,
  ReelTitle,
  ReelCaption,
  MetaRow,
  MetaTag,
  RejectedReasonBox,
  AnalyticsRow,
  AnalyticItem,
  ActionsRow,
  ActionButton,
  SubmitButtonFull,
  EmptyState,
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  CloseButton,
  Form,
  FormGroup,
  Input,
  Textarea,
  Select,
  FileUploadArea,
  FilePreview,
  SubmitButton,
  CancelButton,
  ModalFooter,
  SpinnerWrapper,
  InlineSpinner,
  UploadBox
} from "./ManageReels.styles";

const getApiErrorStatus = (err) => err?.response?.status || null;

const getApiErrorMessage = (err, fallback) => (
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  (typeof err === "string" ? err : null) ||
  fallback
);

const showReelsApiError = (err, fallback) => {
  const status = getApiErrorStatus(err);

  if (status === 403) {
    Swal.fire("Access Denied", "Access denied. Please login as expert.", "error");
    return;
  }

  if (status === 404) {
    Swal.fire("API Not Found", "Reels API endpoint not found. Please check backend route.", "error");
    return;
  }

  Swal.fire("Error", getApiErrorMessage(err, fallback), "error");
};

export default function ManageReels() {
  const { expertData } = useExpert();
  const { categories } = useCategory();

  const [reels, setReels] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingReelId, setPlayingReelId] = useState(null);

  // Form Modals
  const [showModal, setShowModal] = useState(false);
  const [editingReel, setEditingReel] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [linkedServiceId, setLinkedServiceId] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  // File input refs
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const videoRefs = useRef({});

  // Load data
  const loadData = async () => {
    if (!expertData?.expertId) return;
    setLoading(true);

    try {
      const res = await getExpertReelsApi();
      if (res.data && res.data.success) {
        setReels(res.data.data || []);
      } else {
        setReels([]);
      }
    } catch (err) {
      console.error("Error loading expert reels:", err);
      setReels([]);
    }

    try {
      const servicesRes = await getServicesByExpert(expertData.expertId);
      const sData = Array.isArray(servicesRes.data) ? servicesRes.data : servicesRes.data.data || [];
      setServices(sData);
    } catch (err) {
      console.error("Error loading expert services for reels:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [expertData?.expertId]);

  // Cleanup videos on unmount
  useEffect(() => {
    return () => {
      Object.values(videoRefs.current).forEach(video => {
        if (video) {
          video.pause();
        }
      });
    };
  }, []);

  // Handle video play/pause
  const toggleVideoPlay = (reelId) => {
    const video = videoRefs.current[reelId];
    if (!video) return;

    if (playingReelId === reelId) {
      // Pause current video
      video.pause();
      setPlayingReelId(null);
    } else {
      // Pause any previously playing video
      if (playingReelId && videoRefs.current[playingReelId]) {
        videoRefs.current[playingReelId].pause();
      }
      
      // Reset to beginning before playing
      video.currentTime = 0;
      
      // Play new video
      video.play().catch(err => {
        console.error("Error playing video:", err);
      });
      setPlayingReelId(reelId);
    }
  };

  // Handle video end
  const handleVideoEnd = (reelId) => {
    setPlayingReelId(null);
    if (videoRefs.current[reelId]) {
      videoRefs.current[reelId].currentTime = 0;
    }
  };

  // Handle open upload/edit modal
  const openModal = (reel = null) => {
    if (reel) {
      setEditingReel(reel);
      setTitle(reel.title || "");
      setCaption(reel.caption || "");
      setDescription(reel.description || "");
      setCategoryId(reel.category_id || "");
      setSubcategoryId(reel.subcategory_id || "");
      setLinkedServiceId(reel.linked_service_id || "");
      setVideoFile(null);
      setThumbnailFile(null);
    } else {
      setEditingReel(null);
      setTitle("");
      setCaption("");
      setDescription("");
      setCategoryId("");
      setSubcategoryId("");
      setLinkedServiceId("");
      setVideoFile(null);
      setThumbnailFile(null);
    }
    setShowModal(true);
  };

  // Close modal with cleanup
  const closeModal = () => {
    setShowModal(false);
    // Reset file inputs
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  // Submit form (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      Swal.fire("Error", "Title is required", "error");
      return;
    }
    if (!editingReel && !videoFile) {
      Swal.fire("Error", "Please select a video file to upload", "error");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("caption", caption);
      formData.append("description", description);
      if (categoryId) formData.append("category_id", categoryId);
      if (subcategoryId) formData.append("subcategory_id", subcategoryId);
      if (linkedServiceId) formData.append("linked_service_id", linkedServiceId);

      if (videoFile) {
        formData.append("video", videoFile);
      }
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (editingReel) {
        await updateExpertReelApi(editingReel.id, formData);
        Swal.fire("Success", "Reel updated successfully!", "success");
      } else {
        await createExpertReelApi(formData);
        Swal.fire("Success", "Reel created as draft. You can now submit it for approval.", "success");
      }

      closeModal();
      loadData();
    } catch (err) {
      console.error("Submit reel error:", err);
      showReelsApiError(err, "Failed to save reel");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Reel
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This reel will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it"
    });

    if (confirm.isConfirmed) {
      try {
        await deleteExpertReelApi(id);
        Swal.fire("Deleted!", "Your reel has been deleted.", "success");
        loadData();
      } catch (err) {
        console.error("Delete reel error:", err);
        showReelsApiError(err, "Failed to delete reel");
      }
    }
  };

  // Submit for Approval
  const handleSubmitForApproval = async (id) => {
    try {
      await submitExpertReelApi(id);
      Swal.fire("Success", "Submitted successfully! Admin will moderate it soon.", "success");
      loadData();
    } catch (err) {
      console.error("Submit approval error:", err);
      showReelsApiError(err, "Failed to submit for approval");
    }
  };

  // Helper functions
  const getReelStatus = (reel) => {
    if (typeof reel.status === "string") return reel.status;
    const statusCode = Number(reel.status_code ?? reel.status);
    if (statusCode === 1) return "approved";
    if (statusCode === 0) return "pending";
    if (statusCode === 2) return "rejected";
    if (statusCode === 3) return "blocked";
    return "draft";
  };

  const getReelStatusCode = (reel) => {
    const status = getReelStatus(reel);
    if (status === "approved") return 1;
    if (status === "pending") return 0;
    if (status === "rejected") return 2;
    if (status === "blocked") return 3;
    return -1;
  };

  const getReelStatusLabel = (reel) => {
    const status = getReelStatus(reel);
    if (status === "pending") return "Pending Approval";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusDotPulsing = (reel) => {
    const status = getReelStatus(reel);
    return status === "pending";
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Subcategories logic
  const selectedCatObj = categories.find(c => c.id === parseInt(categoryId));
  const subcategoriesList = selectedCatObj?.subcategories || [];

  return (
    <PageContainer>
      <HeaderRow>
        <HeaderLeft>
          <Title>Manage Expert Reels</Title>
          <Subtitle>
            Upload and manage your short videos to increase visibility and consultation requests.
          </Subtitle>
        </HeaderLeft>
        <UploadButton onClick={() => openModal()}>
          <FiPlus size={20} /> Upload New Reel
        </UploadButton>
      </HeaderRow>

      {loading ? (
        <SpinnerWrapper>
          <InlineSpinner />
        </SpinnerWrapper>
      ) : reels.length === 0 ? (
        <EmptyState>
          <span className="icon">🎬</span>
          <h3>No Reels Yet</h3>
          <p>
            Create your first professional reel and submit it for admin approval.
          </p>
          <UploadButton onClick={() => openModal()} style={{ margin: '0 auto' }}>
            <FiPlus size={20} /> Upload First Reel
          </UploadButton>
        </EmptyState>
      ) : (
        <ReelsGrid>
          {reels.map((reel) => {
            const statusCode = getReelStatusCode(reel);
            const statusLabel = getReelStatusLabel(reel);
            const status = getReelStatus(reel);
            const isPulsing = getStatusDotPulsing(reel);
            const isPlaying = playingReelId === reel.id;

            return (
              <ReelCard key={reel.id}>
                <VideoPreviewWrapper onClick={() => toggleVideoPlay(reel.id)}>
                  <CardVideo
                    ref={el => {
                      if (el) videoRefs.current[reel.id] = el;
                    }}
                    src={reel.video_url}
                    poster={reel.thumbnail_url || "https://placehold.co/360x640/121214/ffffff?text=Video+Reel"}
                    playsInline
                    muted
                    preload="metadata"
                    onEnded={() => handleVideoEnd(reel.id)}
                    playing={isPlaying}
                  />
                  <CardThumbnail 
                    src={reel.thumbnail_url || "https://placehold.co/360x640/121214/ffffff?text=Video+Reel"} 
                    alt={reel.title}
                    playing={isPlaying}
                  />
                  <ThumbnailOverlay playing={isPlaying} />
                  <PlayIcon playing={isPlaying}>
                    {isPlaying ? <FiPause /> : <FiPlay />}
                  </PlayIcon>
                  <StatusBadge status={statusCode}>
                    <StatusDot status={statusCode} pulsing={isPulsing} />
                    {statusLabel}
                  </StatusBadge>
                </VideoPreviewWrapper>

                <ReelContent>
                  <ReelTitle>{reel.title}</ReelTitle>
                  {reel.caption && <ReelCaption>{reel.caption}</ReelCaption>}

                  <MetaRow>
                    {reel.category_name && (
                      <MetaTag>📂 <strong>{reel.category_name}</strong></MetaTag>
                    )}
                    {reel.subcategory_name && (
                      <MetaTag>📎 <strong>{reel.subcategory_name}</strong></MetaTag>
                    )}
                    {reel.linked_service_title && (
                      <MetaTag>🔗 <strong>{reel.linked_service_title}</strong></MetaTag>
                    )}
                  </MetaRow>

                  {status === "rejected" && reel.rejected_reason && (
                    <RejectedReasonBox>
                      <strong><FiAlertCircle style={{ marginRight: '6px' }} /> Rejected</strong>
                      {reel.rejected_reason}
                    </RejectedReasonBox>
                  )}

                  <AnalyticsRow>
                    <AnalyticItem>
                      <FiEye />
                      <span className="count">{reel.views_count || 0}</span>
                      <span className="label">Views</span>
                    </AnalyticItem>
                    <AnalyticItem>
                      <FiHeart />
                      <span className="count">{reel.likes_count || 0}</span>
                      <span className="label">Likes</span>
                    </AnalyticItem>
                    <AnalyticItem>
                      <FiMessageCircle />
                      <span className="count">{reel.comments_count || 0}</span>
                      <span className="label">Comments</span>
                    </AnalyticItem>
                    <AnalyticItem>
                      <FiBookmark />
                      <span className="count">{reel.saves_count || 0}</span>
                      <span className="label">Saves</span>
                    </AnalyticItem>
                    <AnalyticItem>
                      <FiShare2 />
                      <span className="count">{reel.shares_count || 0}</span>
                      <span className="label">Shares</span>
                    </AnalyticItem>
                  </AnalyticsRow>

                  <ActionsRow>
                    <ActionButton onClick={() => openModal(reel)}>
                      <FiEdit /> Edit
                    </ActionButton>
                    <ActionButton variant="danger" onClick={() => handleDelete(reel.id)}>
                      <FiTrash2 /> Delete
                    </ActionButton>
                  </ActionsRow>

                  {["draft", "rejected"].includes(status) && (
                    <SubmitButtonFull onClick={() => handleSubmitForApproval(reel.id)}>
                      <FiCheckCircle /> Submit for Approval
                    </SubmitButtonFull>
                  )}
                </ReelContent>
              </ReelCard>
            );
          })}
        </ReelsGrid>
      )}

      {/* FORM MODAL - UPDATED TO USE CORRECT STYLED COMPONENTS */}
      {showModal && (
        <ModalBackdrop onClick={closeModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>{editingReel ? "✏️ Edit Reel" : "📤 Upload New Reel"}</h2>
              <CloseButton onClick={closeModal}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Title <span className="required">*</span></label>
                <Input
                  type="text"
                  placeholder="e.g. 5 Investment Mistakes to Avoid"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Caption</label>
                <Textarea
                  placeholder="e.g. Learn how to grow your wealth with these simple rules..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <label>Description</label>
                <Textarea
                  placeholder="Additional background or tags..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <label>Category</label>
                <Select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setSubcategoryId("");
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </FormGroup>

              {categoryId && subcategoriesList.length > 0 && (
                <FormGroup>
                  <label>Subcategory</label>
                  <Select
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategoriesList.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </Select>
                </FormGroup>
              )}

              <FormGroup>
                <label>
                  {editingReel ? "Replace video file (Optional)" : "Video File "}
                  <span className="required">{!editingReel ? "*" : ""}</span>
                </label>
                <FileUploadArea onClick={() => videoInputRef.current?.click()}>
                  <span className="icon">⬆</span>
                  <p className="upload-text">
                    {videoFile ? videoFile.name : "Click to upload video"}
                  </p>
                  <p className="upload-hint">
                    {videoFile 
                      ? `${formatFileSize(videoFile.size)} • ${videoFile?.type?.split("/")?.[1]?.toUpperCase() || ""}`
                      : "MP4 • MOV • WEBM (Max 100MB)"
                    }
                  </p>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    required={!editingReel}
                  />
                </FileUploadArea>
                {videoFile && (
                  <FilePreview>
                    <span className="file-icon">🎬</span>
                    <span className="file-name">{videoFile.name}</span>
                    <span className="file-size">{formatFileSize(videoFile.size)}</span>
                    <button 
                      type="button" 
                      className="remove-file"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoFile(null);
                        if (videoInputRef.current) videoInputRef.current.value = '';
                      }}
                    >
                      <FiX size={16} />
                    </button>
                  </FilePreview>
                )}
              </FormGroup>

              <FormGroup>
                <label>Upload Thumbnail/Cover (Optional)</label>
                <FileUploadArea onClick={() => thumbnailInputRef.current?.click()}>
                  <span className="icon">🖼️</span>
                  <p className="upload-text">
                    {thumbnailFile ? thumbnailFile.name : "Click to upload thumbnail"}
                  </p>
                  <p className="upload-hint">
                    {thumbnailFile 
                      ? `${formatFileSize(thumbnailFile.size)} • ${thumbnailFile?.type?.split("/")?.[1]?.toUpperCase() || ""}`
                      : "JPG • PNG • WEBP (Max 5MB)"
                    }
                  </p>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files[0])}
                  />
                </FileUploadArea>
                {thumbnailFile && (
                  <FilePreview>
                    <span className="file-icon">🖼️</span>
                    <span className="file-name">{thumbnailFile.name}</span>
                    <span className="file-size">{formatFileSize(thumbnailFile.size)}</span>
                    <button 
                      type="button" 
                      className="remove-file"
                      onClick={(e) => {
                        e.stopPropagation();
                        setThumbnailFile(null);
                        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
                      }}
                    >
                      <FiX size={16} />
                    </button>
                  </FilePreview>
                )}
              </FormGroup>

              <ModalFooter>
                <CancelButton type="button" onClick={closeModal}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : editingReel ? "Save Changes" : "Create Reel"}
                </SubmitButton>
              </ModalFooter>
            </Form>
          </ModalContainer>
        </ModalBackdrop>
      )}
    </PageContainer>
  );
}