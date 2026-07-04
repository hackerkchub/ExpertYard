import React, { useEffect, useState } from "react";
import {
  getAdminReelsApi,
  getPendingReelsApi,
  approveReelApi,
  rejectReelApi,
  blockReelApi,
  getReportedReelsApi,
  resolveReportApi
} from "../../../shared/api/reels.api";

import {
  FiCheck,
  FiX,
  FiAlertOctagon,
  FiAlertCircle,
  FiTrash,
  FiPlay
} from "react-icons/fi";
import Swal from "sweetalert2";

import {
  Container,
  Title,
  TabsRow,
  TabButton,
  Grid,
  ReelCard,
  VideoContainer,
  Content,
  MetaRow,
  ReelTitle,
  ReelCaption,
  ActionsRow,
  Button,
  ReportsTable,
  ReportReason,
  SpinnerWrapper,
  Spinner
} from "./ReelsManagement.styles";

export default function ReelsManagement() {
  const [activeTab, setActiveTab] = useState("pending");
  const [reels, setReels] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load active tab data
  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "pending") {
        const res = await getPendingReelsApi();
        if (res.data && res.data.success) {
          setReels(res.data.data || []);
        }
      } else if (activeTab === "approved") {
        const res = await getAdminReelsApi();
        if (res.data && res.data.success) {
          const list = res.data.data || [];
          setReels(list.filter(r => r.status === 1));
        }
      } else if (activeTab === "reports") {
        const res = await getReportedReelsApi();
        if (res.data && res.data.success) {
          setReports(res.data.data || []);
        }
      } else {
        const res = await getAdminReelsApi();
        if (res.data && res.data.success) {
          setReels(res.data.data || []);
        }
      }
    } catch (err) {
      console.error("Error loading admin Reels data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Approve Reel
  const handleApprove = async (id) => {
    try {
      await approveReelApi(id);
      Swal.fire("Approved", "Reel approved successfully", "success");
      loadData();
    } catch (err) {
      console.error("Approve reel error:", err);
      Swal.fire("Error", "Failed to approve reel", "error");
    }
  };

  // Reject Reel
  const handleReject = async (id) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Reel",
      input: "textarea",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Specify why this reel is rejected...",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "Rejection reason is required!";
      }
    });

    if (reason) {
      try {
        await rejectReelApi(id, { reason });
        Swal.fire("Rejected", "Reel rejected with reason", "success");
        loadData();
      } catch (err) {
        console.error("Reject reel error:", err);
        Swal.fire("Error", "Failed to reject reel", "error");
      }
    }
  };

  // Block Reel
  const handleBlock = async (id) => {
    const confirm = await Swal.fire({
      title: "Block Reel?",
      text: "This reel will be removed from public user feeds.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, block it"
    });

    if (confirm.isConfirmed) {
      try {
        await blockReelApi(id);
        Swal.fire("Blocked", "Reel blocked successfully", "success");
        loadData();
      } catch (err) {
        console.error("Block reel error:", err);
        Swal.fire("Error", "Failed to block reel", "error");
      }
    }
  };

  // Resolve Report
  const handleResolveReport = async (reportId) => {
    try {
      await resolveReportApi(reportId);
      Swal.fire("Resolved", "Report resolved", "success");
      loadData();
    } catch (err) {
      console.error("Resolve report error:", err);
      Swal.fire("Error", "Failed to resolve report", "error");
    }
  };

  return (
    <Container>
      <Title>Expert Reels Moderation</Title>

      <TabsRow>
        <TabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")}>
          Pending Approval
        </TabButton>
        <TabButton active={activeTab === "approved"} onClick={() => setActiveTab("approved")}>
          Approved Reels
        </TabButton>
        <TabButton active={activeTab === "reports"} onClick={() => setActiveTab("reports")}>
          Reported Reels
        </TabButton>
        <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
          All Reels
        </TabButton>
      </TabsRow>

      {loading ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : activeTab === "reports" ? (
        reports.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>No reports to moderate.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <ReportsTable>
              <thead>
                <tr>
                  <th>Reel Title</th>
                  <th>Expert Name</th>
                  <th>Reporter</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <a href={report.video_url} target="_blank" rel="noopener noreferrer" style={{ color: "#000080", fontWeight: "600", textDecoration: "underline" }}>
                        {report.reel_title}
                      </a>
                    </td>
                    <td>{report.expert_name}</td>
                    <td>{report.reporter_name || "User"}</td>
                    <td>
                      <ReportReason>{report.reason}</ReportReason>
                    </td>
                    <td>
                      <span style={{ fontWeight: "700", color: report.status === 1 ? "#10b981" : "#ef4444" }}>
                        {report.status === 1 ? "Resolved" : "Pending"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {report.status === 0 && (
                          <Button variant="success" onClick={() => handleResolveReport(report.id)}>
                            <FiCheck /> Resolve
                          </Button>
                        )}
                        <Button variant="danger" onClick={() => handleBlock(report.reel_id)}>
                          <FiAlertOctagon /> Take Down Reel
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ReportsTable>
          </div>
        )
      ) : reels.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>No reels found in this tab.</p>
      ) : (
        <Grid>
          {reels.map((reel) => (
            <ReelCard key={reel.id}>
              <VideoContainer>
                <video src={reel.video_url} controls muted playsInline />
              </VideoContainer>
              <Content>
                <MetaRow>
                  <img src={reel.expert_profile_photo || "https://placehold.co/100x100"} alt={reel.expert_name} />
                  <div>
                    <span className="name">{reel.expert_name}</span>
                    {reel.category_name && <span className="category">{reel.category_name}</span>}
                  </div>
                </MetaRow>

                <ReelTitle>{reel.title}</ReelTitle>
                {reel.caption && <ReelCaption>{reel.caption}</ReelCaption>}

                <ActionsRow>
                  {reel.status === 0 && (
                    <>
                      <Button variant="success" onClick={() => handleApprove(reel.id)}>
                        <FiCheck /> Approve
                      </Button>
                      <Button variant="danger" onClick={() => handleReject(reel.id)}>
                        <FiX /> Reject
                      </Button>
                    </>
                  )}
                  {reel.status === 1 && (
                    <Button variant="danger" onClick={() => handleBlock(reel.id)}>
                      <FiAlertOctagon /> Block Reel
                    </Button>
                  )}
                  {reel.status !== 0 && reel.status !== 1 && (
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#ef4444", textTransform: "uppercase" }}>
                      {reel.status === 2 ? "Rejected" : "Blocked"}
                    </span>
                  )}
                </ActionsRow>
              </Content>
            </ReelCard>
          ))}
        </Grid>
      )}
    </Container>
  );
}
