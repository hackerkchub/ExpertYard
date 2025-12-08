// src/apps/admin/pages/ExpertManagement.jsx

import React, { useState } from "react";

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  StatusTag,
  ActionsCell
} from "../styles/table";

import {
  HeaderBar,
  SearchInput,
  SelectBox,
  ResetButton,
  FilterRow,
  Photo
} from "../styles/expertManagement";

import { FaEdit, FaTrash } from "react-icons/fa";

// --------------------------------
const initial = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.k@example.com",
    category: "Software Dev",
    subcategory: "Frontend",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "ENABLED"
  },
  {
    id: 2,
    name: "Ananya Sharma",
    email: "ananya@example.com",
    category: "Nutrition",
    subcategory: "Diet Planning",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    status: "ENABLED"
  },
  {
    id: 3,
    name: "Priya Singh",
    email: "priya@example.com",
    category: "AI",
    subcategory: "Machine Learning",
    photo: "https://randomuser.me/api/portraits/women/3.jpg",
    status: "DISABLED"
  },
  {
    id: 4,
    name: "Amit Desai",
    email: "amit@example.com",
    category: "Curriculum Design",
    subcategory: "Course Structure",
    photo: "https://randomuser.me/api/portraits/men/4.jpg",
    status: "ENABLED"
  },
  {
    id: 5,
    name: "Karan Verma",
    email: "karan@example.com",
    category: "Business",
    subcategory: "Marketing",
    photo: "https://randomuser.me/api/portraits/men/5.jpg",
    status: "PENDING"
  }
];

// --------------------------------
export default function ExpertManagement() {
  const [rows, setRows] = useState(initial);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const remove = (id) => setRows(rows.filter((r) => r.id !== id));

  const filteredData = rows.filter((r) => {
    return (
      (r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase())) &&
      (category ? r.category === category : true) &&
      (subcategory ? r.subcategory === subcategory : true)
    );
  });

  const allCategories = [...new Set(initial.map((i) => i.category))];
  const allSubcategories = [...new Set(initial.map((i) => i.subcategory))];

  return (
    <TableContainer>

      {/* 🔹 Header */}
      <HeaderBar>
        <h3>Experts</h3>
        <button>
          Add New Expert
        </button>
      </HeaderBar>

      {/* 🔹 Filters */}
      <FilterRow>

        <SearchInput
          placeholder="Search expert..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <SelectBox
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {allCategories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </SelectBox>

        <SelectBox
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
        >
          <option value="">All Subcategories</option>
          {allSubcategories.map((sc, i) => (
            <option key={i} value={sc}>{sc}</option>
          ))}
        </SelectBox>

        <ResetButton
          onClick={() => {
            setSearch("");
            setCategory("");
            setSubcategory("");
          }}
        >
          Reset
        </ResetButton>

      </FilterRow>

      {/* 🔹 Table */}
      <div style={{ overflowX: "auto" }}>
        <Table style={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Subcategory</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <tbody>
            {filteredData.map((r) => (
              <TableRow key={r.id}>
                
                <TableCell>
                  <Photo src={r.photo} alt="profile" />
                </TableCell>

                <TableCell>{r.name}</TableCell>

                <TableCell style={{ opacity: 0.85, fontSize: 13 }}>
                  {r.email}
                </TableCell>

                <TableCell>{r.category}</TableCell>
                <TableCell>{r.subcategory}</TableCell>

                <TableCell>
                  <StatusTag $enabled={r.status === "ENABLED"}>
                    {r.status}
                  </StatusTag>
                </TableCell>

                <TableCell>
                  <ActionsCell>
                    <button title="See Profile" style={{ marginRight: 6 }}>
                      👁️
                    </button>

                    <button title="Edit">
                      <FaEdit />
                    </button>

                    <button onClick={() => remove(r.id)} title="Delete">
                      <FaTrash />
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
