// src/apps/admin/pages/SubCategoryManagement.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { 
  FaTrash, 
  FaEdit, 
  FaPlus, 
  FaImage, 
  FaSearch, 
  FaFilter,
  FaTimes,
  FaSave,
  FaUpload,
  FaSpinner,
  FaLayerGroup,
  FaHashtag,
  FaTag
} from "react-icons/fa";
import {
  getAllSubcategoriesApi,
  createSubcategoryApi,
  updateSubcategoryApi,
  deleteSubcategoryApi
} from "../../../shared/api/admin/subcategory.api.js";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Styled Components
const Container = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.div`
  padding: 24px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TitleSection = styled.div`
  h2 {
    font-size: 28px;
    margin: 0;
    font-weight: 700;
    letter-spacing: -0.5px;
  }
  
  p {
    margin: 8px 0 0;
    opacity: 0.9;
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    h2 {
      font-size: 24px;
    }
  }
`;

const AddButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.3);
  }
  
  h4 {
    margin: 0 0 8px;
    font-size: 13px;
    opacity: 0.9;
    font-weight: 500;
  }
  
  .stat-number {
    font-size: 28px;
    font-weight: 700;
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    
    .stat-number {
      font-size: 24px;
    }
  }
`;

const FilterSection = styled.div`
  padding: 24px 32px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
  
  svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #adb5bd;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SelectFilter = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  padding: 0 32px 32px;
  
  @media (max-width: 768px) {
    padding: 0 20px 20px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
  
  @media (max-width: 768px) {
    border-spacing: 0 8px;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 16px 12px;
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:first-child {
    border-radius: 12px 0 0 12px;
  }
  
  &:last-child {
    border-radius: 0 12px 12px 0;
  }
  
  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 11px;
  }
`;

const Tr = styled.tr`
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    td {
      background: #f8f9fa;
    }
  }
`;

const Td = styled.td`
  padding: 16px 12px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  transition: background 0.3s ease;
  
  &:first-child {
    border-radius: 12px 0 0 12px;
  }
  
  &:last-child {
    border-radius: 0 12px 12px 0;
  }
  
  @media (max-width: 768px) {
    padding: 12px 8px;
  }
`;

const ImageContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    font-size: 24px;
    color: white;
  }
`;

const CategoryBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
  
  svg {
    font-size: 12px;
  }
`;

const InlineInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #764ba2;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const InlineFileInput = styled.input`
  font-size: 12px;
  padding: 4px;
  
  &::-webkit-file-upload-button {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    background: #667eea;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #764ba2;
    }
  }
`;

const ActionButton = styled.button`
  padding: 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$save ? '#10b981' : props.$cancel ? '#6c757d' : 'transparent'};
  color: ${props => props.$save || props.$cancel ? 'white' : props.$edit ? '#667eea' : '#ef4444'};
  
  &:hover {
    transform: scale(1.05);
    background: ${props => props.$save ? '#059669' : props.$cancel ? '#5a6268' : props.$edit ? '#764ba2' : '#dc2626'};
    color: white;
  }
  
  @media (max-width: 768px) {
    padding: 6px;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideIn} 0.3s ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 10px;
  }
`;

const ModalHeader = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 20px;
  }
  
  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 20px;
    padding: 4px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: rotate(90deg);
    }
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #495057;
    font-size: 14px;
  }
  
  input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }
`;

const ImagePreview = styled.div`
  margin-top: 12px;
  text-align: center;
  
  img {
    max-width: 150px;
    max-height: 150px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  
  button {
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:first-child {
      background: #6c757d;
      color: white;
      
      &:hover {
        background: #5a6268;
      }
    }
    
    &:last-child {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px;
  color: white;
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  color: #6c757d;
  
  svg {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  h3 {
    margin: 0 0 8px;
    font-size: 20px;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

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
      const sortedData = Array.isArray(dataArray)
        ? [...dataArray].sort((a, b) => a.id - b.id)
        : [];
      setRows(sortedData);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!editingRow && !showModal) return;

    try {
      if (editingRow && !showModal) {
        const payload = {
          category_id: editingRow.category_id,
          name: formData.name.trim() || editingRow.name
        };
        
        if (formData.image instanceof File) {
          payload.image = formData.image;
        }
        
        await updateSubcategoryApi({
          id: editingRow.id,
          category_id: payload.category_id,
          name: payload.name,
          file: payload.image
        });
      } else {
        const payload = {
          category_id: formData.category_id.trim() || "",
          name: formData.name.trim() || ""
        };
        
        if (formData.image instanceof File) {
          payload.image = formData.image;
        }
        
        if (editingRow) {
          await updateSubcategoryApi({
            id: editingRow.id,
            category_id: payload.category_id,
            name: payload.name,
            file: payload.image
          });
        } else {
          await createSubcategoryApi(payload);
        }
      }
      
      setEditingRow(null);
      setFormData({ name: "", category_id: "", image: null });
      setImagePreview(null);
      setShowModal(false);
      await fetchSubcategories();
    } catch (error) {
      console.error("Error:", error.response?.data || error);
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

  const handleEditClick = (row) => {
    setEditingRow(row);
    setFormData({
      name: row.name || "",
      category_id: row.category_id || "",
      image: null
    });
    setImagePreview(row.image_url);
    setShowModal(false);
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

  const stats = {
    total: rows.length,
    categories: categories.length,
    withImages: rows.filter(r => r.image_url).length
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <FaSpinner size={48} />
          <p>Loading subcategories...</p>
        </LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Header>
          <HeaderContent>
            <TitleSection>
              <h2>Sub-Category Management</h2>
              <p>Manage and organize expert sub-categories</p>
            </TitleSection>
            <AddButton onClick={openAddModal}>
              <FaPlus /> Add Sub-Category
            </AddButton>
          </HeaderContent>
          
          <StatsGrid>
            <StatCard>
              <h4>Total Sub-Categories</h4>
              <div className="stat-number">{stats.total}</div>
            </StatCard>
            <StatCard>
              <h4>Total Categories</h4>
              <div className="stat-number">{stats.categories}</div>
            </StatCard>
            <StatCard>
              <h4>With Images</h4>
              <div className="stat-number">{stats.withImages}</div>
            </StatCard>
          </StatsGrid>
        </Header>

        <FilterSection>
          <SearchWrapper>
            <FaSearch />
            <SearchInput
              type="text"
              placeholder="Search sub-category by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </SearchWrapper>

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
        </FilterSection>

        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Sub-Category</Th>
                <Th>Image</Th>
                <Th>Category</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <EmptyState>
                      <FaLayerGroup />
                      <h3>No sub-categories found</h3>
                      <p>Try adjusting your search or add a new sub-category</p>
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => (
                  <Tr key={r.id}>
                    <Td>
                      <CategoryBadge>
                        <FaHashtag size={10} />
                        {r.id}
                      </CategoryBadge>
                    </Td>
                    <Td>
                      {editingRow?.id === r.id ? (
                        <InlineInput
                          type="text"
                          value={formData.name || r.name || ""}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          autoFocus
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FaTag style={{ color: '#667eea' }} />
                          <strong>{r.name || "N/A"}</strong>
                        </div>
                      )}
                    </Td>
                    <Td>
                      {editingRow?.id === r.id ? (
                        <div>
                          {imagePreview && (
                            <ImagePreview>
                              <img src={imagePreview} alt="Preview" />
                            </ImagePreview>
                          )}
                          <InlineFileInput
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>
                      ) : (
                        <ImageContainer>
                          {r.image_url ? (
                            <img src={r.image_url} alt={r.name} />
                          ) : (
                            <FaImage />
                          )}
                        </ImageContainer>
                      )}
                    </Td>
                    <Td>
                      <CategoryBadge>
                        <FaLayerGroup size={12} />
                        {r.category_name || "N/A"}
                      </CategoryBadge>
                    </Td>
                    <Td>
                      {editingRow?.id === r.id ? (
                        <ActionGroup>
                          <ActionButton $save onClick={handleSubmit}>
                            <FaSave />
                          </ActionButton>
                          <ActionButton $cancel onClick={handleInlineCancel}>
                            <FaTimes />
                          </ActionButton>
                        </ActionGroup>
                      ) : (
                        <ActionGroup>
                          <ActionButton $edit onClick={() => handleEditClick(r)} title="Edit">
                            <FaEdit />
                          </ActionButton>
                          <ActionButton onClick={() => remove(r.id)} title="Delete">
                            <FaTrash />
                          </ActionButton>
                        </ActionGroup>
                      )}
                    </Td>
                  </Tr>
                ))
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Card>

      {/* Modal */}
      {showModal && (
        <Modal onClick={cancelModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>{editingRow ? 'Edit Sub-Category' : 'Add New Sub-Category'}</h3>
              <button onClick={cancelModal}>
                <FaTimes />
              </button>
            </ModalHeader>
            
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <label>Sub-Category Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter sub-category name"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Category ID *</label>
                  <input
                    type="text"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                    placeholder="Enter category ID"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <ImagePreview>
                      <img src={imagePreview} alt="Preview" />
                    </ImagePreview>
                  )}
                </FormGroup>

                <ModalButtons>
                  <button type="button" onClick={cancelModal}>
                    Cancel
                  </button>
                  <button type="submit">
                    {editingRow ? 'Update Sub-Category' : 'Add Sub-Category'}
                  </button>
                </ModalButtons>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}