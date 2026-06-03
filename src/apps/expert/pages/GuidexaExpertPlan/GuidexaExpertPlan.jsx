import React, { useState, useEffect } from "react";
import { useExpert } from "../../../../shared/context/ExpertContext";
import Loader from "../../../../shared/components/Loader/Loader";
import {
  getExpertCurrentPlanApi
} from "../../../../shared/api/expertapi/expertMembershipPlan.api";


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
        const response = await getExpertCurrentPlanApi(expertId);
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

  // Check if plan is active based on expiry date
  const isPlanActive = () => {
    if (!plan?.expiry_date) return plan?.plan_status === 1;
    return new Date(plan.expiry_date) > new Date();
  };

  if (loading) return <Loader />;

  return (
    <div className="expert-plan-wrapper">
      <style>{`
        .expert-plan-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 80px;
          min-height: auto;
          background: #f4f7fa;
          margin-top: 0;
          padding-top: 10px;
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
          margin-bottom: 0;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .plan-header {
          padding: 25px 30px;
          background: linear-gradient(135deg, #000080 0%, #00004d 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .plan-header h2 {
          margin: 0;
          font-size: 22px;
          color: white;
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
        .status-badge.expired {
          background: #ef4444;
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
        }
        .plan-body {
          padding: 25px 30px;
          padding-bottom: 20px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 25px;
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
          margin-bottom: 0;
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
          padding: 15px 20px;
          font-size: 11px;
          color: #94a3b8;
          border-top: 1px solid #f1f5f7;
          background: #ffffff;
        }
        .description-box {
          margin-bottom: 20px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 10px;
          color: #475569;
          font-size: 14px;
          border: 1px solid #edf2f7;
        }

        /* Mobile Optimization */
        @media (max-width: 480px) {
          .expert-plan-wrapper {
            padding: 10px;
            padding-top: 5px;
          }
          .info-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .plan-header {
            padding: 18px 20px;
          }
          .plan-header h2 {
            font-size: 20px;
          }
          .plan-body {
            padding: 20px;
            padding-bottom: 15px;
          }
          .bill-row.total {
            font-size: 18px;
          }
          .footer-note {
            padding: 12px 20px;
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
              <span className={`status-badge ${!isPlanActive() ? 'expired' : ''}`}>
                {isPlanActive() ? "Active" : "Expired"}
              </span>
            </div>

            <div className="plan-body">
              {/* Plan Description */}
              {plan?.description && (
                <div className="description-box">
                  {plan.description}
                </div>
              )}

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
                  <span className="info-value">{plan?.start_date ? new Date(plan.start_date).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}) : 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Expiry Date</span>
                  <span className="info-value">{plan?.expiry_date ? new Date(plan.expiry_date).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}) : 'N/A'}</span>
                </div>
                
                {/* Days Remaining - Most useful for experts */}
                {plan?.remaining_days !== undefined && (
                  <div className="info-item">
                    <span className="info-label">Days Remaining</span>
                    <span className="info-value" style={{color: plan?.remaining_days < 7 ? '#ef4444' : '#1e293b'}}>
                      {plan?.remaining_days} Days
                    </span>
                  </div>
                )}
                
                <div className="info-item">
                  <span className="info-label">Payment ID</span>
                  <span className="info-value"><span className="payment-id-tag">{plan?.razorpay_payment_id || 'N/A'}</span></span>
                </div>
                <div className="info-item">
                  <span className="info-label">Validity</span>
                  <span className="info-value">{plan?.plan_duration || plan?.duration_years || 'N/A'} Year</span>
                </div>
              </div>

              <div className="billing-box">
                <div className="bill-row">
                  <span>Base Plan Amount</span>
                  <span>₹{plan?.original_amount || plan?.base_amount || '0'}</span>
                </div>
                <div className="bill-row">
                  <span>GST (18%)</span>
                  <span>₹{plan?.gst_amount || '0'}</span>
                </div>
                <div className="bill-row total">
                  <span>Total Paid</span>
                  <span>₹{plan?.total_paid || '0'}</span>
                </div>
              </div>
            </div>

            <div className="footer-note">
              This is a digital receipt. For any queries, contact G9Expert support.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GuidexaExpertPlan;