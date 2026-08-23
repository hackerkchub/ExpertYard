import React from "react";

export default function InvoiceTab({ snapshot, workspace }) {
  const fin = snapshot?.financial || {};
  const meta = snapshot?.service_meta || {};
  const user = snapshot?.user || {};

  return (
    <div className="tab-invoice">
      <h3 className="tab-panel-title">Service Invoice Receipt</h3>

      <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, color: '#2563eb' }}>G9Expert Service OS</h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Digital Service Marketplace</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h4 style={{ margin: 0 }}>SERVICE INVOICE</h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Invoice Date: {new Date(workspace.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p><strong>Billed To:</strong> {user.first_name} {user.last_name} ({user.email})</p>
          <p><strong>Service Item:</strong> {meta.title}</p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem' }}>Description</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '0.75rem' }}>Base Service Fee</td>
              <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{fin.effective_base_amount || fin.base_amount || 0}</td>
            </tr>
            {Number(fin.gst_amount) > 0 && (
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem' }}>GST Tax ({fin.gst_rate_percent || 18}%)</td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{fin.gst_amount}</td>
              </tr>
            )}
            <tr style={{ fontWeight: '800', background: '#f1f5f9' }}>
              <td style={{ padding: '0.75rem' }}>Total Paid</td>
              <td style={{ padding: '0.75rem', textAlign: 'right', color: '#166534' }}>₹{fin.total_amount || 0}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
