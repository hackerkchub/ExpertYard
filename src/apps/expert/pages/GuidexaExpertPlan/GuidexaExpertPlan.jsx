import React, { useState, useEffect } from "react";
import axios from "axios";
import { useExpert } from "../../../../shared/context/ExpertContext"; 
import Loader from "../../../../shared/components/Loader/Loader";

const GuidexaExpertPlan = () => {
  const { expertData } = useExpert();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Expert ID context se nikal rahe hain
  const expertId = expertData?.expertId || 132; 

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://softmaxs.com/api/expert-plan/expert/${expertId}`);
        if (response.data.success) {
          setPlan(response.data.data);
        } else {
          setError("No active subscription plan found for this account.");
        }
      } catch (err) {
        setError("Unable to connect to the server. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    if (expertId) fetchPlanDetails();
  }, [expertId]);

  if (loading) return <Loader />;

  return (
    <div className="expert-plan-wrapper">
      <style>{`
        .expert-plan-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          min-height: 80vh;
          background: #f4f7fa; /* Light professional background */
        }
        .plan-card {
          width: 100%;
          max-width: 550px;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          animation: slideUp 0.5s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .plan-header {
          padding: 30px;
          background: linear-gradient(135deg, #000080 0%, #00004d 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .plan-header h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }
        .status-badge {
          background: #22c55e;
          color: white;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          box-shadow: 0 4px 10px rgba(34, 197, 94, 0.3);
        }
        .plan-body {
          padding: 30px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 25px;
          margin-bottom: 30px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 6px;
          letter-spacing: 0.8px;
        }
        .info-value {
          font-size: 15px;
          color: #1e293b;
          font-weight: 600;
        }
        .billing-box {
          background: #f8fafc;
          border-radius: 15px;
          padding: 20px;
          border: 1px solid #edf2f7;
        }
        .bill-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
          color: #475569;
        }
        .bill-row.total {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
          color: #000080;
          font-size: 20px;
          font-weight: 800;
        }
        .payment-id-tag {
          font-family: monospace;
          background: #e2e8f0;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
        }
        .error-state {
          text-align: center;
          padding: 40px;
          color: #64748b;
        }
        .footer-note {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #94a3b8;
          border-top: 1px solid #f1f5f9;
        }

        /* Mobile Optimization */
        @media (max-width: 480px) {
          .info-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          .plan-header {
            padding: 20px;
          }
          .plan-body {
            padding: 20px;
          }
          .bill-row.total {
            font-size: 18px;
          }
        }
      `}</style>

      <div className="plan-card">
        {error ? (
          <div className="error-state">
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>ℹ️</div>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="plan-header">
              <h2>Subscription Plan</h2>
              <span className="status-badge">
                {plan?.plan_status === 1 ? "Active" : "Pending"}
              </span>
            </div>

            <div className="plan-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Current Plan</span>
                  <span className="info-value" style={{textTransform: 'capitalize'}}>{plan?.plan_name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Expert ID</span>
                  <span className="info-value">#{plan?.expert_id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Start Date</span>
                  <span className="info-value">{new Date(plan?.start_date).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Expiry Date</span>
                  <span className="info-value">{new Date(plan?.expiry_date).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Payment ID</span>
                  <span className="info-value"><span className="payment-id-tag">{plan?.razorpay_payment_id}</span></span>
                </div>
                <div className="info-item">
                  <span className="info-label">Validity</span>
                  <span className="info-value">{plan?.duration_years} Year</span>
                </div>
              </div>

              <div className="billing-box">
                <div className="bill-row">
                  <span>Base Plan Amount</span>
                  <span>₹{plan?.base_amount}</span>
                </div>
                <div className="bill-row">
                  <span>GST (18%)</span>
                  <span>₹{plan?.gst_amount}</span>
                </div>
                <div className="bill-row total">
                  <span>Total Paid</span>
                  <span>₹{plan?.total_paid}</span>
                </div>
              </div>
            </div>

            <div className="footer-note">
              This is a digital receipt. For any queries, contact ExpertYard support.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GuidexaExpertPlan;