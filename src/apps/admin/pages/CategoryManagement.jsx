import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaSave,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaCamera,
  FaSpinner,
  FaImage,
  FaSearch,
  FaFolder,
  FaTags,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { FiFilter } from "react-icons/fi";

import {
  PageContainer,
  ContentWrapper,
  PageHeader,
  HeaderLeft,
  HeaderRight,
  SearchInput,
  FilterButton,
  AddButton,
  StatsGrid,
  StatCard,
  StatIcon,
  StatLabel,
  StatValue,
  StatTrend,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  ActionsCell,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  SubcategoryToggle,
  SubcategoryList,
  SubcategoryItem,
  ImageContainer,
  Image,
  ImageFallback,
  ImageOverlay,
  ImageBadge,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalClose,
  FormGroup,
  Label,
  Input,
  FileInput,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  LoadingSpinner,
  EmptyState,
} from "../styles/catagory";

import {
  getCategoriesApi,
  getSubCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi
} from "../../../shared/api/expertapi/category.api";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", image: null, file: null });
  const [expandedSubcats, setExpandedSubcats] = useState({});
  const [subcatLoading, setSubcatLoading] = useState({});
  const [loading, setLoading] = useState(false);

  // File input refs
  const editImageRef = useRef(null);
  const addImageRef = useRef(null);

  // Image states
  const [imageErrors, setImageErrors] = useState({});
  const [imageLoading, setImageLoading] = useState({});

  // Backend image URL base
  const BASE_IMAGE_URL = "https://softmaxs.com/";

  // Calculate stats
  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const totalSubcategories = categories.reduce((acc, cat) => 
      acc + (cat.subcategories?.length || 0), 0
    );
    const categoriesWithImages = categories.filter(cat => cat.image_url || cat.image).length;
    const activeCategories = categories.length; // You can add status field if needed

    return {
      totalCategories,
      totalSubcategories,
      categoriesWithImages,
      activeCategories
    };
  }, [categories]);

  // Image renderer
  const renderImage = useCallback((imageData, size = 40, isEditing = false, onClick) => {
    const imageKey = imageData ? `${imageData}-${size}` : `fallback-${size}`;
    const hasError = imageErrors[imageKey];
    const isLoading = imageLoading[imageKey];

    const isFile = imageData instanceof File;
    let finalSrc = null;

    if (isFile) {
      finalSrc = URL.createObjectURL(imageData);
    } else if (imageData) {
      finalSrc = imageData.startsWith('http') ? imageData : `${BASE_IMAGE_URL}${imageData}`;
    }

    if (!finalSrc || hasError) {
      return (
        <ImageContainer $size={size} $editable={isEditing} onClick={onClick}>
          <ImageFallback $size={size}>
            <FaImage />
          </ImageFallback>
          {isEditing && <ImageBadge><FaCamera /></ImageBadge>}
        </ImageContainer>
      );
    }

    return (
      <ImageContainer $size={size} $editable={isEditing} onClick={onClick}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}>
            <FaSpinner className="animate-spin" size={20} />
          </div>
        )}
        <Image
          src={finalSrc}
          alt="Category"
          $loading={isLoading}
          onLoad={() => {
            setImageLoading(prev => ({ ...prev, [imageKey]: false }));
            setImageErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[imageKey];
              return newErrors;
            });
          }}
          onError={() => {
            setImageErrors(prev => ({ ...prev, [imageKey]: true }));
            setImageLoading(prev => ({ ...prev, [imageKey]: false }));
          }}
          loading="lazy"
        />
        {isEditing && <ImageOverlay><FaCamera /></ImageOverlay>}
        {isEditing && <ImageBadge><FaCamera /></ImageBadge>}
      </ImageContainer>
    );
  }, [imageErrors, imageLoading, BASE_IMAGE_URL]);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategoriesApi();
      const cats = response.data.data || response.data || [];
      const sortedCats = [...cats].sort((a, b) => a.id - b.id);
      const normalizedCats = sortedCats.map(cat => ({
        ...cat,
        image_url: cat.image_url || cat.image
      }));

      setImageErrors({});
      setImageLoading({});
      setCategories(normalizedCats);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = useCallback(async (categoryId) => {
    try {
      setSubcatLoading(prev => ({ ...prev, [categoryId]: true }));
      const response = await getSubCategoriesApi(categoryId);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return [];
    } finally {
      setSubcatLoading(prev => ({ ...prev, [categoryId]: false }));
    }
  }, []);

  const updateCategoryWithSubs = useCallback(async (categoryId) => {
    const subcats = await fetchSubcategories(categoryId);
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, subcategories: subcats }
        : cat
    ));
  }, [fetchSubcategories]);

  const toggleSubcategories = async (id) => {
    const isExpanded = expandedSubcats[id];

    if (!isExpanded && !categories.find(cat => cat.id === id)?.subcategories) {
      await updateCategoryWithSubs(id);
    }

    setExpandedSubcats(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditData({
      id: category.id,
      category_id: category.category_id || category.id,
      name: category.name,
      image: category.image_url || category.image,
      file: null,
      hasImageChange: false
    });
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setEditData(prev => ({
        ...prev,
        image: previewUrl,
        file,
        hasImageChange: true
      }));
    }
  };

  const saveEdit = async () => {
    try {
      setLoading(true);

      const payload = {
        id: editData.id,
        category_id: editData.category_id,
        name: editData.name,
        file: editData.file || null
      };

      await updateCategoryApi(payload);
      await fetchCategories();
      cancelEdit();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Error updating category");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
    if (editImageRef.current) {
      editImageRef.current.value = "";
    }
  };

  const removeCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteCategoryApi(id);
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setNewCategory({
        name: newCategory.name,
        image: previewUrl,
        file
      });
    }
  };

  const addNewCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.file) {
      alert("Please fill category name and select an image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("image", newCategory.file);

      await createCategoryApi(formData);

      setNewCategory({ name: "", image: null, file: null });
      setShowAddModal(false);
      if (addImageRef.current) addImageRef.current.value = "";

      await fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Error creating category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name?.toLowerCase().includes(query.toLowerCase()) ||
    cat.category_id?.toLowerCase().includes(query.toLowerCase()) ||
    cat.id?.toString().includes(query)
  );

  if (loading && categories.length === 0) {
    return (
      <PageContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
          <p>Loading categories...</p>
        </LoadingSpinner>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        {/* Header */}
        <PageHeader>
          <HeaderLeft>
            <h3>
              <FaFolder />
              Category Management
            </h3>
            <p>Manage expert categories, subcategories, and their images</p>
          </HeaderLeft>

          <HeaderRight>
            <FilterButton disabled={loading}>
              <FiFilter /> Filter
            </FilterButton>
            <AddButton onClick={() => setShowAddModal(true)} disabled={loading}>
              <FaPlus /> Add Category
            </AddButton>
          </HeaderRight>
        </PageHeader>

        {/* Stats Cards */}
        <StatsGrid>
          <StatCard>
            <StatIcon>
              <FaFolder />
            </StatIcon>
            <StatLabel>Total Categories</StatLabel>
            <StatValue>{stats.totalCategories}</StatValue>
            <StatTrend $positive>
              <FaCheckCircle /> Active
            </StatTrend>
          </StatCard>

          <StatCard>
            <StatIcon>
              <FaTags />
            </StatIcon>
            <StatLabel>Subcategories</StatLabel>
            <StatValue>{stats.totalSubcategories}</StatValue>
            <StatTrend>Across all categories</StatTrend>
          </StatCard>

          <StatCard>
            <StatIcon>
              <FaImage />
            </StatIcon>
            <StatLabel>With Images</StatLabel>
            <StatValue>{stats.categoriesWithImages}</StatValue>
            <StatTrend>{Math.round((stats.categoriesWithImages / stats.totalCategories) * 100)}% of total</StatTrend>
          </StatCard>

          <StatCard>
            <StatIcon>
              <FaCheckCircle />
            </StatIcon>
            <StatLabel>Active</StatLabel>
            <StatValue>{stats.activeCategories}</StatValue>
            <StatTrend $positive>Ready for use</StatTrend>
          </StatCard>
        </StatsGrid>

        {/* Search */}
        <div style={{ marginBottom: '24px' }}>
          <SearchInput>
            <FaSearch />
            <input
              type="text"
              placeholder="Search by Category ID, Name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
          </SearchInput>
        </div>

        {/* Table */}
        <TableContainer>
          <div style={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <th>Category ID</th>
                  <th>Image</th>
                  <th>Category Name</th>
                  <th>Subcategories</th>
                  <th>Actions</th>
                </TableRow>
              </TableHead>

              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat.id}>
                      {/* Category ID */}
                      <TableCell>
                        {editingId === cat.id ? (
                          <Input
                            value={editData.category_id || cat.category_id || cat.id}
                            readOnly
                            disabled={loading}
                          />
                        ) : (
                          cat.category_id || cat.id
                        )}
                      </TableCell>

                      {/* Image */}
                      <TableCell>
                        {editingId === cat.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {renderImage(editData.image, 60, true, () => editImageRef.current?.click())}
                            <FileInput
                              ref={editImageRef}
                              type="file"
                              accept="image/*"
                              onChange={handleEditImageUpload}
                              disabled={loading}
                            />
                          </div>
                        ) : (
                          renderImage(cat.image_url || cat.image, 50, false)
                        )}
                      </TableCell>

                      {/* Category Name */}
                      <TableCell>
                        {editingId === cat.id ? (
                          <Input
                            value={editData.name || ''}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            disabled={loading}
                          />
                        ) : (
                          <strong>{cat.name || 'N/A'}</strong>
                        )}
                      </TableCell>

                      {/* Subcategories */}
                      <TableCell>
                        <SubcategoryToggle
                          $expanded={expandedSubcats[cat.id]}
                          onClick={() => toggleSubcategories(cat.id)}
                        >
                          {subcatLoading[cat.id] ? (
                            <FaSpinner className="animate-spin" />
                          ) : expandedSubcats[cat.id] ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                          <span>{cat.subcategories?.length || 0} Subcategories</span>
                        </SubcategoryToggle>

                        {expandedSubcats[cat.id] && (
                          <SubcategoryList>
                            {subcatLoading[cat.id] ? (
                              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '12px' }}>
                                <FaSpinner className="animate-spin" /> Loading...
                              </div>
                            ) : cat.subcategories?.length > 0 ? (
                              cat.subcategories.map((sub, idx) => (
                                <SubcategoryItem key={idx}>
                                  <span>{sub.name || sub}</span>
                                  <span>ID: {sub.id}</span>
                                </SubcategoryItem>
                              ))
                            ) : (
                              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '12px' }}>
                                <FaExclamationCircle /> No subcategories found
                              </div>
                            )}
                          </SubcategoryList>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <ActionsCell>
                          {editingId === cat.id ? (
                            <>
                              <SaveButton onClick={saveEdit} disabled={loading}>
                                {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                Save
                              </SaveButton>
                              <CancelButton onClick={cancelEdit} disabled={loading}>
                                <FaTimes /> Cancel
                              </CancelButton>
                            </>
                          ) : (
                            <>
                              <EditButton onClick={() => startEdit(cat)} disabled={loading}>
                                <FaEdit /> Edit
                              </EditButton>
                              <DeleteButton onClick={() => removeCategory(cat.id)} disabled={loading}>
                                <FaTrash /> Delete
                              </DeleteButton>
                            </>
                          )}
                        </ActionsCell>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <EmptyState>
                        <FaFolder size={48} />
                        <h4>No categories found</h4>
                        <p>Try adjusting your search or add a new category</p>
                      </EmptyState>
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </div>
        </TableContainer>

        {/* Add Category Modal */}
        {showAddModal && (
          <ModalOverlay onClick={() => !loading && setShowAddModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <h3>Add New Category</h3>
                <ModalClose onClick={() => !loading && setShowAddModal(false)}>
                  ×
                </ModalClose>
              </ModalHeader>

              <FormGroup>
                <Label>Category Name</Label>
                <Input
                  type="text"
                  placeholder="Enter category name (e.g., Technology)"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <Label>Category Image</Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                  {renderImage(newCategory.image || newCategory.file, 120, false)}
                  <FileInput
                    ref={addImageRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAddImageUpload}
                    disabled={loading}
                  />
                </div>
              </FormGroup>

              <ButtonGroup>
                <SecondaryButton
                  onClick={() => {
                    setShowAddModal(false);
                    setNewCategory({ name: "", image: null, file: null });
                    if (addImageRef.current) addImageRef.current.value = "";
                  }}
                  disabled={loading}
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  onClick={addNewCategory}
                  disabled={!newCategory.name.trim() || !newCategory.file || loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Create Category
                    </>
                  )}
                </PrimaryButton>
              </ButtonGroup>
            </ModalContent>
          </ModalOverlay>
        )}
      </ContentWrapper>
    </PageContainer>
  );
}