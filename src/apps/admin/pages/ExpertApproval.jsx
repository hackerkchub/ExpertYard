// src/apps/admin/pages/ExpertApproval.jsx

import React, { useState } from "react";
import { 
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  StatusTag 
} from "../styles/table";

import { ActionsBox, ProfileImage } from "../styles/expertApproval";

import { FaEye, FaEdit } from "react-icons/fa";

const initial = [
  {
    id: 1,
    name: "Ravi Singh",
    category: "Software Dev",
    sub: "Frontend",
    enabled: false,
    status: "PENDING",
    photo: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Kritika Sharma",
    category: "Nutrition",
    sub: "Diet",
    enabled: false,
    status: "PENDING",
    photo: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "Aman Gupta",
    category: "AI",
    sub: "ML",
    enabled: false,
    status: "PENDING",
    photo: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    id: 4,
    name: "Neha Patel",
    category: "Education",
    sub: "Online Courses",
    enabled: false,
    status: "PENDING",
    photo: "https://randomuser.me/api/portraits/women/26.jpg"
  },
  {
    id: 5,
    name: "Sahil Jain",
    category: "Business",
    sub: "Marketing",
    enabled: false,
    status: "PENDING",
    photo: "https://randomuser.me/api/portraits/men/11.jpg"
  }
];

export default function ExpertApproval() {
  const [rows, setRows] = useState(initial);

  const toggle = (id) => {
    setRows(rows.map(r => 
      r.id === id 
        ? { ...r, enabled: !r.enabled, status: r.enabled ? "PENDING" : "APPROVED" }
        : r
    ));
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Profile</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Sub Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {rows.map((r) => (
            <TableRow key={r.id}>

              <TableCell>
                <ProfileImage src={r.photo} alt={r.name} />
              </TableCell>

              <TableCell>{r.name}</TableCell>
              <TableCell>{r.category}</TableCell>
              <TableCell>{r.sub}</TableCell>

              <TableCell>
                <StatusTag $enabled={r.status === "APPROVED"}>
                  {r.status}
                </StatusTag>
              </TableCell>

              <TableCell>
                <ActionsBox>

                  <button>
                    <FaEye /> View
                  </button>

                  <button>
                    <FaEdit /> Edit
                  </button>

                  <button
                    onClick={() => toggle(r.id)}
                    className={r.enabled ? "disable" : "approve"}
                  >
                    {r.enabled ? "Disable" : "Approve"}
                  </button>

                </ActionsBox>
              </TableCell>

            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}
