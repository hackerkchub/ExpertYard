import React from "react";
import { useParams } from "react-router-dom";
import BookingWorkspaceShell from "../../../../shared/components/Workspace/BookingWorkspaceShell";

export default function ExpertWorkspacePage() {
  const { bookingId } = useParams();

  return (
    <div style={{ background: "#f8fafc", minHeight: "90vh", padding: "0.5rem 0.25rem", boxSizing: "border-box" }}>
      <BookingWorkspaceShell bookingId={bookingId} currentUserRole="expert" />
    </div>
  );
}
