import React from "react";
import "./OrderProgressTimeline.css";
import {
  FiCheckCircle,
  FiFolder,
  FiMessageSquare,
  FiPhone,
  FiStar,
  FiUploadCloud,
  FiXCircle
} from "react-icons/fi";

/**
 * Reusable Status Progress Component for G9Expert Order Workspace
 * Semantic Color Scheme:
 *  - Initial Stage (Order Placed): G9Expert Purple (●)
 *  - Active Workflow Stages: Amber (🟡)
 *  - Final Success Completion: Green (🟢) - ONLY when status is COMPLETED
 *  - Upcoming Stages: Neutral Grey (○)
 *  - Error / Cancelled: Red (🔴) - ONLY when status is CANCELLED or failed
 */
export default function OrderProgressTimeline({
  workspace,
  snapshot,
  documents = [],
  currentUserRole = "user",
  onActionClick
}) {
  if (!workspace) return null;

  const currentStepKey = String(workspace?.current_step_key || "SUBMITTED").toUpperCase();
  const bookingStatus = String(workspace?.booking_status || workspace?.status || "").toUpperCase();
  const expStatusReq = workspace?.expert_status_request;
  const expertName = snapshot?.expert?.expert_name || workspace?.expert_name || "Assigned Expert";

  // Check state completion & cancellation
  const isCompleted = currentStepKey === "COMPLETED" || bookingStatus === "COMPLETED";
  const isCancelled = currentStepKey === "CANCELLED" || bookingStatus === "CANCELLED";
  const canContactExpert = !isCompleted && !isCancelled;

  // Check for Action Required condition (Rejected documents or pending client action)
  const rejectedDocs = (documents || []).filter((d) => String(d.status).toUpperCase() === "REJECTED");
  const hasRejectedDocs = rejectedDocs.length > 0;
  const isActionRequired = (hasRejectedDocs || expStatusReq === "CANCELLED_REQUESTED" || workspace?.action_required === true) && !isCompleted && !isCancelled;

  // Standard step definitions & semantic descriptions
  const stepPipeline = [
    {
      key: "SUBMITTED",
      title: "Order Placed",
      completedDesc: "Payment & booking confirmed",
      currentDesc: "Your booking has been placed and payment confirmed.",
      upcomingDesc: "Order placement & booking confirmation"
    },
    {
      key: "DOCUMENTS",
      title: "Documents Intake",
      completedDesc: "Required documents received & verified",
      currentDesc: hasRejectedDocs
        ? `Action Required: ${rejectedDocs.length} document(s) need re-upload.`
        : "Required documents received and ready for expert review.",
      upcomingDesc: "Uploading mandatory identity & service files"
    },
    {
      key: "EXPERT_ASSIGNED",
      title: "Expert Assigned",
      completedDesc: `${expertName} accepted & assigned to your order`,
      currentDesc: `${expertName} has been assigned to your order.`,
      upcomingDesc: "Matching with verified subject-matter expert"
    },
    {
      key: "IN_REVIEW",
      title: "Expert Working",
      completedDesc: "Service execution & drafting completed",
      currentDesc: `Your expert (${expertName}) is currently preparing your service.`,
      upcomingDesc: "Expert execution & milestone preparation"
    },
    {
      key: "DELIVERED",
      title: "Service Delivered",
      completedDesc: "Final deliverable files submitted for review",
      currentDesc: "🎉 Your final deliverable files are ready for review.",
      upcomingDesc: "Final files will appear here once ready"
    },
    {
      key: "COMPLETED",
      title: "Order Completed",
      completedDesc: "✓ Service successfully completed & rating submitted",
      currentDesc: "Review and accept final delivery to complete your order.",
      upcomingDesc: "Review & accept final delivery to complete order"
    }
  ];

  // Helper to determine active step index in pipeline
  const getStepIndex = (key) => {
    switch (key) {
      case "SUBMITTED":
        return 0;
      case "DOCUMENTS":
        return 1;
      case "EXPERT_ASSIGNED":
        return 2;
      case "IN_REVIEW":
        return 3;
      case "DELIVERED":
        return 4;
      case "COMPLETED":
        return 5;
      case "CANCELLED":
        return -1;
      default:
        return 0;
    }
  };

  const activeIndex = isActionRequired
    ? 1 // Highlight Documents/Action step
    : getStepIndex(currentStepKey);

  // Helper for Banner Details
  const getBannerDetails = () => {
    if (isCancelled) {
      return {
        class: "state-cancelled",
        label: "❌ ORDER CANCELLED",
        title: "Order Cancelled",
        desc: "This service order has been cancelled and refunded per policy.",
        badgeClass: "opt-badge-red",
        badgeText: "CANCELLED"
      };
    }
    if (isActionRequired) {
      return {
        class: "state-action-required",
        label: "⚠️ ACTION REQUIRED FROM YOU",
        title: "Action Required",
        desc: hasRejectedDocs
          ? `Your expert needs you to re-upload ${rejectedDocs.length} rejected document(s).`
          : "Your attention is required to proceed with service fulfillment.",
        badgeClass: "opt-badge-amber",
        badgeText: "ACTION NEEDED"
      };
    }
    if (currentStepKey === "DELIVERED") {
      return {
        class: "state-delivered",
        label: "🎉 SERVICE DELIVERED (PENDING ACCEPTANCE)",
        title: "Service Ready for Review",
        desc: "Your expert has uploaded the final deliverables. Please review and accept to complete the order.",
        badgeClass: "opt-badge-amber",
        badgeText: "READY FOR REVIEW"
      };
    }
    if (isCompleted) {
      return {
        class: "state-completed",
        label: "✅ ORDER COMPLETED",
        title: "Order Completed",
        desc: "Your service has been successfully executed and closed. Thank you!",
        badgeClass: "opt-badge-green",
        badgeText: "COMPLETED"
      };
    }
    if (currentStepKey === "EXPERT_ASSIGNED") {
      return {
        class: "",
        label: "🟡 CURRENT ORDER STATUS",
        title: `Expert Assigned (${expertName})`,
        desc: `${expertName} is reviewing your requirements and starting work.`,
        badgeClass: "opt-badge-amber",
        badgeText: "EXPERT ASSIGNED"
      };
    }
    if (currentStepKey === "IN_REVIEW") {
      return {
        class: "",
        label: "🟡 CURRENT ORDER STATUS",
        title: "Expert Working",
        desc: `Your expert (${expertName}) is currently preparing your service.`,
        badgeClass: "opt-badge-amber",
        badgeText: "EXPERT WORKING"
      };
    }
    return {
      class: "state-initial",
      label: "● CURRENT ORDER STATUS",
      title: "Order Placed & Confirmed",
      desc: "Your booking and payment are confirmed. Expert assignment is active.",
      badgeClass: "opt-badge-purple",
      badgeText: "ORDER PLACED"
    };
  };

  const banner = getBannerDetails();

  return (
    <div className="opt-container">
      
      {/* 1. CURRENT STATUS BANNER */}
      <div className={`opt-status-banner ${banner.class}`}>
        <div>
          <div className="opt-banner-header-label">
            {banner.label}
          </div>
          <h3 className="opt-banner-title">
            {banner.title}
          </h3>
          <p className="opt-banner-desc">
            {banner.desc}
          </p>
        </div>

        <div>
          <span className={`opt-badge-pill ${banner.badgeClass}`}>
            {banner.badgeText}
          </span>
        </div>
      </div>

      {/* 2. COMPLETE ORDER STATUS JOURNEY */}
      <div className="opt-timeline-wrapper">
        <div className="opt-timeline-title">
          <span>Order Progress Journey</span>
          <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>
            Booking #{workspace?.booking_id || workspace?.id}
          </span>
        </div>

        <div className="opt-timeline-list">
          {stepPipeline.map((step, idx) => {
            const isInitialStep = idx === 0;
            const isFinalStep = idx === stepPipeline.length - 1;

            const isStepCompleted = isCompleted ? true : activeIndex > idx;
            const isStepCurrent = !isCompleted && !isCancelled && activeIndex === idx;
            const isStepUpcoming = !isCompleted && !isCancelled && activeIndex < idx;

            // Semantic Color Classes
            let stepColorClass = "is-upcoming";
            if (isInitialStep) {
              stepColorClass = "is-initial-step";
            } else if (isFinalStep && isCompleted) {
              stepColorClass = "is-completed-step";
            } else if (isStepCurrent || isStepCompleted) {
              stepColorClass = "is-amber-step";
            }

            return (
              <div
                key={step.key}
                className={`opt-step-item ${stepColorClass} ${isStepCurrent ? "is-current" : ""}`}
              >
                {/* Connector Line */}
                {idx < stepPipeline.length - 1 && (
                  <div className="opt-step-connector" />
                )}

                {/* Step Circle Indicator */}
                <div className="opt-step-indicator">
                  {isInitialStep ? (
                    "●"
                  ) : isFinalStep && isCompleted ? (
                    "🟢"
                  ) : isStepCurrent || isStepCompleted ? (
                    "🟡"
                  ) : (
                    "○"
                  )}
                </div>

                {/* Step Content Body */}
                <div className="opt-step-content">
                  <div className="opt-step-header">
                    <h4 className="opt-step-title">
                      {step.title}
                    </h4>

                    {isStepCurrent && (
                      <span className={`opt-stage-badge ${isInitialStep ? "opt-badge-purple-soft" : "opt-badge-amber-soft"}`}>
                        {isActionRequired ? "⚠️ Action Required" : "● Current Stage"}
                      </span>
                    )}

                    {isFinalStep && isCompleted && (
                      <span className="opt-stage-badge opt-badge-green-soft">
                        ✓ Completed
                      </span>
                    )}
                  </div>

                  {/* Subtext Description */}
                  <p className="opt-step-subtext">
                    {isCompleted
                      ? step.completedDesc
                      : isStepCurrent
                      ? step.currentDesc
                      : step.upcomingDesc}
                  </p>

                  {/* Action Cards for Current Step */}
                  {isStepCurrent && (
                    <div className="opt-step-card">
                      {isActionRequired ? (
                        <div>
                          <strong style={{ color: "#b45309", fontSize: "0.82rem", display: "block", marginBottom: 4 }}>
                            ⚠️ Action Required from Client
                          </strong>
                          <span style={{ fontSize: "0.78rem", color: "#78350f" }}>
                            {hasRejectedDocs
                              ? `Please re-upload your valid ${rejectedDocs[0]?.file_name || "document"} to resume service.`
                              : "Please complete required information."}
                          </span>

                          <div className="opt-action-bar">
                            {onActionClick && (
                              <button
                                type="button"
                                className="opt-btn-action opt-btn-orange"
                                onClick={() => onActionClick("upload_document")}
                              >
                                <FiUploadCloud size={13} /> Upload Document Now
                              </button>
                            )}
                          </div>
                        </div>
                      ) : step.key === "IN_REVIEW" || step.key === "EXPERT_ASSIGNED" ? (
                        <div className="opt-action-bar">
                          {canContactExpert && onActionClick && (
                            <button
                              type="button"
                              className="opt-btn-action opt-btn-amber"
                              onClick={() => onActionClick("chat")}
                            >
                              <FiMessageSquare size={13} /> Chat with Expert
                            </button>
                          )}
                          {canContactExpert && onActionClick && (
                            <button
                              type="button"
                              className="opt-btn-action opt-btn-outline"
                              onClick={() => onActionClick("call")}
                            >
                              <FiPhone size={13} /> Call Expert
                            </button>
                          )}
                        </div>
                      ) : step.key === "DELIVERED" ? (
                        <div className="opt-action-bar">
                          {onActionClick && (
                            <button
                              type="button"
                              className="opt-btn-action opt-btn-green"
                              onClick={() => onActionClick("view_delivery")}
                            >
                              🎁 View & Accept Delivery
                            </button>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Cancellation Step Representation */}
                  {isCancelled && isFinalStep && (
                    <div className="opt-step-card" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                      <strong style={{ color: "#b91c1c", fontSize: "0.82rem" }}>
                        ❌ Order Cancelled
                      </strong>
                      <span style={{ fontSize: "0.78rem", color: "#991b1b" }}>
                        This order has been cancelled and closed. Active communication options are disabled.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
