import React from "react";

export default function TimelineTab({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="tab-timeline">
        <h3 className="tab-panel-title">Activity Timeline History</h3>
        <p style={{ color: "#64748b" }}>No activity logs recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="tab-timeline">
      <h3 className="tab-panel-title">Activity Timeline History</h3>
      <div style={{ borderLeft: "2px solid #cbd5e1", paddingLeft: "1.25rem", marginLeft: "0.5rem" }}>
        {timeline.map((item) => (
          <div key={item.id} style={{ marginBottom: "1.25rem", position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "-1.7rem",
                top: "0.2rem",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#2563eb",
                border: "2px solid #ffffff"
              }}
            />
            <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
              {new Date(item.created_at).toLocaleString()} • {item.actor_role}
            </div>
            <div style={{ fontSize: "1rem", fontWeight: "700", color: "#0f172a", margin: "0.15rem 0" }}>
              {item.title}
            </div>
            {item.description && (
              <div style={{ fontSize: "0.875rem", color: "#475569" }}>{item.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
