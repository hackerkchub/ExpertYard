// src/apps/admin/pages/Dashboard.jsx

import React from "react";

// Stats Cards
import Cards from "../components/Cards";

// Styled Components 
import {
  FilterBar,
  SectionBox,
  Row,
  RecentList
} from "../styles/dashboard";

import {
  Table,
  TableHead,
  TableRow,
  TableCell
} from "../styles/table";

import { FaFilter } from "react-icons/fa";

// ---------- Data -------------
const stats = [
  { label:"TOTAL EXPERTS", value:150 },
  { label:"ACTIVE EXPERTS", value:95 },
  { label:"PENDING EXPERTS", value:55 },
];

const categories = [
  "Technology", "Health", "Education", "Business", "AI", "Nutrition"
];

const subCategories = [
  "Software Dev", "Fitness", "Online Courses", "AI Research", "Diet Planning"
];

const statusOptions = ["ENABLED", "DISABLED", "PENDING"];

const recentExperts = [
  {name:"Ravi Singh", cat:"Software Dev", status:"ENABLED"},
  {name:"Kritika Sharma", cat:"Nutrition", status:"ENABLED"},
  {name:"Amit Desai", cat:"AI", status:"PENDING"},
  {name:"Priya Shah", cat:"Business", status:"ENABLED"},
  {name:"Vikram Rao", cat:"Education", status:"PENDING"},
];

const recentCategories = ["Technology","Health","Education"];
const recentSubCats = ["Software Dev","Nutrition","Online Courses"];

export default function Dashboard() {
  return (
    <>
      {/* Filter Bar */}
      <FilterBar>
        <input type="text" placeholder="Search experts by name..." />

        <select>
          <option value="">Select Category</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <select>
          <option value="">Select Sub-Category</option>
          {subCategories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <select>
          <option value="">Select Status</option>
          {statusOptions.map((s, i)=>( 
            <option key={i} value={s}>{s}</option> 
          ))}
        </select>
      </FilterBar>

      {/* Stats Cards */}
      <Cards stats={stats} />

      {/* Category & Subcategory Boxes */}
      <Row>
        <SectionBox>
          <h3>Category Management</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              <TableRow>
                <TableCell>Technology</TableCell>
                <TableCell><button>Edit</button></TableCell>
              </TableRow>
            </tbody>
          </Table>
          <button>Add Category</button>
        </SectionBox>

        <SectionBox>
          <h3>Subcategory Management</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              <TableRow>
                <TableCell>Software Dev</TableCell>
                <TableCell><button>Edit</button></TableCell>
              </TableRow>
            </tbody>
          </Table>
          <button>Add Subcategory</button>
        </SectionBox>
      </Row>

      {/* Recent Lists */}
      <Row>
        
        <SectionBox>
          <h4>Recent Categories</h4>
          <RecentList>
            {recentCategories.map((c,i)=>(
              <li key={i}>{c}</li>
            ))}
          </RecentList>
        </SectionBox>

        <SectionBox>
          <h4>Recent Subcategories</h4>
          <RecentList>
            {recentSubCats.map((c,i)=>(
              <li key={i}>{c}</li>
            ))}
          </RecentList>
        </SectionBox>

        <SectionBox>
          <h4>Recent Experts</h4>
          <RecentList>
            {recentExperts.map((e,i)=>(
              <li key={i}>
                <img src="/assets/avatar1.png" alt="expert" />
                {e.name}
              </li>
            ))}
          </RecentList>
        </SectionBox>

      </Row>
    </>
  );
}
