import React, { useState, useEffect } from "react";
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
  FiUploadCloud
} from "react-icons/fi";
import Swal from "sweetalert2";

import {
  PageContainer,
  HeaderRow,
  Title,
  UploadButton,
  ReelsGrid,
  ReelCard,
  VideoPreviewWrapper,
  CardThumbnail,
  StatusBadge,
  ReelContent,
  ReelTitle,
  ReelCaption,
  RejectedReasonBox,
  AnalyticsRow,
  AnalyticItem,
  ActionsRow,
  ActionButton,
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  CloseButton,
  Form,
  FormGroup,
  Input,
  Textarea,
  Select,
  SubmitButton,
  SpinnerWrapper,
  InlineSpinner
} from "./ManageReels.styles";

export default function ManageReels() {
  const { expertData } = useExpert();
  const { categories } = useCategory();

  const [reels, setReels] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Load data
  const loadData = async () => {
    if (!expertData?.expertId) return;
    setLoading(true);

    // 1. Fetch Reels
    try {
      const res = await getExpertReelsApi();
      if (res.data && res.data.success) {
        setReels(res.data.data || []);
      } else {
        setReels([]);
      }
    } catch (err) {
      console.error("Error loading expert reels:", err);
      const is404 = err?.includes?.("404") || (err?.response && err.response.status === 404) || err?.message?.includes?.("404");
      if (is404) {
        Swal.fire({
          title: "API Not Available",
          text: "Reels API not available. Please check backend route.",
          icon: "warning",
          toast: true,
          position: "top-end",
          timer: 5000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: "Error loading reels",
          text: typeof err === "string" ? err : err.message || "Failed to load Reels.",
          icon: "error",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false
        });
      }
      setReels([]);
    }

    // 2. Fetch Services
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

      setShowModal(false);
      loadData();
    } catch (err) {
      console.error("Submit reel error:", err);
      Swal.fire("Error", err.message || "Failed to submit reel", "error");
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
        Swal.fire("Error", "Failed to delete reel", "error");
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
      Swal.fire("Error", "Failed to submit for approval", "error");
    }
  };

  // Subcategories logic
  const selectedCatObj = categories.find(c => c.id === parseInt(categoryId));
  const subcategoriesList = selectedCatObj?.subcategories || [];

  return (
    <PageContainer>
      <HeaderRow>
        <Title>Manage Expert Reels</Title>
        <UploadButton onClick={() => openModal()}>
          <FiPlus /> New Reel
        </UploadButton>
      </HeaderRow>

      {loading ? (
        <SpinnerWrapper>
          <InlineSpinner />
        </SpinnerWrapper>
      ) : reels.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", background: "#f9fafb", borderRadius: "16px", border: "1px dashed #d1d5db" }}>
          <FiUploadCloud size={48} color="#9ca3af" style={{ marginBottom: "12px" }} />
          <h3>No Reels Uploaded Yet</h3>
          <p style={{ color: "#6b7280" }}>Short videos help double your client consultations! Upload your first reel now.</p>
        </div>
      ) : (
        <ReelsGrid>
          {reels.map((reel) => (
            <ReelCard key={reel.id}>
              <VideoPreviewWrapper>
                <CardThumbnail src={reel.thumbnail_url || "https://placehold.co/360x640/121214/ffffff?text=Video+Reel"} alt={reel.title} />
                <StatusBadge status={reel.status}>
                  {reel.status === 1 ? "Approved" : reel.status === 0 ? "Pending" : reel.status === 2 ? "Rejected" : reel.status === 3 ? "Blocked" : "Draft"}
                </StatusBadge>
              </VideoPreviewWrapper>

              <ReelContent>
                <ReelTitle>{reel.title}</ReelTitle>
                {reel.caption && <ReelCaption>{reel.caption}</ReelCaption>}

                {reel.status === 2 && reel.rejected_reason && (
                  <RejectedReasonBox>
                    <strong>Reason:</strong> {reel.rejected_reason}
                  </RejectedReasonBox>
                )}

                <AnalyticsRow>
                  <AnalyticItem>
                    <FiEye />
                    <span className="count">{reel.views_count}</span>
                  </AnalyticItem>
                  <AnalyticItem>
                    <FiHeart />
                    <span className="count">{reel.likes_count}</span>
                  </AnalyticItem>
                  <AnalyticItem>
                    <FiMessageCircle />
                    <span className="count">{reel.comments_count}</span>
                  </AnalyticItem>
                  <AnalyticItem>
                    <FiBookmark />
                    <span className="count">{reel.saves_count}</span>
                  </AnalyticItem>
                  <AnalyticItem>
                    <FiShare2 />
                    <span className="count">{reel.shares_count}</span>
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

                {(reel.status === -1 || reel.status === 2) && (
                  <ActionButton
                    variant="primary"
                    style={{ marginTop: "8px", width: "100%" }}
                    onClick={() => handleSubmitForApproval(reel.id)}
                  >
                    <FiCheckCircle /> Submit for Approval
                  </ActionButton>
                )}
              </ReelContent>
            </ReelCard>
          ))}
        </ReelsGrid>
      )}

      {/* FORM MODAL */}
      {showModal && (
        <ModalBackdrop>
          <ModalContainer>
            <ModalHeader>
              <h2>{editingReel ? "Edit Reel" : "Upload New Reel"}</h2>
              <CloseButton onClick={() => setShowModal(false)}>
                <FiX size={20} />
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Title *</label>
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
                <label>Link consultation service (Optional)</label>
                <Select
                  value={linkedServiceId}
                  onChange={(e) => setLinkedServiceId(e.target.value)}
                >
                  <option value="">Do not link</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <label>{editingReel ? "Replace video file (Optional)" : "Select Video file (MP4, MOV, WEBM) *"}</label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  required={!editingReel}
                />
              </FormGroup>

              <FormGroup>
                <label>Upload Thumbnail/Cover (Optional)</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={submitting}>
                {submitting ? "Uploading & saving..." : editingReel ? "Save Changes" : "Create Reel"}
              </SubmitButton>
            </Form>
          </ModalContainer>
        </ModalBackdrop>
      )}
    </PageContainer>
  );
}
