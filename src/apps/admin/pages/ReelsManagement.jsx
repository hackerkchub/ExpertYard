import React, { useEffect, useState } from "react";
import {
  getAdminReelsApi,
  getPendingReelsApi,
  approveReelApi,
  rejectReelApi,
  blockReelApi
} from "../../../shared/api/reels.api";

import {
  FiCheck,
  FiX,
  FiAlertOctagon,
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
  SpinnerWrapper,
  Spinner
} from "./ReelsManagement.styles";

const STATUS_CODES = {
  draft: -1,
  pending: 0,
  approved: 1,
  rejected: 2,
  blocked: 3,
};

const normalizeStatus = (reel) => {
  if (typeof reel.status === "string") return reel.status;
  const code = Number(reel.status_code ?? reel.status);
  return Object.keys(STATUS_CODES).find((key) => STATUS_CODES[key] === code) || "draft";
};

const statusLabel = (reel) => {
  const status = normalizeStatus(reel);
  if (status === "pending") return "Pending Approval";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function ReelsManagement() {
  const [activeTab, setActiveTab] = useState("pending");
  const [reels, setReels] = useState([]);
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
      } else {
        const params = activeTab === "all" ? { status: "all" } : { status: activeTab };
        const res = await getAdminReelsApi(params);
        if (res.data && res.data.success) {
          setReels(res.data.data || []);
        }
      }
    } catch (err) {
      console.error("Error loading admin Reels data:", err);
      Swal.fire("Error", "Failed to load reels", "error");
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
        <TabButton active={activeTab === "rejected"} onClick={() => setActiveTab("rejected")}>
          Rejected Reels
        </TabButton>
        <TabButton active={activeTab === "blocked"} onClick={() => setActiveTab("blocked")}>
          Blocked Reels
        </TabButton>
        <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
          All Reels
        </TabButton>
      </TabsRow>

      {loading ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
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
                    {reel.linked_service_title && <span className="category">{reel.linked_service_title}</span>}
                  </div>
                </MetaRow>

                <ReelTitle>{reel.title}</ReelTitle>
                {reel.caption && <ReelCaption>{reel.caption}</ReelCaption>}
                <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 10px" }}>
                  Status: {statusLabel(reel)}
                  {reel.submitted_at ? ` - Submitted: ${new Date(reel.submitted_at).toLocaleDateString()}` : ""}
                </p>

                <ActionsRow>
                  {normalizeStatus(reel) === "pending" && (
                    <>
                      <Button variant="success" onClick={() => handleApprove(reel.id)}>
                        <FiCheck /> Approve
                      </Button>
                      <Button variant="danger" onClick={() => handleReject(reel.id)}>
                        <FiX /> Reject
                      </Button>
                    </>
                  )}
                  {normalizeStatus(reel) === "approved" && (
                    <Button variant="danger" onClick={() => handleBlock(reel.id)}>
                      <FiAlertOctagon /> Block Reel
                    </Button>
                  )}
                  {!["pending", "approved"].includes(normalizeStatus(reel)) && (
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#ef4444", textTransform: "uppercase" }}>
                      {statusLabel(reel)}
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
