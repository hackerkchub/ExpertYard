// src/apps/admin/pages/CategoryManagement.jsx

import React, { useState } from "react";
import { 
  PageHeader,
  HeaderLeft,
  HeaderRight,
  FilterButton,
  AddButton,
  SearchInput,
  SelectFilter
} from "../styles/catagory";

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  ActionsCell
} from "../styles/table";

import { FaTrash, FaEdit, FaFilter } from "react-icons/fa";

const initial = [
  { id: 1, name: "Technology", main: "IT" },
  { id: 2, name: "Health", main: "Wellness" },
  { id: 3, name: "Education", main: "Schools" },
  { id: 4, name: "Business", main: "Startup" },
  { id: 5, name: "Design", main: "Creative" }
];

export default function CategoryManagement() {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const remove = (id) => setRows(rows.filter(r => r.id !== id));
  const edit = (id) => alert("Edit function for ID: " + id);

  const filtered = rows.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) &&
    (categoryFilter === "" || r.main === categoryFilter)
  );

  const categories = [...new Set(rows.map(r => r.main))];

  return (
    <>
      <PageHeader>
        <HeaderLeft>
          <h3>Expert Categories</h3>
        </HeaderLeft>

        <HeaderRight>
          <FilterButton>
            <FaFilter size={14} /> Filters
          </FilterButton>

          <AddButton>
            Add Expert Category
          </AddButton>
        </HeaderRight>
      </PageHeader>

      <SearchInput
        type="text"
        placeholder="Search by Expert Name or Category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <SelectFilter
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>{cat}</option>
        ))}
      </SelectFilter>

      <TableContainer>
        <div style={{ overflowX: "auto" }}>
          <Table style={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Main Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <tbody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.main}</TableCell>

                  <TableCell>
                    <ActionsCell style={{ gap: 12 }}>

                      <button
                        style={{ background: "transparent", color: "#0ea5ff" }}
                        onClick={() => edit(r.id)}
                      >
                        <FaEdit size={16} />
                      </button>

                      <button
                        style={{ background: "transparent", color: "#ef4444" }}
                        onClick={() => remove(r.id)}
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
    </>
  );
}
