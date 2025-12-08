import React, { useState } from "react";

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

import { FaTrash, FaEdit, FaFilter } from "react-icons/fa";

const initial = [
  { id: 1, name: "Frontend", main: "Technology" },
  { id: 2, name: "Backend", main: "Technology" },
  { id: 3, name: "Yoga", main: "Health" },
  { id: 4, name: "AI Basics", main: "Education" },
  { id: 5, name: "Brand Design", main: "Design" }
];

export default function SubCategoryManagement() {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const remove = (id) => setRows(rows.filter((r) => r.id !== id));
  const edit = (id) => alert("Edit Sub Category — ID: " + id);

  const filtered = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) &&
      (categoryFilter === "" || r.main === categoryFilter)
  );

  const categories = [...new Set(rows.map((r) => r.main))];

  return (
    <TableContainer>

      {/* Header */}
      <HeaderBar>
        <h3>Expert Sub-Categories</h3>

        <ButtonGroup>
          <FilterButton>
            <FaFilter size={14} /> Filters
          </FilterButton>

          <AddButton>
            Add Sub-Category
          </AddButton>
        </ButtonGroup>
      </HeaderBar>

      {/* Search */}
      <SearchInput
        type="text"
        placeholder="Search Sub-Category or Category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Filter */}
      <SelectFilter
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All Main Categories</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>
            {cat}
          </option>
        ))}
      </SelectFilter>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <Table style={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Sub-Category</TableCell>
              <TableCell>Main Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <tbody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.main}</TableCell>

                <TableCell>
                  <ActionsCell>
                    <button
                      onClick={() => edit(r.id)}
                      style={{ background: "transparent", color: "#0ea5ff" }}
                    >
                      <FaEdit size={16} />
                    </button>

                    <button
                      onClick={() => remove(r.id)}
                      style={{ background: "transparent", color: "#ef4444" }}
                    >
                      <FaTrash size={16} />
                    </button>
                  </ActionsCell>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>

    </TableContainer>
  );
}
