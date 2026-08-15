import React from "react";

export default function ChecklistTab({ snapshot, workspace }) {
  const steps = snapshot?.workflow_graph || [];

  return (
    <div className="tab-checklist">
      <h3 className="tab-panel-title">Fulfillment Step Checklist</h3>

      {steps.length === 0 ? (
        <div style={{ padding: "1rem", color: "#64748b", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          Standard fulfillment step checklist active for status: <strong>{workspace?.current_step_key || "SUBMITTED"}</strong>.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {steps.map((step, idx) => {
            const isCurrent = step.step_key === workspace?.current_step_key;
            return (
              <div
                key={step.step_key || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: isCurrent ? '#eff6ff' : '#ffffff'
                }}
              >
                <div>
                  <span style={{ fontWeight: '800', marginRight: '0.5rem', color: '#334155' }}>Step {step.step_order || idx + 1}:</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>{step.step_label || step.step_key}</span>
                </div>
                <div>
                  {isCurrent ? (
                    <span style={{ background: '#2563eb', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700' }}>Active Step</span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Pending</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
