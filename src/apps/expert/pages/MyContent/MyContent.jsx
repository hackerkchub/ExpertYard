import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  PageWrap,
  Content,
  HeaderRow,
  PageTitle,
  MetricsRow,
  MetricChip,
  CreationCard,
  CreationInputFake,
  CreationActions,
  PrimaryButton,
  GridWrap,
  Column,
  PostCard,
  Thumb,
  CardBody,
  CardTitle,
  CardExcerpt,
  MetaRow,
  MetaItem,
  StatusBadge,
  MoreButton,
  Menu,
  MenuButton,
  QuickImagePreview,
  QuickImageRemove,
  ImageUploadLabel,
  EmptyStateWrapper,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateButton,
  EmptyStateDivider
} from "./MyContent.styles";

import {
  FiFileText,
  FiMoreHorizontal,
  FiEdit3,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiX,
  FiUpload,
  FiSend,
  FiLoader,
  FiImage,
  FiInfo
} from "react-icons/fi";

import CreatePost from "../../components/CreatePost";
import { useExpert } from "../../../../shared/context/ExpertContext";

import {
  getPostsApi,
  createPostApi,
  updatePostApi,
  deletePostApi
} from "../../../../shared/api/expertapi";
import { useSearchParams } from "react-router-dom";

export default function MyContent() {
  const { expertData } = useExpert();
  const expertId = expertData?.expertId || expertData?.id;

  const [mode, setMode] = useState("list");
  const [editingPost, setEditingPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);

  const [quickText, setQuickText] = useState("");
  const [quickImage, setQuickImage] = useState(null);

  const creationRef = useRef(null);
  const menuContainerRef = useRef(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("mode") === "create") {
      setMode("create");
    }
  }, [searchParams]);

  /* ================= GET POSTS ================= */
  useEffect(() => {
    if (!expertId) return;

    const fetchPosts = async () => {
      try {
        const res = await getPostsApi(expertId);

        const mapped = (res.data.data || []).map(p => ({
          id: p.id,
          title: p.title,
          excerpt: p.description,
          thumb: p.image_url,
          likes: p.likes ?? 0,
          comments: p.comments_count ?? 0,
          status: Number(p.status) === 1 ? "published" : "draft",
          date: p.created_at
            ? new Date(p.created_at).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })
            : "—",
          views: "–",
          isEditing: false
        }));

        setPosts(mapped);
      } catch (err) {
        console.error("Failed to load posts", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [expertId]);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target)
      ) {
        setOpenMenuId(null);
      }
    }

    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const filteredPosts = useMemo(() => posts, [posts]);

  /* ================= EDIT HANDLERS ================= */
  const toggleEdit = (id) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, isEditing: !p.isEditing } : p
      )
    );
    setOpenMenuId(null);
  };

  const updatePostLocal = (id, field, value) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  /* ================= UPDATE POST API ================= */
  const saveEdit = async (id) => {
    const post = posts.find(p => p.id === id);
    if (!post || !expertId) return;

    try {
      const formData = new FormData();
      formData.append("expert_id", expertId);
      formData.append("title", post.title);
      formData.append("description", post.excerpt);

      if (post.newImageFile) {
        formData.append("image", post.newImageFile);
      }

      const res = await updatePostApi(id, formData);
      const updated = res.data.data;

      setPosts(prev =>
        prev.map(p =>
          p.id === id
            ? {
                ...p,
                title: updated.title,
                excerpt: updated.description,
                thumb: updated.image_url,
                isEditing: false
              }
            : p
        )
      );
    } catch (err) {
      console.error("Update failed", err.response?.data || err);
      alert("Failed to update post. Please try again.");
    }
  };

  /* ================= DELETE POST API ================= */
  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await deletePostApi(id, expertId);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Delete failed", err.response?.data || err);
      alert("Failed to delete post. Please try again.");
    }
  };

  /* ================= QUICK CREATE (SEND) ================= */
  const handleQuickSend = async () => {
    const text = quickText.trim();

    if (!text || !expertId || !quickImage) {
      alert("Text and image both are required");
      return;
    }

    setQuickLoading(true);

    const autoTitle = text.length > 0 ? text.slice(0, 60) : "Untitled Post";

    try {
      const formData = new FormData();
      formData.append("expert_id", expertId);
      formData.append("title", autoTitle);
      formData.append("description", text);
      formData.append("image", quickImage);

      const res = await createPostApi(formData);
      const p = res.data.data;

      setPosts(prev => [
        {
          id: p.id,
          title: p.title || "Untitled Post",
          excerpt: p.description,
          thumb: p.image_url,
          likes: p.likes ?? 0,
          comments: p.comments_count ?? 0,
          status: Number(p.status) === 1 ? "published" : "draft",
          date: new Date(p.created_at || Date.now()).toLocaleDateString(
            "en-US",
            {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }
          ),
          views: "–",
          isEditing: false
        },
        ...prev
      ]);

      setQuickText("");
      setQuickImage(null);
    } catch (err) {
      console.error("Quick create failed", err.response?.data || err.message);
      alert("Failed to create post. Please try again.");
    } finally {
      setQuickLoading(false);
    }
  };

  /* ================= CREATE PAGE ================= */
  const handleCreate = () => {
    setEditingPost(null);
    setMode("create");
  };

  const handleCreateSave = async (createdPost) => {
    if (!expertId) return;
    if (!createdPost.image) {
      alert("Image is required");
      return;
    }

    setIsCreating(true);

    try {
      const formData = new FormData();
      formData.append("expert_id", expertId);
      formData.append("title", createdPost.title);
      formData.append(
        "description",
        createdPost.content || createdPost.description || ""
      );
      if (createdPost.image) {
        formData.append("image", createdPost.image);
      }

      const res = await createPostApi(formData);
      const p = res.data.data;

      const newPost = {
        id: p.id,
        title: p.title,
        excerpt: p.description,
        thumb: p.image_url,
        likes: p.likes ?? 0,
        comments: p.comments_count ?? 0,
        status: p.status || "published",
        date: p.created_at
          ? new Date(p.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric"
            })
          : new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric"
            }),
        views: p.views ?? "–",
        isEditing: false
      };

      setPosts(prev => [newPost, ...prev]);
      setMode("list");
    } catch (err) {
      console.error("Create failed", err);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateCancel = () => setMode("list");

  if (loading) {
    return (
      <PageWrap>
        <Content style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <FiLoader size={40} style={{ animation: "spin 1s linear infinite" }} />
            <p style={{ marginTop: 16, color: "#64748b" }}>Loading your content...</p>
          </div>
        </Content>
      </PageWrap>
    );
  }

  if (mode === "create" && !expertId) {
    return (
      <PageWrap>
        <Content>Loading editor...</Content>
      </PageWrap>
    );
  }

  if (mode === "create") {
    return (
      <PageWrap>
        <Content>
          <HeaderRow>
            <PageTitle>Create Post</PageTitle>
          </HeaderRow>

          <CreatePost
            post={editingPost}
            onSave={handleCreateSave}
            onBack={handleCreateCancel}
            isLoading={isCreating}
          />
        </Content>
      </PageWrap>
    );
  }

  /* ================= UI ================= */
  return (
    <PageWrap>
      <Content>
        <HeaderRow>
          <PageTitle>
            My Content Library
            <span>Manage your posts</span>
          </PageTitle>

          <MetricsRow>
            <MetricChip>
              <FiFileText size={14} />
              <span>Total Posts</span>
              <strong>{posts.length}</strong>
            </MetricChip>
          </MetricsRow>
        </HeaderRow>

        {/* Creation Hub - Improved */}
        <CreationCard>
          <CreationInputFake
            as="textarea"
            rows={1}
            ref={creationRef}
            placeholder="Share your knowledge here…"
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            disabled={quickLoading}
          />

          <CreationActions>
            <ImageUploadLabel className={quickLoading ? "disabled" : ""}>
              <FiUpload size={16} />
              Image
              <span className="required-star">*</span>
              <input
                type="file"
                hidden
                accept="image/*"
                required
                disabled={quickLoading}
                onChange={(e) =>
                  setQuickImage(e.target.files?.[0] || null)
                }
              />
            </ImageUploadLabel>

            {quickImage && (
              <QuickImagePreview>
                <img src={URL.createObjectURL(quickImage)} alt="Preview" />
                <QuickImageRemove 
                  onClick={() => setQuickImage(null)}
                  disabled={quickLoading}
                >
                  <FiX size={12} />
                </QuickImageRemove>
              </QuickImagePreview>
            )}

            <PrimaryButton 
              onClick={handleQuickSend}
              disabled={quickLoading || !quickText.trim() || !quickImage}
            >
              {quickLoading ? (
                <>
                  <FiLoader size={16} style={{ animation: "spin 1s linear infinite" }} />
                  Creating...
                </>
              ) : (
                <>
                  <FiSend /> Post
                </>
              )}
            </PrimaryButton>

            <PrimaryButton 
              className="secondary" 
              onClick={handleCreate} 
              disabled={quickLoading}
            >
              <FiPlus /> Create Post
            </PrimaryButton>
          </CreationActions>
        </CreationCard>

        {/* Posts Grid or Empty State */}
        {filteredPosts.length === 0 ? (
          <EmptyStateWrapper>
            <EmptyStateIcon>📝</EmptyStateIcon>
            <EmptyStateTitle>No posts yet</EmptyStateTitle>
            <EmptyStateDivider />
            <EmptyStateDescription>
              Start sharing your expertise with the community. 
              Create your first post to showcase your knowledge and engage with your audience.
            </EmptyStateDescription>
            <EmptyStateButton onClick={handleCreate}>
              <FiPlus size={18} />
              Create Your First Post
            </EmptyStateButton>
          </EmptyStateWrapper>
        ) : (
          <GridWrap>
            {[0, 1].map(col => (
              <Column key={col}>
                {filteredPosts
                  .filter((_, i) => i % 2 === col)
                  .map(post => (
                    <PostCard key={post.id}>
                      <Thumb>
                        {post.thumb ? (
                          <img src={post.thumb} alt={post.title} />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              color: "#94a3b8",
                              background: "#f8fafc",
                              flexDirection: "column",
                              gap: 8
                            }}
                          >
                            <FiImage size={24} />
                            <span>No Preview</span>
                          </div>
                        )}
                      </Thumb>

                      <CardBody>
                        {post.isEditing ? (
                          <>
                            <input
                              value={post.title}
                              onChange={(e) =>
                                updatePostLocal(post.id, "title", e.target.value)
                              }
                              style={{
                                width: "100%",
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "2px solid #dbeafe",
                                marginBottom: 8,
                                fontSize: 14,
                                fontFamily: "inherit"
                              }}
                            />

                            <textarea
                              value={post.excerpt}
                              onChange={(e) =>
                                updatePostLocal(
                                  post.id,
                                  "excerpt",
                                  e.target.value
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "2px solid #dbeafe",
                                minHeight: 70,
                                fontSize: 13,
                                resize: "vertical",
                                marginBottom: 8,
                                fontFamily: "inherit"
                              }}
                            />

                            <label
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 12,
                                cursor: "pointer",
                                padding: "6px 12px",
                                borderRadius: 999,
                                background: "#f1f5f9",
                                color: "#475569",
                                marginBottom: 10,
                                fontFamily: "inherit"
                              }}
                            >
                              <FiUpload size={14} /> Change Image
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  updatePostLocal(
                                    post.id,
                                    "thumb",
                                    URL.createObjectURL(file)
                                  );
                                  updatePostLocal(
                                    post.id,
                                    "newImageFile",
                                    file
                                  );
                                }}
                              />
                            </label>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 8,
                                marginTop: 4
                              }}
                            >
                              <button
                                onClick={() => saveEdit(post.id)}
                                style={{
                                  border: "none",
                                  borderRadius: 8,
                                  padding: "6px 14px",
                                  fontSize: 12,
                                  cursor: "pointer",
                                  background: "#000080",
                                  color: "#fff",
                                  fontFamily: "inherit",
                                  fontWeight: 600
                                }}
                              >
                                <FiCheck size={14} style={{ marginRight: 4 }} />
                                Save
                              </button>
                              <button
                                onClick={() => toggleEdit(post.id)}
                                style={{
                                  border: "none",
                                  borderRadius: 8,
                                  padding: "6px 14px",
                                  fontSize: 12,
                                  cursor: "pointer",
                                  background: "#f1f5f9",
                                  color: "#0a1628",
                                  fontFamily: "inherit",
                                  fontWeight: 600
                                }}
                              >
                                <FiX size={14} style={{ marginRight: 4 }} />
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <CardTitle>{post.title}</CardTitle>
                            <CardExcerpt>{post.excerpt}</CardExcerpt>
                          </>
                        )}

                        <MetaRow>
                          <MetaItem>📅 {post.date}</MetaItem>
                          <MetaItem>👁 {post.views}</MetaItem>
                          <MetaItem>👍 {post.likes}</MetaItem>
                          <MetaItem>💬 {post.comments}</MetaItem>
                        </MetaRow>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 10,
                            position: "relative"
                          }}
                          ref={openMenuId === post.id ? menuContainerRef : null}
                        >
                          <StatusBadge status={post.status}>
                            {post.status}
                          </StatusBadge>

                          <MoreButton
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === post.id ? null : post.id
                              )
                            }
                          >
                            <FiMoreHorizontal size={18} />
                          </MoreButton>

                          {openMenuId === post.id && (
                            <Menu>
                              <MenuButton onClick={() => toggleEdit(post.id)}>
                                <FiEdit3 size={16} /> Edit
                              </MenuButton>
                              <MenuButton onClick={() => deletePost(post.id)}>
                                <FiTrash2 size={16} /> Delete
                              </MenuButton>
                            </Menu>
                          )}
                        </div>
                      </CardBody>
                    </PostCard>
                  ))}
              </Column>
            ))}
          </GridWrap>
        )}
      </Content>

      {/* Global styles for animations */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </PageWrap>
  );
}