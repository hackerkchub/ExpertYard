import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  StatusTag
} from "../styles/table";

import { ActionsBox, ProfileImage } from "../styles/expertApproval";
import { FaUserCircle } from "react-icons/fa";


// 🔗 APIs
import {
  getAllExpertsApi,
  updateExpertStatusApi
} from "../../../shared/api/expertapi/expert.api";

import {
  getAllExpertProfilesApi
} from "../../../shared/api/expertapi/expert.api";

export default function ExpertApproval() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =====================================
     🔹 LOAD EXPERTS + PROFILES
  ===================================== */
  useEffect(() => {
    loadExperts();
  }, []);

  const loadExperts = async () => {
    try {
      setLoading(true);

      // 1️⃣ experts
      const expertRes = await getAllExpertsApi();
      const experts = expertRes?.data || expertRes || [];

      // 2️⃣ profiles
      const profileRes = await getAllExpertProfilesApi();
      const profiles = profileRes?.data || profileRes || [];

      // 3️⃣ Map profile photo by expert_id
      const profileMap = {};
      profiles.forEach((p) => {
        profileMap[p.expert_id] = p.profile_photo;
      });

      // 4️⃣ Final rows
      const finalRows = experts.map((e) => ({
        expert_id: e.id,
        name: e.name,
        email: e.email,
        mobile: e.phone,
        status: e.status === 1 ? "APPROVED" : "DISABLED",
        profile_photo:
          profileMap[e.id] ||
          "https://via.placeholder.com/40?text=User"
      }));

      setRows(finalRows);
    } catch (err) {
      console.error("Failed to load experts", err);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
     🔹 TOGGLE STATUS (APPROVE / DISABLE)
  ===================================== */
  const toggleStatus = async (expert_id, currentStatus) => {
    const newStatus = currentStatus === "DISABLED" ? 1 : 0;

    try {
      // Optimistic UI
      setRows((prev) =>
        prev.map((r) =>
          r.expert_id === expert_id
            ? {
                ...r,
                status: newStatus === 1 ? "APPROVED" : "DISABLED"
              }
            : r
        )
      );

      await updateExpertStatusApi(expert_id, {
        status: newStatus
      });
    } catch (err) {
      console.error("Status update failed", err);
      loadExperts(); // rollback
    }
  };

  /* =====================================
     🔹 UI
  ===================================== */
  if (loading) {
    return <p style={{ padding: 20 }}>Loading experts...</p>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Profile</TableCell>
            <TableCell>Expert ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Mobile No</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {rows.map((r) => (
            <TableRow key={r.expert_id}>
             <TableCell>
  {r.profile_photo ? (
    <ProfileImage
      src={r.profile_photo}
      alt={r.name}
      onError={(e) => {
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "block";
      }}
    />
  ) : null}

  <FaUserCircle
    size={42}
    color="#b5b5b5"
    style={{ display: r.profile_photo ? "none" : "block" }}
  />
</TableCell>


              <TableCell>{r.expert_id}</TableCell>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.email}</TableCell>
              <TableCell>{r.mobile}</TableCell>

              <TableCell>
                <StatusTag $enabled={r.status === "APPROVED"}>
                  {r.status}
                </StatusTag>
              </TableCell>

              <TableCell>
                <ActionsBox>
                  <button
                    className={
                      r.status === "DISABLED" ? "approve" : "disable"
                    }
                    onClick={() =>
                      toggleStatus(r.expert_id, r.status)
                    }
                  >
                    {r.status === "DISABLED" ? "Approve" : "Disable"}
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
