import React, { useState } from "react";
import {
  FiArrowLeft,
  FiSave,
  FiSend,
  FiImage,
  FiX
} from "react-icons/fi";

import { PrimaryButton } from "../pages/MyContent/MyContent.styles";

import {
  CreatePostCard,
  Header,
  Input,
  Textarea,
  MediaActions,
  FooterActions,
  PreviewNote,
  ImagePreview,
  ImageActionRow,
  ImageRemoveBtn
} from "../styles/CreatePost.styles";

export default function CreatePost({ onBack, onSave }) {
  const [post, setPost] = useState({
    title: "",
    content: "",
    image: null,
    imageUrl: ""
  });

  /* ================= IMAGE HANDLING ================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  /* ================= POST BUILDER ================= */

  const buildBasePost = (status) => ({
  title: post.title || "Untitled Post",
  content: post.content,
  image: post.image,        // ✅ FILE PASS KARO
  status
});


 const handleSaveDraft = () => {
  onSave?.({
    title: post.title || "Untitled Post",
    description: post.content,
    image: post.image,
    status: 0
  });
};

const handlePublish = () => {
  if (!post.title.trim()) return;

  onSave?.({
    title: post.title,
    description: post.content,
    image: post.image,
    status: 1
  });
};

  /* ================= RENDER ================= */

  return (
    <CreatePostCard>

      {/* HEADER */}
      <Header>
        <h3>Create New Post</h3>
        <PrimaryButton type="button" onClick={onBack}>
          <FiArrowLeft size={16} /> Back
        </PrimaryButton>
      </Header>

      {/* TITLE */}
      <Input
        placeholder="Post title"
        value={post.title}
        onChange={(e) =>
          setPost(prev => ({ ...prev, title: e.target.value }))
        }
      />

      {/* IMAGE UPLOAD */}
      <MediaActions>
        <label htmlFor="post-image-upload">
          <ImageActionRow>
            <FiImage size={18} />
            <span>Add cover image</span>
          </ImageActionRow>
        </label>

        <input
          id="post-image-upload"
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />

        <PreviewNote>
          Optional — adds visual appeal to your post.
        </PreviewNote>
      </MediaActions>

      {/* IMAGE PREVIEW */}
      {post.imageUrl && (
        <ImagePreview>
          <img src={post.imageUrl} alt="Selected preview" />
          <ImageRemoveBtn type="button" onClick={removeImage}>
            <FiX size={14} />
          </ImageRemoveBtn>
        </ImagePreview>
      )}

      {/* CONTENT */}
      <Textarea
        placeholder="Write your article or description here…"
        value={post.content}
        onChange={(e) =>
          setPost(prev => ({ ...prev, content: e.target.value }))
        }
      />

      {/* ACTION BUTTONS */}
      <FooterActions>
        <PrimaryButton type="button" onClick={handleSaveDraft}>
          <FiSave size={16} /> Save Draft
        </PrimaryButton>

        <PrimaryButton
          type="button"
          onClick={handlePublish}
          disabled={!post.title.trim()}
          style={{
            opacity: post.title.trim() ? 1 : 0.6,
            cursor: post.title.trim() ? "pointer" : "not-allowed"
          }}
        >
          <FiSend size={16} /> Publish
        </PrimaryButton>
      </FooterActions>

    </CreatePostCard>
  );
}
