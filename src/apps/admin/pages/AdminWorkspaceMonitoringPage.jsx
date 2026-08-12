import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAdminWorkspaceMonitor,
  getWorkspaceExpertsList,
  updateWorkspaceStep,
  reassignWorkspaceExpert,
  dismissWorkspaceStatusRequest,
} from "../../../shared/api/workspace.api";

const LIFECYCLE_STEPS = [
  { key: "SUBMITTED", label: "1. Booked", icon: "📝" },
  { key: "EXPERT_ASSIGNED", label: "2. Assigned", icon: "👤" },
  { key: "IN_REVIEW", label: "3. In Progress", icon: "⚙️" },
  { key: "DELIVERED", label: "4. Delivered", icon: "🎁" },
  { key: "COMPLETED", label: "5. Completed", icon: "🏆" },
];

export default function AdminWorkspaceMonitoringPage() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [expertsList, setExpertsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Reassign Modal State
  const [selectedWsForReassign, setSelectedWsForReassign] =
    useState(null);

  const [targetExpertId, setTargetExpertId] = useState("");
  const [reassigning, setReassigning] = useState(false);

  /* =====================================================
     📦 FETCH WORKSPACES
  ===================================================== */

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);

      const response = await getAdminWorkspaceMonitor();
      const data = response?.data;

      if (data?.success) {
        setWorkspaces(data.data || []);
      } else {
        console.error(
          "Workspace monitor error:",
          data?.message
        );
      }
    } catch (err) {
      console.error(
        "Error fetching workspaces:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     👨‍💼 FETCH EXPERT LIST
  ===================================================== */

  const fetchExpertsList = async () => {
    try {
      const response = await getWorkspaceExpertsList();
      const data = response?.data;

      if (data?.success) {
        setExpertsList(data.data || []);
      } else {
        console.error(
          "Experts list error:",
          data?.message
        );
      }
    } catch (err) {
      console.error(
        "Error fetching experts list:",
        err
      );
    }
  };

  /* =====================================================
     🚀 INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    fetchWorkspaces();
    fetchExpertsList();
  }, []);

  /* =====================================================
     🔄 ADMIN WORKFLOW OVERRIDE
  ===================================================== */

  const handleOverrideStep = async (
    bookingId,
    targetStepKey
  ) => {
    if (!bookingId || !targetStepKey) {
      return;
    }

    try {
      const response = await updateWorkspaceStep(
        bookingId,
        targetStepKey
      );

      const data = response?.data;

      if (data?.success) {
        await fetchWorkspaces();
      } else {
        alert(
          data?.message ||
            "Override failed."
        );
      }
    } catch (err) {
      console.error(
        "Workspace step override error:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Error overriding workspace step."
      );
    }
  };

  const handleDismissStatusRequest = async (bookingId) => {
    try {
      const response = await dismissWorkspaceStatusRequest(bookingId);
      if (response?.data?.success) {
        await fetchWorkspaces();
      }
    } catch (err) {
      alert("Failed to dismiss status request.");
    }
  };

  /* =====================================================
     🔄 OPEN REASSIGN MODAL
  ===================================================== */

  const handleOpenReassignModal = (ws) => {
    setSelectedWsForReassign(ws);

    setTargetExpertId(
      ws?.expert_id
        ? String(ws.expert_id)
        : ""
    );
  };

  /* =====================================================
     👨‍💼 SAVE EXPERT REASSIGNMENT
  ===================================================== */

  const handleSaveReassignment = async () => {
    if (!selectedWsForReassign) {
      return;
    }

    try {
      setReassigning(true);

      const bookingId =
        selectedWsForReassign.booking_id;

      const expertId = targetExpertId
        ? Number(targetExpertId)
        : null;

      const response =
        await reassignWorkspaceExpert(
          bookingId,
          expertId
        );

      const data = response?.data;

      if (data?.success) {
        setSelectedWsForReassign(null);
        setTargetExpertId("");

        await fetchWorkspaces();
      } else {
        alert(
          data?.message ||
            "Reassignment failed."
        );
      }
    } catch (err) {
      console.error(
        "Expert reassignment error:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Error reassigning expert."
      );
    } finally {
      setReassigning(false);
    }
  };

  /* =====================================================
     🔍 FILTERED WORKSPACES
  ===================================================== */

  const filteredWorkspaces = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return workspaces.filter((ws) => {
      const matchesSearch =
        String(ws.booking_id || "")
          .toLowerCase()
          .includes(normalizedSearch) ||

        String(ws.id || "")
          .toLowerCase()
          .includes(normalizedSearch) ||

        (ws.master_service_title || "")
          .toLowerCase()
          .includes(normalizedSearch) ||

        (ws.user_first_name || "")
          .toLowerCase()
          .includes(normalizedSearch) ||

        (ws.user_last_name || "")
          .toLowerCase()
          .includes(normalizedSearch) ||

        (ws.expert_name || "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        (ws.current_step_key || "")
          .toUpperCase() === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    workspaces,
    searchTerm,
    statusFilter,
  ]);

  /* =====================================================
     📊 STATISTICS
  ===================================================== */

  const stats = useMemo(() => {
    const total = workspaces.length;

    const submitted = workspaces.filter(
      (w) =>
        (w.current_step_key || "")
          .toUpperCase() === "SUBMITTED"
    ).length;

    const assigned = workspaces.filter(
      (w) =>
        (w.current_step_key || "")
          .toUpperCase() ===
        "EXPERT_ASSIGNED"
    ).length;

    const inReview = workspaces.filter(
      (w) =>
        (w.current_step_key || "")
          .toUpperCase() === "IN_REVIEW"
    ).length;

    const delivered = workspaces.filter(
      (w) =>
        (w.current_step_key || "")
          .toUpperCase() === "DELIVERED"
    ).length;

    const completed = workspaces.filter(
      (w) =>
        (w.current_step_key || "")
          .toUpperCase() === "COMPLETED"
    ).length;

    return {
      total,
      submitted,
      assigned,
      inReview,
      delivered,
      completed,
    };
  }, [workspaces]);

  /* =====================================================
     🔢 GET LIFECYCLE STEP INDEX
  ===================================================== */

  const getStepIndex = (stepKey = "") => {
    const keyUpper =
      stepKey.toUpperCase();

    if (keyUpper === "SUBMITTED") {
      return 0;
    }

    if (
      keyUpper === "EXPERT_ASSIGNED"
    ) {
      return 1;
    }

    if (keyUpper === "IN_REVIEW") {
      return 2;
    }

    if (keyUpper === "DELIVERED") {
      return 3;
    }

    if (keyUpper === "COMPLETED") {
      return 4;
    }

    return 0;
  };

  /* =====================================================
     🎨 UI
  ===================================================== */

  return (
    <div
      style={{
        padding: "1.5rem",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "1.75rem",
              fontWeight: "800",
            }}
          >
            🛡️ Service Execution & Lifecycle Command Center
          </h2>

          <p
            style={{
              margin: "0.25rem 0 0 0",
              color: "#64748b",
              fontSize: "0.95rem",
            }}
          >
            Track complete end-to-end service status from
            booking creation to final completion & expert
            assignment.
          </p>
        </div>

        <button
          onClick={fetchWorkspaces}
          style={{
            padding: "0.6rem 1.25rem",
            background: "#ffffff",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            fontWeight: "700",
            cursor: "pointer",
            color: "#1e293b",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          ↻ Refresh Grid
        </button>
      </div>

      {/* Lifecycle Process Explanation Banner */}
      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          padding: "1rem 1.25rem",
          borderRadius: "10px",
          marginBottom: "1.5rem",
        }}
      >
        <h4
          style={{
            margin: "0 0 0.4rem 0",
            color: "#1e40af",
            fontSize: "0.95rem",
          }}
        >
          🔄 End-to-End Service Status Process Pipeline:
        </h4>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            fontSize: "0.82rem",
            fontWeight: "700",
          }}
        >
          <span
            style={{
              background: "#dbeafe",
              color: "#1e40af",
              padding: "0.3rem 0.65rem",
              borderRadius: "6px",
            }}
          >
            1. Booked (Intake Submitted)
          </span>

          <span style={{ color: "#94a3b8" }}>
            ➔
          </span>

          <span
            style={{
              background: "#e0e7ff",
              color: "#3730a3",
              padding: "0.3rem 0.65rem",
              borderRadius: "6px",
            }}
          >
            2. Expert Assigned
          </span>

          <span style={{ color: "#94a3b8" }}>
            ➔
          </span>

          <span
            style={{
              background: "#fef3c7",
              color: "#92400e",
              padding: "0.3rem 0.65rem",
              borderRadius: "6px",
            }}
          >
            3. In Progress (Verification)
          </span>

          <span style={{ color: "#94a3b8" }}>
            ➔
          </span>

          <span
            style={{
              background: "#f3e8ff",
              color: "#6b21a8",
              padding: "0.3rem 0.65rem",
              borderRadius: "6px",
            }}
          >
            4. Delivered (Work Submitted)
          </span>

          <span style={{ color: "#94a3b8" }}>
            ➔
          </span>

          <span
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "0.3rem 0.65rem",
              borderRadius: "6px",
            }}
          >
            5. Completed & Closed ✅
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "1.1rem",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              color: "#64748b",
              fontWeight: "700",
            }}
          >
            TOTAL ORDERS
          </span>

          <h3
            style={{
              margin: "0.2rem 0 0 0",
              fontSize: "1.7rem",
              color: "#0f172a",
              fontWeight: "800",
            }}
          >
            {stats.total}
          </h3>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "1.1rem",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              color: "#b45309",
              fontWeight: "700",
            }}
          >
            1. BOOKED
          </span>

          <h3
            style={{
              margin: "0.2rem 0 0 0",
              fontSize: "1.7rem",
              color: "#d97706",
              fontWeight: "800",
            }}
          >
            {stats.submitted}
          </h3>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "1.1rem",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              color: "#3730a3",
              fontWeight: "700",
            }}
          >
            2. ASSIGNED
          </span>

          <h3
            style={{
              margin: "0.2rem 0 0 0",
              fontSize: "1.7rem",
              color: "#4f46e5",
              fontWeight: "800",
            }}
          >
            {stats.assigned}
          </h3>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "1.1rem",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              color: "#1d4ed8",
              fontWeight: "700",
            }}
          >
            3. IN PROGRESS
          </span>

          <h3
            style={{
              margin: "0.2rem 0 0 0",
              fontSize: "1.7rem",
              color: "#2563eb",
              fontWeight: "800",
            }}
          >
            {stats.inReview}
          </h3>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "1.1rem",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              color: "#6d28d9",
              fontWeight: "700",
            }}
          >
            4. DELIVERED
          </span>

          <h3
            style={{
              margin: "0.2rem 0 0 0",
              fontSize: "1.7rem",
              color: "#7c3aed",
              fontWeight: "800",
            }}
          >
            {stats.delivered}
          </h3>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "1.1rem",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              color: "#15803d",
              fontWeight: "700",
            }}
          >
            5. COMPLETED
          </span>

          <h3
            style={{
              margin: "0.2rem 0 0 0",
              fontSize: "1.7rem",
              color: "#166534",
              fontWeight: "800",
            }}
          >
            {stats.completed}
          </h3>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          background: "#ffffff",
          padding: "1rem",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          marginBottom: "1.5rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search by Booking ID, Service, User or Expert..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          style={{
            flex: 1,
            minWidth: "260px",
            padding: "0.6rem 0.85rem",
            borderRadius: "6px",
            border:
              "1px solid #cbd5e1",
            fontSize: "0.9rem",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <label
            style={{
              fontSize: "0.85rem",
              fontWeight: "700",
              color: "#475569",
            }}
          >
            Status Filter:
          </label>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "6px",
              border:
                "1px solid #cbd5e1",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            <option value="ALL">
              All Lifecycle Statuses
            </option>

            <option value="SUBMITTED">
              1. SUBMITTED
            </option>

            <option value="EXPERT_ASSIGNED">
              2. EXPERT_ASSIGNED
            </option>

            <option value="IN_REVIEW">
              3. IN_REVIEW (In Progress)
            </option>

            <option value="DELIVERED">
              4. DELIVERED
            </option>

            <option value="COMPLETED">
              5. COMPLETED
            </option>

            <option value="CANCELLED">
              CANCELLED
            </option>
          </select>
        </div>
      </div>

      {/* Workspaces Table */}
      {loading ? (
        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            padding: "2rem",
          }}
        >
          Loading active workspaces...
        </p>
      ) : (
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            borderRadius: "10px",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: "1100px",
              borderCollapse:
                "collapse",
              background: "#fff",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f1f5f9",
                  textAlign: "left",
                  borderBottom:
                    "1px solid #e2e8f0",
                }}
              >
                <th
                  style={{
                    padding:
                      "0.85rem 1rem",
                  }}
                >
                  Booking / Workspace
                </th>

                <th
                  style={{
                    padding:
                      "0.85rem 1rem",
                  }}
                >
                  Booked Service
                </th>

                <th
                  style={{
                    padding:
                      "0.85rem 1rem",
                  }}
                >
                  Client User
                </th>

                <th
                  style={{
                    padding:
                      "0.85rem 1rem",
                  }}
                >
                  Assigned Expert
                </th>

                <th
                  style={{
                    padding:
                      "0.85rem 1rem",
                    minWidth: "280px",
                  }}
                >
                  Lifecycle Progress Bar
                </th>

                <th
                  style={{
                    padding:
                      "0.85rem 1rem",
                  }}
                >
                  Actions & Controls
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredWorkspaces.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "2.5rem",
                      textAlign:
                        "center",
                      color: "#64748b",
                    }}
                  >
                    No matching workspaces
                    found.
                  </td>
                </tr>
              ) : (
                filteredWorkspaces.map(
                  (ws) => {
                    const activeIndex =
                      getStepIndex(
                        ws.current_step_key
                      );

                    return (
                      <tr
                        key={ws.id}
                        style={{
                          borderBottom:
                            "1px solid #e2e8f0",
                        }}
                      >
                        <td
                          style={{
                            padding:
                              "0.85rem 1rem",
                          }}
                        >
                          <span
                            style={{
                              display:
                                "block",
                              fontWeight:
                                "800",
                              color:
                                "#0f172a",
                            }}
                          >
                            #BK-
                            {ws.booking_id}
                          </span>

                          <span
                            style={{
                              fontSize:
                                "0.75rem",
                              color:
                                "#64748b",
                            }}
                          >
                            WS #{ws.id}
                          </span>
                        </td>

                        <td
                          style={{
                            padding:
                              "0.85rem 1rem",
                          }}
                        >
                          <span
                            style={{
                              display:
                                "block",
                              fontWeight:
                                "700",
                              color:
                                "#1e293b",
                            }}
                          >
                            {
                              ws.master_service_title
                            }
                          </span>

                          <span
                            style={{
                              fontSize:
                                "0.78rem",
                              fontWeight:
                                "800",
                              color:
                                "#166534",
                            }}
                          >
                            ₹
                            {ws.amount || 0}
                          </span>
                        </td>

                        <td
                          style={{
                            padding:
                              "0.85rem 1rem",
                          }}
                        >
                          <span
                            style={{
                              display:
                                "block",
                              fontWeight:
                                "600",
                              color:
                                "#334155",
                            }}
                          >
                            {
                              ws.user_first_name
                            }{" "}
                            {
                              ws.user_last_name
                            }
                          </span>

                          <span
                            style={{
                              fontSize:
                                "0.75rem",
                              color:
                                "#64748b",
                            }}
                          >
                            {ws.user_phone ||
                              ws.user_email ||
                              `User #${ws.user_id}`}
                          </span>
                        </td>

                        <td
                          style={{
                            padding:
                              "0.85rem 1rem",
                          }}
                        >
                          <span
                            style={{
                              display:
                                "block",
                              fontWeight:
                                "700",
                              color:
                                ws.expert_name?.includes(
                                  "Unassigned"
                                )
                                  ? "#dc2626"
                                  : "#2563eb",
                            }}
                          >
                            {ws.expert_name ||
                              "Unassigned Expert"}
                          </span>

                          <span
                            style={{
                              fontSize:
                                "0.75rem",
                              color:
                                "#64748b",
                            }}
                          >
                            Expert #
                            {ws.expert_id ||
                              "None"}
                          </span>
                        </td>

                        {/* Visual Lifecycle Stepper */}
                        <td
                          style={{
                            padding:
                              "0.85rem 1rem",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              gap: "0.3rem",
                              alignItems:
                                "center",
                              marginBottom:
                                "0.35rem",
                            }}
                          >
                            {LIFECYCLE_STEPS.map(
                              (
                                stepItem,
                                idx
                              ) => {
                                const isDone =
                                  idx <=
                                  activeIndex;

                                const isCurrent =
                                  idx ===
                                  activeIndex;

                                return (
                                  <span
                                    key={
                                      stepItem.key
                                    }
                                    title={
                                      stepItem.label
                                    }
                                    style={{
                                      padding:
                                        "0.2rem 0.45rem",
                                      borderRadius:
                                        "4px",
                                      fontSize:
                                        "0.72rem",
                                      fontWeight:
                                        "800",
                                      background:
                                        isCurrent
                                          ? "#2563eb"
                                          : isDone
                                          ? "#dcfce7"
                                          : "#f1f5f9",
                                      color:
                                        isCurrent
                                          ? "#ffffff"
                                          : isDone
                                          ? "#166534"
                                          : "#94a3b8",
                                    }}
                                  >
                                    {
                                      stepItem.icon
                                    }{" "}
                                    {idx +
                                      1}
                                  </span>
                                );
                              }
                            )}
                          </div>

                          <span
                            style={{
                              fontSize:
                                "0.78rem",
                              fontWeight:
                                "700",
                              color:
                                "#334155",
                            }}
                          >
                            Current Phase:{" "}
                            <strong
                              style={{
                                color:
                                  "#2563eb",
                              }}
                            >
                              {
                                ws.current_step_key
                              }
                            </strong>
                          </span>

                          {ws.expert_status_request && (
                            <div style={{ marginTop: "0.5rem", background: "#fef3c7", border: "1px solid #fde68a", borderRadius: "6px", padding: "0.5rem" }}>
                              <span style={{ fontSize: "0.78rem", fontWeight: "800", color: "#92400e", display: "block" }}>
                                {ws.expert_status_request === "COMPLETED_REQUESTED" ? "⏳ Expert Requested Completion Approval" : "⚠️ Expert Requested Cancellation Approval"}
                              </span>
                              {ws.expert_request_notes && (
                                <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.75rem", color: "#78350f" }}>
                                  "{ws.expert_request_notes}"
                                </p>
                              )}
                              <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.4rem" }}>
                                <button
                                  onClick={() => handleOverrideStep(ws.booking_id, ws.expert_status_request === "COMPLETED_REQUESTED" ? "COMPLETED" : "CANCELLED")}
                                  style={{ background: "#059669", color: "#fff", border: "none", borderRadius: "4px", padding: "0.25rem 0.55rem", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}
                                >
                                  ✅ Approve & Confirm
                                </button>
                                <button
                                  onClick={() => handleDismissStatusRequest(ws.booking_id)}
                                  style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: "4px", padding: "0.25rem 0.55rem", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}
                                >
                                  ❌ Reject Request
                                </button>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td
                          style={{
                            padding:
                              "0.85rem 1rem",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              gap: "0.4rem",
                              flexWrap:
                                "wrap",
                              alignItems:
                                "center",
                            }}
                          >
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/workspace/${ws.booking_id}`
                                )
                              }
                              style={{
                                padding:
                                  "0.4rem 0.75rem",
                                background:
                                  "#2563eb",
                                color:
                                  "#fff",
                                border:
                                  "none",
                                borderRadius:
                                  "6px",
                                fontSize:
                                  "0.8rem",
                                fontWeight:
                                  "700",
                                cursor:
                                  "pointer",
                              }}
                            >
                              Inspect Workspace
                              👁️
                            </button>

                            <button
                              onClick={() =>
                                handleOpenReassignModal(
                                  ws
                                )
                              }
                              style={{
                                padding:
                                  "0.4rem 0.65rem",
                                background:
                                  "#0284c7",
                                color:
                                  "#fff",
                                border:
                                  "none",
                                borderRadius:
                                  "6px",
                                fontSize:
                                  "0.8rem",
                                fontWeight:
                                  "700",
                                cursor:
                                  "pointer",
                              }}
                            >
                              🔄 Reassign Expert
                            </button>

                            <select
                              defaultValue=""
                              onChange={(
                                e
                              ) => {
                                if (
                                  e.target
                                    .value
                                ) {
                                  handleOverrideStep(
                                    ws.booking_id,
                                    e.target
                                      .value
                                  );

                                  // Reset dropdown after action
                                  e.target.value =
                                    "";
                                }
                              }}
                              style={{
                                padding:
                                  "0.4rem 0.5rem",
                                borderRadius:
                                  "6px",
                                border:
                                  "1px solid #cbd5e1",
                                fontSize:
                                  "0.8rem",
                                fontWeight:
                                  "600",
                              }}
                            >
                              <option
                                value=""
                                disabled
                              >
                                Change Status...
                              </option>

                              <option value="SUBMITTED">
                                1. SUBMITTED
                              </option>

                              <option value="EXPERT_ASSIGNED">
                                2. EXPERT_ASSIGNED
                              </option>

                              <option value="IN_REVIEW">
                                3. IN_REVIEW
                              </option>

                              <option value="DELIVERED">
                                4. DELIVERED
                              </option>

                              <option value="COMPLETED">
                                5. COMPLETED
                              </option>

                              <option value="CANCELLED">
                                CANCELLED
                              </option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* =====================================================
          🔄 EXPERT REASSIGN MODAL
      ===================================================== */}

      {selectedWsForReassign && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "rgba(15, 23, 42, 0.75)",
            backdropFilter:
              "blur(4px)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            zIndex: 999999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              maxWidth: "520px",
              width: "100%",
              padding: "1.5rem",
              boxShadow:
                "0 20px 25px -5px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <h3
              style={{
                margin:
                  "0 0 0.5rem 0",
                color: "#0f172a",
              }}
            >
              🔄 Reassign / Change Expert
            </h3>

            <p
              style={{
                fontSize: "0.85rem",
                color: "#64748b",
                margin:
                  "0 0 1.25rem 0",
              }}
            >
              Booking{" "}
              <strong>
                #BK-
                {
                  selectedWsForReassign.booking_id
                }
              </strong>{" "}
              (
              {
                selectedWsForReassign.master_service_title
              }
              )
            </p>

            <div
              style={{
                marginBottom: "1rem",
                background: "#f8fafc",
                padding: "0.85rem",
                borderRadius: "8px",
                border:
                  "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#475569",
                  marginBottom:
                    "0.25rem",
                }}
              >
                Client User:{" "}
                <strong>
                  {
                    selectedWsForReassign.user_first_name
                  }{" "}
                  {
                    selectedWsForReassign.user_last_name
                  }
                </strong>
              </div>

              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#475569",
                }}
              >
                Currently Assigned Expert:{" "}
                <strong>
                  {
                    selectedWsForReassign.expert_name ||
                    "Unassigned"
                  }
                </strong>
              </div>
            </div>

            <div
              style={{
                marginBottom:
                  "1.25rem",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  marginBottom:
                    "0.35rem",
                  color: "#1e293b",
                }}
              >
                Select Target Expert:
              </label>

              <select
                value={targetExpertId}
                onChange={(e) =>
                  setTargetExpertId(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "0.65rem",
                  borderRadius: "8px",
                  border:
                    "1px solid #cbd5e1",
                  fontSize: "0.9rem",
                  background: "#fff",
                }}
              >
                <option value="">
                  ❌ Remove Expert / Leave
                  Unassigned
                </option>

                {expertsList.map(
                  (exp) => (
                    <option
                      key={exp.id}
                      value={exp.id}
                    >
                      {exp.name} (ID #
                      {exp.id} -{" "}
                      {exp.phone ||
                        exp.email}
                      )
                    </option>
                  )
                )}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent:
                  "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setSelectedWsForReassign(
                    null
                  );
                  setTargetExpertId("");
                }}
                style={{
                  padding:
                    "0.6rem 1.25rem",
                  background:
                    "#f1f5f9",
                  color: "#475569",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={
                  handleSaveReassignment
                }
                disabled={
                  reassigning
                }
                style={{
                  padding:
                    "0.6rem 1.25rem",
                  background:
                    reassigning
                      ? "#94a3b8"
                      : "#059669",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "700",
                  cursor:
                    reassigning
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {reassigning
                  ? "Saving Changes..."
                  : "Confirm Expert Change ✅"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}