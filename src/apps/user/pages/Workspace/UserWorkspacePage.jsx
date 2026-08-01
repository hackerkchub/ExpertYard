import React from "react";
import { useParams } from "react-router-dom";
import BookingWorkspaceShell from "../../../../shared/components/Workspace/BookingWorkspaceShell";

export default function UserWorkspacePage() {
  const { bookingId } = useParams();

  return (
    <div style={{ background: "#f8fafc", minHeight: "90vh", padding: "1rem 0" }}>
      <BookingWorkspaceShell bookingId={bookingId} currentUserRole="user" />
    </div>
  );
}
