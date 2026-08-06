import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  getAllExpertsApi,
  getExpertAccessSettingsApi,
  updateExpertAccessSettingsApi,
} from "../../../shared/api/admin/expert.api";
import "./SubscribedExpertsAccessPage.css";

const isFalsy = (val) =>
  val === false || val === 0 || val === "0" || val === "false";

export default function SubscribedExpertsAccessPage() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchSubscribedExperts = async () => {
    try {
      setLoading(true);
      const res = await getAllExpertsApi();
      const rawList = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.experts)
        ? res.data.experts
        : [];

      // Filter experts who have an active subscription or paid plan
      const subscribed = rawList.filter((e) => {
        const sub = String(e.subscription_status || e.subscriptionStatus || "").toLowerCase();
        const accessLvl = String(e.access_level || e.accessLevel || "").toLowerCase();
        const isPaid = e.is_paid === true || e.isPaidExpert === true || e.is_subscribed === 1;
        return isPaid || sub === "active" || ["paid_basic", "paid_growth"].includes(accessLvl) || Boolean(e.current_plan_id || e.plan_id);
      });

      const listToFetch = subscribed.length > 0 ? subscribed : rawList;

      // Fetch precise access settings for each expert in parallel
      const enriched = await Promise.all(
        listToFetch.map(async (exp) => {
          const expId = exp.id || exp.expert_id;
          try {
            const accRes = await getExpertAccessSettingsApi(expId);
            const accData = accRes.data?.data?.effective_access || accRes.data?.data || {};
            const adminSett = accRes.data?.data?.admin_settings || accData.admin_settings || accData;
            return {
              ...exp,
              admin_settings: adminSett,
              effective_access: accData,
            };
          } catch {
            return exp;
          }
        })
      );

      setExperts(enriched);
    } catch (err) {
      console.error("Failed to load subscribed experts:", err);
      toast.error("Failed to load subscribed experts list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribedExperts();
  }, []);

  const handleToggleRestriction = async (expertId, field, currentValue) => {
    const nextValue = !currentValue;
    console.log(`👉 [SUBSCRIBED ACCESS TOGGLE] Expert #${expertId} '${field}' toggling from ${currentValue} to ${nextValue}`);

    let payload = {};
    if (field === "can_view_contact" || field === "leads_enabled") {
      payload = {
        can_view_contact: nextValue,
        leads_enabled: nextValue,
        show_user_contact_in_expert_emails: nextValue,
      };
    } else {
      payload = { [field]: nextValue };
    }

    try {
      setUpdatingId(expertId);

      // Optimistic update
      setExperts((prev) =>
        prev.map((e) => {
          const idMatch = (e.id || e.expert_id) === expertId;
          if (idMatch) {
            const updatedAdmin = { ...(e.admin_settings || {}), ...payload };
            const updatedEff = { ...(e.effective_access || {}), ...payload };
            return {
              ...e,
              ...payload,
              admin_settings: updatedAdmin,
              effective_access: updatedEff,
            };
          }
          return e;
        })
      );

      const res = await updateExpertAccessSettingsApi(expertId, payload);
      const serverAccess = res.data?.data?.effective_access || res.data?.data || {};
      const serverAdmin = res.data?.data?.admin_settings || serverAccess.admin_settings || serverAccess;

      setExperts((prev) =>
        prev.map((e) => {
          const idMatch = (e.id || e.expert_id) === expertId;
          if (idMatch) {
            return {
              ...e,
              admin_settings: { ...(e.admin_settings || {}), ...serverAdmin, ...payload },
              effective_access: { ...(e.effective_access || {}), ...serverAccess, ...payload },
            };
          }
          return e;
        })
      );

      toast.success(
        field === "can_view_contact" || field === "leads_enabled"
          ? nextValue
            ? "Lead Contact Info (Phone/Email) UNMASKED for expert"
            : "Lead Contact Info (Phone/Email) MASKED for expert"
          : `${field.replace("_", " ")} updated successfully`
      );
    } catch (err) {
      console.error("Toggle error:", err);
      toast.error("Failed to update access restriction");
      fetchSubscribedExperts();
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredExperts = experts.filter((e) => {
    const query = searchTerm.toLowerCase();
    return (
      String(e.name || "").toLowerCase().includes(query) ||
      String(e.email || "").toLowerCase().includes(query) ||
      String(e.phone || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="subscribed-access-page">
      <header className="subscribed-access-header">
        <h1>Subscribed Experts Access Controls</h1>
        <p>
          Dedicated restrictions panel for experts who have purchased a subscription plan. Control lead contact info masking, earnings dashboard access, and profile editing.
        </p>
      </header>

      <section className="subscribed-access-stats">
        <div className="subscribed-stat-card">
          <span>Subscribed Experts</span>
          <strong>{experts.length}</strong>
        </div>
        <div className="subscribed-stat-card">
          <span>Contact Info Masked</span>
          <strong>
            {
              experts.filter((e) => {
                const adm = e.admin_settings || {};
                const eff = e.effective_access || {};
                return (
                  isFalsy(adm.can_view_contact) ||
                  isFalsy(adm.leads_enabled) ||
                  isFalsy(adm.show_user_contact_in_expert_emails) ||
                  isFalsy(eff.can_view_contact) ||
                  isFalsy(eff.leads_enabled)
                );
              }).length
            }
          </strong>
        </div>
        <div className="subscribed-stat-card">
          <span>Earnings Disabled</span>
          <strong>
            {
              experts.filter((e) => {
                const adm = e.admin_settings || {};
                const eff = e.effective_access || {};
                return isFalsy(adm.earnings_enabled) || isFalsy(eff.earnings_enabled);
              }).length
            }
          </strong>
        </div>
      </section>

      <div className="subscribed-access-toolbar">
        <input
          type="text"
          placeholder="Search by expert name, email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="subscribed-search-input"
        />
      </div>

      <div className="subscribed-table-container">
        {loading ? (
          <div className="subscribed-empty">Loading subscribed experts...</div>
        ) : filteredExperts.length === 0 ? (
          <div className="subscribed-empty">No subscribed experts found matching search.</div>
        ) : (
          <table className="subscribed-table">
            <thead>
              <tr>
                <th>Subscribed Expert</th>
                <th>Plan Status</th>
                <th>Lead Contact Info (Phone/Email)</th>
                <th>Earnings Dashboard View</th>
                <th>Profile Edit Ability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExperts.map((e) => {
                const expertId = e.id || e.expert_id;
                const adm = e.admin_settings || {};
                const eff = e.effective_access || {};

                // Contact visibility check: if explicitly false in admin_settings or effective_access, then FALSE
                const contactDisabled =
                  isFalsy(adm.can_view_contact) ||
                  isFalsy(adm.leads_enabled) ||
                  isFalsy(adm.show_user_contact_in_expert_emails) ||
                  isFalsy(eff.can_view_contact) ||
                  isFalsy(eff.leads_enabled) ||
                  isFalsy(e.can_view_contact) ||
                  isFalsy(e.leads_enabled);

                const isContactVisible = !contactDisabled;

                // Earnings check
                const earningsDisabled = isFalsy(adm.earnings_enabled) || isFalsy(eff.earnings_enabled) || isFalsy(e.earnings_enabled);
                const isEarningsEnabled = !earningsDisabled;

                // Profile Edit check
                const profileEditDisabled = isFalsy(adm.profile_edit_enabled) || isFalsy(eff.profile_edit_enabled) || isFalsy(e.profile_edit_enabled);
                const isProfileEditEnabled = !profileEditDisabled;

                return (
                  <tr key={expertId}>
                    <td>
                      <div className="subscribed-expert-cell">
                        <img
                          src={e.profile_photo || e.image_url || "/placeholder-avatar.png"}
                          alt={e.name}
                          className="subscribed-avatar"
                          onError={(img) => {
                            img.target.onerror = null;
                            img.target.src = "https://via.placeholder.com/80?text=Expert";
                          }}
                        />
                        <div className="subscribed-expert-info">
                          <strong>{e.name || "Expert #" + expertId}</strong>
                          <small>{e.email || e.phone || "No contact info"}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="subscribed-plan-badge">
                        {e.plan_name || e.subscription_status || "Active Plan"}
                      </span>
                    </td>

                    {/* Toggle 1: Lead Contact Details */}
                    <td>
                      <div className="toggle-cell">
                        <button
                          type="button"
                          onClick={() => handleToggleRestriction(expertId, "can_view_contact", isContactVisible)}
                          className={`toggle-switch ${isContactVisible ? "on" : "off-red"}`}
                          disabled={updatingId === expertId}
                        >
                          <span className="toggle-handle" />
                        </button>
                        <span className={`toggle-status-label ${isContactVisible ? "visible" : "hidden"}`}>
                          {isContactVisible ? "Unmasked (Visible)" : "Masked (••••••••••)"}
                        </span>
                      </div>
                    </td>

                    {/* Toggle 2: Earnings Access */}
                    <td>
                      <div className="toggle-cell">
                        <button
                          type="button"
                          onClick={() => handleToggleRestriction(expertId, "earnings_enabled", isEarningsEnabled)}
                          className={`toggle-switch ${isEarningsEnabled ? "on" : "off-red"}`}
                          disabled={updatingId === expertId}
                        >
                          <span className="toggle-handle" />
                        </button>
                        <span className={`toggle-status-label ${isEarningsEnabled ? "visible" : "hidden"}`}>
                          {isEarningsEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </td>

                    {/* Toggle 3: Profile Edit Access */}
                    <td>
                      <div className="toggle-cell">
                        <button
                          type="button"
                          onClick={() => handleToggleRestriction(expertId, "profile_edit_enabled", isProfileEditEnabled)}
                          className={`toggle-switch ${isProfileEditEnabled ? "on" : "off-red"}`}
                          disabled={updatingId === expertId}
                        >
                          <span className="toggle-handle" />
                        </button>
                        <span className={`toggle-status-label ${isProfileEditEnabled ? "visible" : "hidden"}`}>
                          {isProfileEditEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <Link to={`/admin/expert/${expertId}`} className="subscribed-action-btn">
                        <FiEdit /> All Permissions
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
