import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  ActionsCell
} from "../styles/table";
import {
  HeaderBar,
  ButtonGroup,
  FilterButton,
  AddButton,
  SearchInput,
  SelectFilter
} from "../styles/subcategory";
import { FaTrash, FaEdit, FaFilter, FaPlus, FaImage } from "react-icons/fa";
import {
  getAllSubcategoriesApi,
  createSubcategoryApi,
  updateSubcategoryApi,
  deleteSubcategoryApi
} from "../../../shared/api/subcategory.api.js";

export default function SubCategoryManagement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await getAllSubcategoriesApi();
      const dataArray = response.data || [];
      setRows(Array.isArray(dataArray) ? dataArray : []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ PERFECT handleSubmit - Inline + Modal dono ke liye
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!editingRow && !showModal) return;

    try {
      // ✅ INLINE EDITING (Table mein)
      if (editingRow && !showModal) {
        const payload = {
          category_id: editingRow.category_id,  // ✅ ALWAYS original
          name: formData.name.trim() || editingRow.name  // ✅ Never null
        };
        
        // ✅ Image only if new file
        if (formData.image instanceof File) {
          payload.image = formData.image;
        }
        
        console.log("✅ INLINE UPDATE Payload:", payload);
        await updateSubcategoryApi(editingRow.id, payload);
        
      } 
      // ✅ MODAL CREATE/EDIT
      else {
        const payload = {
          category_id: formData.category_id.trim() || "",
          name: formData.name.trim() || ""
        };
        
        if (formData.image instanceof File) {
          payload.image = formData.image;
        }
        
        console.log("✅ MODAL Payload:", payload);
        
        if (editingRow) {
          await updateSubcategoryApi(editingRow.id, payload);
        } else {
          await createSubcategoryApi(payload);
        }
      }
      
      // ✅ Reset everything
      setEditingRow(null);
      setFormData({ name: "", category_id: "", image: null });
      setImagePreview(null);
      setShowModal(false);
      await fetchSubcategories();
      
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error);
      alert("Failed to save: " + (error.response?.data?.message || error.message || "Unknown error"));
    }
  };

  const remove = async (id) => {
    if (confirm("Are you sure you want to delete this sub-category?")) {
      try {
        await deleteSubcategoryApi(id);
        await fetchSubcategories();
      } catch (error) {
        console.error("Error deleting subcategory:", error);
        alert("Failed to delete subcategory");
      }
    }
  };

  const openAddModal = () => {
    setEditingRow(null);
    setFormData({ name: "", category_id: "", image: null });
    setImagePreview(null);
    setShowModal(true);
  };

  // ✅ Edit Modal ke liye
  const openEditModal = (row) => {
    setEditingRow(row);
    setFormData({
      name: row.name || "",
      category_id: row.category_id || "",
      image: null
    });
    setImagePreview(row.image_url);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Inline edit click
  const handleEditClick = (row) => {
    setEditingRow(row);
    setFormData({
      name: row.name || "",
      category_id: row.category_id || "",
      image: null
    });
    setImagePreview(row.image_url);
    setShowModal(false); // Close modal if open
  };

  const handleInlineCancel = () => {
    setEditingRow(null);
    setFormData({ name: "", category_id: "", image: null });
    setImagePreview(null);
  };

  const cancelModal = () => {
    setEditingRow(null);
    setFormData({ name: "", category_id: "", image: null });
    setImagePreview(null);
    setShowModal(false);
  };

  const filteredRows = useMemo(() => {
    if (!Array.isArray(rows)) return [];
    return rows.filter((r) =>
      r.name?.toLowerCase().includes(query.toLowerCase()) &&
      (categoryFilter === "" || r.category_name === categoryFilter)
    );
  }, [rows, query, categoryFilter]);

  const categories = useMemo(() => {
    if (!Array.isArray(rows)) return [];
    return [...new Set(rows.map((r) => r.category_name))];
  }, [rows]);

  const renderImage = useCallback((imageUrl) => {
    if (!imageUrl) return <FaImage size={24} />;
    return (
      <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={imageUrl}
          alt="Subcat"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <FaImage size={24} style={{ display: 'none' }} />
      </div>
    );
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading subcategories...</div>;
  }

  return (
    <TableContainer>
      <HeaderBar>
        <h3>Expert Sub-Categories</h3>
        <ButtonGroup>
          <AddButton onClick={openAddModal}>
            <FaPlus size={14} style={{ marginRight: 4 }} />
            Add Sub-Category
          </AddButton>
        </ButtonGroup>
      </HeaderBar>

      <SearchInput
        type="text"
        placeholder="Search Sub-Category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <SelectFilter
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>
            {cat}
          </option>
        ))}
      </SelectFilter>

      <div style={{ overflowX: "auto" }}>
        <Table style={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell>SubCat ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Category ID</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <tbody>
            {filteredRows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>
                  {editingRow?.id === r.id ? (
                    <input
                      type="text"
                      value={formData.name || r.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: 'white'
                      }}
                      autoFocus
                    />
                  ) : (
                    r.name || "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {editingRow?.id === r.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }}
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ fontSize: '0.875rem' }}
                      />
                    </div>
                  ) : (
                    renderImage(r.image_url)
                  )}
                </TableCell>
                <TableCell>
                  {/* ✅ Category ID - Read only in inline edit */}
                  {editingRow?.id === r.id ? (
                    <div style={{
                      background: '#f3f4f6',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: '#374151'
                    }}>
                      {r.category_id || "N/A"}
                    </div>
                  ) : (
                    r.category_id || "N/A"
                  )}
                </TableCell>
                <TableCell>{r.category_name || "N/A"}</TableCell>
                <TableCell>
                  <ActionsCell style={{ gap: '0.5rem' }}>
                    {editingRow?.id === r.id ? (
                      <>
                        <button
                          onClick={handleSubmit}
                          style={{
                            background: "#10b981",
                            color: "white",
                            border: "none",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.875rem"
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleInlineCancel}
                          style={{
                            background: "#6b7280",
                            color: "white",
                            border: "none",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.875rem"
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(r)}
                          style={{ background: "transparent", color: "#0ea5ff", border: "none", cursor: "pointer" }}
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => remove(r.id)}
                          style={{ background: "transparent", color: "#ef4444", border: "none", cursor: "pointer" }}
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </>
                    )}
                  </ActionsCell>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>

      {/* ✅ PERFECT Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            minWidth: '400px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginTop: 0 }}>
              {editingRow ? 'Edit Sub-Category' : 'Add New Sub-Category'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Sub-Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Category ID *
                </label>
                <input
                  type="text"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
                {imagePreview && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={cancelModal}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {editingRow ? 'Update Sub-Category' : 'Add Sub-Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </TableContainer>
  );
}
