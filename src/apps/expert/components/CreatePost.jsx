import React, { useState } from "react";
import {
  FiArrowLeft,
  FiSave,
  FiSend,
  FiImage,
  FiX,
  FiUpload,
  FiAlertCircle,
  FiCheckCircle
} from "react-icons/fi";
import { PrimaryButton } from "../pages/MyContent/MyContent.styles";
import Loader from "../../../shared/components/Loader/Loader";

import {
  CreatePostCard,
  Header,
  HeaderTitle,
  HeaderActions,
  Input,
  Textarea,
  MediaActions,
  FooterActions,
  PreviewNote,
  ImagePreview,
  ImageActionRow,
  ImageRemoveBtn,
  ImageUploadArea,
  UploadIcon,
  UploadText,
  UploadSubtext,
  CharCounter,
  LoaderOverlay,
  SuccessMessage,
  ErrorMessage
} from "../styles/CreatePost.styles";

export default function CreatePost({ onBack, onSave, isLoading = false }) {
  const [post, setPost] = useState({
    title: "",
    content: "",
    image: null,
    imageUrl: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 5000;

  /* ================= IMAGE HANDLING ================= */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    setError("");
    setPost(prev => ({
      ...prev,
      image: file,
      imageUrl: URL.createObjectURL(file)
    }));
  };

  const removeImage = () => {
    setPost(prev => ({
      ...prev,
      image: null,
      imageUrl: ""
    }));
  };

  /* ================= POST ACTIONS ================= */
  const handleSaveDraft = async () => {
    if (!post.title.trim()) {
      setError("Please add a title before saving draft");
      return;
    }

    setError("");
    setIsSubmitting(true);
    
    try {
      await onSave?.({
        title: post.title || "Untitled Post",
        description: post.content,
        image: post.image,
        status: 0
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to save draft. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!post.title.trim()) {
      setError("Please add a title before publishing");
      return;
    }
    if (!post.content.trim()) {
      setError("Please add content before publishing");
      return;
    }
    if (!post.image) {
      setError("Please add a cover image before publishing");
      return;
    }

    setError("");
    setIsSubmitting(true);
    
    try {
      await onSave?.({
        title: post.title,
        description: post.content,
        image: post.image,
        status: 1
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onBack?.();
      }, 2000);
    } catch (err) {
      setError("Failed to publish. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_TITLE_LENGTH) {
      setPost(prev => ({ ...prev, title: value }));
    }
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CONTENT_LENGTH) {
      setPost(prev => ({ ...prev, content: value }));
    }
  };

  /* ================= RENDER ================= */
  return (
    <CreatePostCard>
      {(isLoading || isSubmitting) && (
        <LoaderOverlay>
          <Loader />
          <p>{isLoading ? "Creating your post..." : "Saving..."}</p>
        </LoaderOverlay>
      )}

      {success && !isSubmitting && (
        <SuccessMessage>
          <FiCheckCircle size={20} />
          <span>Post saved successfully!</span>
        </SuccessMessage>
      )}

      {error && !isSubmitting && (
        <ErrorMessage>
          <FiAlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <FiX size={16} />
          </button>
        </ErrorMessage>
      )}

      <Header>
        <HeaderTitle>
          <h3>📝 Create New Post</h3>
          <span>Share your knowledge with the community</span>
        </HeaderTitle>
        <HeaderActions>
          <button className="back-btn" onClick={onBack} disabled={isSubmitting}>
            <FiArrowLeft size={16} /> Back
          </button>
        </HeaderActions>
      </Header>

      <div style={{ position: "relative", width: "100%" }}>
        <Input
          placeholder="What's the title of your post?"
          value={post.title}
          onChange={handleTitleChange}
          maxLength={MAX_TITLE_LENGTH}
          disabled={isSubmitting}
        />
        <CharCounter>
          {post.title.length}/{MAX_TITLE_LENGTH}
        </CharCounter>
      </div>

      <MediaActions>
        <label htmlFor="post-image-upload" style={{ width: "100%" }}>
          <ImageUploadArea>
            <UploadIcon>
              <FiUpload size={28} />
            </UploadIcon>
            <UploadText>Upload Cover Image</UploadText>
            <UploadSubtext>PNG, JPG or WEBP (Max 5MB)</UploadSubtext>
            <div style={{ marginTop: 8 }}>
              <span className="upload-btn">Choose Image</span>
            </div>
          </ImageUploadArea>
        </label>

        <input
          id="post-image-upload"
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageChange}
          disabled={isSubmitting}
        />

        {!post.imageUrl && (
          <PreviewNote>
            💡 A good cover image increases engagement by 80%
          </PreviewNote>
        )}
      </MediaActions>

      {post.imageUrl && (
        <ImagePreview>
          <img src={post.imageUrl} alt="Selected preview" />
          <ImageRemoveBtn type="button" onClick={removeImage} disabled={isSubmitting}>
            <FiX size={14} /> Remove
          </ImageRemoveBtn>
        </ImagePreview>
      )}

      <div style={{ position: "relative", width: "100%" }}>
        <Textarea
          placeholder="Write your article or description here…"
          value={post.content}
          onChange={handleContentChange}
          maxLength={MAX_CONTENT_LENGTH}
          disabled={isSubmitting}
        />
        <CharCounter style={{ bottom: 16, right: 16 }}>
          {post.content.length}/{MAX_CONTENT_LENGTH}
        </CharCounter>
      </div>

      <FooterActions>
        <div className="btn-group">
          <PrimaryButton 
            type="button" 
            onClick={handleSaveDraft}
            disabled={isSubmitting || !post.title.trim()}
            className="draft-btn"
          >
            <FiSave size={16} /> Save Draft
          </PrimaryButton>

          <PrimaryButton
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting || !post.title.trim() || !post.content.trim() || !post.image}
            className="publish-btn"
          >
            <FiSend size={16} /> Publish
          </PrimaryButton>
        </div>
      </FooterActions>
    </CreatePostCard>
  );
}