// src/apps/admin/pages/CategoryManagement.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  PageHeader,
  HeaderLeft,
  HeaderRight,
  FilterButton,
  AddButton,
  SearchInput,
} from "../styles/catagory";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  ActionsCell
} from "../styles/table";
import {
  FaTrash, 
  FaEdit, 
  FaFilter, 
  FaPlus, 
  FaSave, 
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaCamera,
  FaSpinner,
  FaImage
} from "react-icons/fa";
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

  // ✅ FIXED: Image states - separate keys for better tracking
  const [imageErrors, setImageErrors] = useState({});
  const [imageLoading, setImageLoading] = useState({});

  // ✅ FIXED: Improved renderImage function
  const renderImage = useCallback((imageUrl, size = 40, isEditing = false, onClick) => {
    // Generate unique key for each image
    const imageKey = imageUrl ? `${imageUrl}-${size}` : `fallback-${size}`;
    
    // Check if image has error
    const hasError = imageErrors[imageKey];
    const isLoading = imageLoading[imageKey];

    if (!imageUrl || hasError) {
      return (
        <div 
          style={{ 
            width: size, 
            height: size, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#f3f4f6',
            borderRadius: '4px',
            border: '1px solid #d1d5db',
            cursor: isEditing ? 'pointer' : 'default'
          }}
          onClick={onClick}
        >
          <FaImage size={size === 40 ? 24 : 32} color="#9ca3af" />
        </div>
      );
    }

    return (
      <div 
        style={{ 
          width: size, 
          height: size, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          cursor: isEditing ? 'pointer' : 'default'
        }}
        onClick={onClick}
      >
        {isLoading && (
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px'
          }}>
            <FaSpinner className="animate-spin" size={20} />
          </div>
        )}
        
        <img
          key={imageKey}
          src={imageUrl}
          alt="Category"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            borderRadius: '4px',
            border: isEditing ? '2px solid #10b981' : 'none',
            display: isLoading ? 'none' : 'block'
          }}
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
        
        {isEditing && (
          <div style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#10b981',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}>
            <FaCamera />
          </div>
        )}
      </div>
    );
  }, [imageErrors, imageLoading]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategoriesApi();
      const cats = response.data.data || response.data || [];
      
      // ✅ Reset image states on new data
      setImageErrors({});
      setImageLoading({});
      setCategories(cats);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories for specific category (with caching)
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

  // Update category with subcategories
  const updateCategoryWithSubs = useCallback(async (categoryId) => {
    const subcats = await fetchSubcategories(categoryId);
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, subcategories: subcats }
        : cat
    ));
  }, [fetchSubcategories]);

  // Toggle subcategories with lazy loading
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

  // Edit handlers
  const startEdit = (category) => {
    setEditingId(category.id);
    setEditData({
      id: category.id,
      category_id: category.category_id || category.id,
      name: category.name,
      image: category.image,
      file: null,
      hasImageChange: false
    });
  };

  const handleEditImageClick = () => {
    editImageRef.current?.click();
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditData({ 
        ...editData, 
        image: url, 
        file,
        hasImageChange: true 
      });
    }
  };

  const saveEdit = async () => {
    try {
      setLoading(true);
      await updateCategoryApi(editData);
      await fetchCategories(); // Refresh all data
      cancelEdit();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Error updating category. Please try again.");
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

  const filteredCategories = categories.filter(cat =>
    cat.name?.toLowerCase().includes(query.toLowerCase()) ||
    cat.category_id?.toLowerCase().includes(query.toLowerCase()) ||
    cat.id?.toString().includes(query)
  );

  // Add Category handlers
  const handleAddImageClick = () => {
    addImageRef.current?.click();
  };

  const handleAddImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewCategory({ 
        name: newCategory.name, 
        image: url, 
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
      await createCategoryApi({
        name: newCategory.name,
        image: newCategory.file
      });
      
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

  if (loading && categories.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <FaSpinner className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <>
      <PageHeader>
        <HeaderLeft>
          <h3>Expert Categories</h3>
        </HeaderLeft>

        <HeaderRight>
          <AddButton onClick={() => setShowAddModal(true)} disabled={loading}>
            <FaPlus /> Add Expert Category
          </AddButton>
        </HeaderRight>
      </PageHeader>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <SearchInput
          type="text"
          placeholder="Search by Category ID, Name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          style={{ flex: 1, minWidth: '300px' }}
        />
      </div>

      <TableContainer>
        <div style={{ overflowX: "auto" }}>
          <Table style={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell>Category ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Subcategories</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <tbody>
              {filteredCategories.map((cat) => (
                <TableRow key={cat.id} style={{ position: 'relative' }}>
                  {/* Category ID */}
                  <TableCell>
                    {editingId === cat.id ? (
                      <input
                        value={editData.category_id || cat.category_id || cat.id}
                        readOnly
                        style={{
                          background: 'transparent',
                          border: '1px solid #475569',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          color: '#f1f5f9',
                          width: '100%'
                        }}
                      />
                    ) : (
                      cat.category_id || cat.id
                    )}
                  </TableCell>

                  {/* ✅ FIXED IMAGE COLUMN */}
                  <TableCell>
                    {editingId === cat.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                        {renderImage(editData.image, 40, true, handleEditImageClick)}
                        <input
                          ref={editImageRef}
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageUpload}
                          style={{ fontSize: '0.875rem' }}
                        />
                      </div>
                    ) : (
                      renderImage(cat.image, 40, false)
                    )}
                  </TableCell>

                  {/* Category Name */}
                  <TableCell>
                    {editingId === cat.id ? (
                      <input
                        value={editData.name || ''}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        style={{
                          background: '#1e293b',
                          border: '1px solid #475569',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          color: '#f1f5f9',
                          width: '100%',
                          fontSize: '14px'
                        }}
                      />
                    ) : (
                      cat.name || 'N/A'
                    )}
                  </TableCell>

                  {/* Subcategories - Lazy Load */}
                  <TableCell>
                    <div style={{ cursor: 'pointer' }} onClick={() => toggleSubcategories(cat.id)}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: expandedSubcats[cat.id] ? '#0ea5ff' : '#94a3b8',
                        fontWeight: expandedSubcats[cat.id] ? '500' : 'normal'
                      }}>
                        {subcatLoading[cat.id] ? (
                          <FaSpinner className="animate-spin" size={14} />
                        ) : expandedSubcats[cat.id] ? (
                          <FaChevronUp size={14} />
                        ) : (
                          <FaChevronDown size={14} />
                        )}
                        <span>
                          {cat.subcategories?.length} Subcategories
                        </span>
                      </div>
                    </div>
                    
                    {expandedSubcats[cat.id] && (
                      <div style={{ 
                        maxHeight: '100px', 
                        overflowY: 'auto', 
                        marginTop: '8px',
                        padding: '8px',
                        background: 'rgba(14, 165, 255, 0.05)',
                        borderRadius: '6px',
                        border: '1px solid rgba(14, 165, 255, 0.1)'
                      }}>
                        {subcatLoading[cat.id] ? (
                          <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                            Loading subcategories...
                          </div>
                        ) : cat.subcategories && cat.subcategories.length > 0 ? (
                          cat.subcategories.map((sub, idx) => (
                            <div key={idx} style={{
                              padding: '4px 8px',
                              background: 'rgba(14, 165, 255, 0.1)',
                              borderRadius: '4px',
                              marginBottom: '4px',
                              fontSize: '13px',
                              color: '#94a3b8'
                            }}>
                              {sub.name || sub}
                            </div>
                          ))
                        ) : (
                          <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                            No subcategories found
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <ActionsCell style={{ gap: 8 }}>
                      {editingId === cat.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            disabled={loading}
                            style={{
                              background: loading ? '#6b7280' : '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {loading ? <FaSpinner className="animate-spin" size={14} /> : <FaSave />}
                            {loading ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={loading}
                            style={{
                              background: '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <FaTimes /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(cat)}
                            disabled={loading}
                            style={{
                              background: 'transparent',
                              color: '#0ea5ff',
                              border: '1px solid #0ea5ff',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <FaEdit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => removeCategory(cat.id)}
                            disabled={loading}
                            style={{
                              background: 'transparent',
                              color: '#ef4444',
                              border: '1px solid #ef4444',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <FaTrash size={14} /> Delete
                          </button>
                        </>
                      )}
                    </ActionsCell>
                  </TableCell>
                </TableRow>
              ))}

              {filteredCategories.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No categories found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </div>
      </TableContainer>

      {/* ✅ Add Category Modal - FIXED Preview */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1e293b',
            padding: '32px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0,0, 0.5)'
          }}>
            <h3 style={{ margin: '0 0 24px 0', color: '#f1f5f9' }}>Add New Expert Category</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '14px' }}>
                Category Name
              </label>
              <input
                type="text"
                placeholder="Enter category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                disabled={loading}
                style={{
                  width: '100%',
                  background: '#0c1116',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '14px' }}>
                Category Image
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                {/* ✅ FIXED: Large preview with proper rendering */}
                {renderImage(newCategory.image, 100, false)}
                <input
                  ref={addImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAddImageUpload}
                  disabled={loading}
                  style={{
                    fontSize: '1rem',
                    padding: '0.5rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategory({ name: "", image: null, file: null });
                  if (addImageRef.current) addImageRef.current.value = "";
                }}
                disabled={loading}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={addNewCategory}
                disabled={!newCategory.name.trim() || !newCategory.file || loading}
                style={{
                  background: (newCategory.name.trim() && newCategory.file && !loading) ? '#10b981' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  cursor: (newCategory.name.trim() && newCategory.file && !loading) ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" style={{ marginRight: '8px' }} />
                    Creating...
                  </>
                ) : (
                  'Create Category'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
