import React, { useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  FiCheckCircle,
  FiMessageCircle,
  FiClock,
  FiEye,
  FiLock,
  FiMessageSquare,
  FiPhoneCall,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  acceptExpertLeadApi,
  addExpertLeadNoteApi,
  getExpertCategoryInterestApi,
  getExpertLeadStatsApi,
  getExpertLeadTimelineApi,
  getExpertLeadsApi,
  getExpertProfileVisitsApi,
  updateExpertLeadStatusApi,
} from "../../../../shared/api/expertapi/leads.api";
import "./ExpertLeads.css";

const tabs = [
  ["all", "All"],
  ["inquiries", "Inquiries"],
  ["profile_visits", "Profile Visits"],
  ["category_interest", "Category Interest"],
  ["chat_attempts", "Chat Attempts"],
  ["call_attempts", "Call Attempts"],
  ["missed_calls", "Missed Calls"],
  ["failed_calls", "Failed Calls"],
  ["converted", "Converted"],
  ["closed", "Closed"],
];

const statLabels = [
  ["today_category_views", "Today Category Views"],
  ["expert_listing_views", "Expert Listing Views"],
  ["profile_visits", "Profile Visits"],
  ["new_inquiries", "New Inquiries"],
  ["chat_attempts", "Chat Attempts"],
  ["call_attempts", "Call Attempts"],
  ["missed_calls", "Missed Calls"],
  ["failed_calls", "Failed Calls"],
  ["converted_leads", "Converted Leads"],
];

const sourceLabels = {
  need_help_form: "New Inquiry",
  chat_attempt: "Chat Attempt",
  call_attempt: "Call Attempt",
  missed_call: "Missed Call Lead",
  call_declined: "Call Declined Lead",
  call_failed: "Failed Call Lead",
  call_not_answered: "Call Not Answered Lead",
};

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");

const normalizeStats = (payload = {}) => ({
  today_category_views: payload.today_category_views ?? payload.todayCategoryViews ?? 0,
  expert_listing_views: payload.expert_listing_views ?? payload.expertListingViews ?? 0,
  profile_visits: payload.profile_visits ?? payload.profileVisits ?? 0,
  new_inquiries: payload.new_inquiries ?? payload.newInquiries ?? 0,
  chat_attempts: payload.chat_attempts ?? payload.chatAttempts ?? 0,
  call_attempts: payload.call_attempts ?? payload.callAttempts ?? 0,
  missed_calls: payload.missed_calls ?? payload.missedCalls ?? 0,
  failed_calls: payload.failed_calls ?? payload.failedCalls ?? 0,
  converted_leads: payload.converted_leads ?? payload.convertedLeads ?? 0,
});

const isDev = import.meta.env?.MODE !== "production";

const getStatsPayload = (response) => {
  const body = response?.data || {};
  return body.data || body.stats || body;
};

const getArrayPayload = (response) => {
  const body = response?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.leads)) return body.leads;
  if (Array.isArray(body?.items)) return body.items;
  return [];
};

export default function ExpertLeads() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({});
  const [leads, setLeads] = useState([]);
  const [profileVisits, setProfileVisits] = useState([]);
  const [categoryInterest, setCategoryInterest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [access, setAccess] = useState(null);

  const isLimited = access ? !Boolean(access.can_view_contact) : false;

  const goUpgrade = () => navigate("/expert/g9-plan");

  const loadStats = async () => {
    try {
      const res = await getExpertLeadStatsApi();
      if (isDev) {
        console.debug("[expert-leads] stats response", res.data);
      }
      setStats(normalizeStats(getStatsPayload(res)));
    } catch (error) {
      if (isDev) {
        console.error("Lead stats failed:", error);
      }
    }
  };

  const loadTab = async () => {
    setLoading(true);
    try {
      if (activeTab === "profile_visits") {
        const res = await getExpertProfileVisitsApi();
        const rows = getArrayPayload(res);
        if (isDev) console.debug("[expert-leads] profile visits count", rows.length);
        setProfileVisits(rows);
      } else if (activeTab === "category_interest") {
        const res = await getExpertCategoryInterestApi();
        const rows = getArrayPayload(res);
        if (isDev) console.debug("[expert-leads] category interest count", rows.length);
        setCategoryInterest(rows);
      } else {
        const res = await getExpertLeadsApi(activeTab);
        if (res.data?.access) setAccess(res.data.access);
        const rows = getArrayPayload(res);
        if (isDev) console.debug("[expert-leads] lead list count", { tab: activeTab, count: rows.length });
        setLeads(rows);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadTab().catch((error) => {
      console.error("Lead tab failed:", error);
      setLoading(false);
    });
  }, [activeTab]);

  useEffect(() => {
    let cancelled = false;
    const interval = window.setInterval(() => {
      if (cancelled) return;
      loadStats();
      loadTab().catch((error) => console.error("Lead refresh failed:", error));
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [activeTab]);

  const openLead = async (lead) => {
    try {
      const detail = lead?.id ? await getExpertLeadTimelineApi(lead.id) : null;
      setSelectedLead(lead);
      setTimeline(detail?.data?.data?.timeline || []);
      setNotes(detail?.data?.data?.notes || []);
    } catch (error) {
      if (isDev) console.error("Lead timeline failed:", error);
      toast.error("Unable to load lead details.");
    }
  };

  const refreshCurrent = async () => {
    await Promise.all([loadStats(), loadTab()]);
  };

  const acceptLead = async (leadId) => {
    if (isLimited) {
      toast.error("Upgrade required to accept and contact this lead.");
      goUpgrade();
      return;
    }
    try {
      const res = await acceptExpertLeadApi(leadId);
      if (res.data?.data) setSelectedLead(res.data.data);
      toast.success("Lead accepted.");
      await refreshCurrent();
      if (selectedLead?.id === leadId) await openLead(res.data?.data || selectedLead);
    } catch (error) {
      if (isDev) console.error("Accept lead failed:", error);
      toast.error(error.response?.data?.message || "Unable to accept lead.");
    }
  };

  const updateStatus = async (leadId, status) => {
    if (isLimited) {
      toast.error("Upgrade required to manage this lead.");
      goUpgrade();
      return;
    }
    try {
      const res = await updateExpertLeadStatusApi(leadId, status);
      if (res.data?.data) setSelectedLead(res.data.data);
      toast.success(`Lead marked ${status}.`);
      await refreshCurrent();
      if (selectedLead?.id === leadId) await openLead(res.data?.data || selectedLead);
    } catch (error) {
      if (isDev) console.error("Lead status update failed:", error);
      toast.error(error.response?.data?.message || "Unable to update lead.");
    }
  };

  const addNote = async () => {
    if (!selectedLead || !noteText.trim()) return;
    if (isLimited) {
      toast.error("Upgrade required to add lead notes.");
      goUpgrade();
      return;
    }
    try {
      await addExpertLeadNoteApi(selectedLead.id, noteText.trim());
      setNoteText("");
      toast.success("Note added.");
      await openLead(selectedLead);
    } catch (error) {
      if (isDev) console.error("Add lead note failed:", error);
      toast.error(error.response?.data?.message || "Unable to add note.");
    }
  };

  const openLeadChat = (lead) => {
    const roomId = lead.room_id || lead.chat_room_id;
    if (isLimited || lead.is_locked) {
      toast.error("Upgrade required to chat with this user.");
      goUpgrade();
      return;
    }
    if (!roomId) {
      toast.error("No active chat room is linked to this lead yet.");
      return;
    }
    navigate(`/expert/chat/${roomId}`, { state: { lead_id: lead.id, user_id: lead.user_id } });
  };

  const openLeadCall = (lead) => {
    const callId = lead.call_id || lead.voice_call_id;
    if (isLimited || lead.is_locked) {
      toast.error("Upgrade required to call this user.");
      goUpgrade();
      return;
    }
    if (!callId) {
      toast.error("No active G9 call is linked to this lead yet.");
      return;
    }
    navigate(`/expert/voice-call/${callId}`, { state: { lead_id: lead.id, user_id: lead.user_id } });
  };

  const visibleLeads = useMemo(() => leads, [leads]);

  return (
    <div className="expert-leads">
      <Toaster position="top-right" />
      <header className="expert-leads__header">
        <div>
          <h1>Leads</h1>
          <p>Track inquiries, profile interest, chat attempts and call attempts.</p>
        </div>
      </header>

      {isLimited && (
        <section className="expert-leads__locked-banner">
          <FiLock />
          <div>
            <strong>Upgrade Required</strong>
            <p>This lead is available for your category. Activate your G9 Expert plan to view contact details, chat/call users, create services, and start earning.</p>
          </div>
          <button type="button" onClick={goUpgrade}>View Plans</button>
        </section>
      )}

      <section className="expert-leads__stats">
        {statLabels.map(([key, label]) => (
          <div className="expert-leads__stat" key={key}>
            <span>{label}</span>
            <strong>{Number(stats[key] || 0)}</strong>
          </div>
        ))}
      </section>

      <nav className="expert-leads__tabs">
        {tabs.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={activeTab === key ? "is-active" : ""}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {loading ? (
        <div className="expert-leads__empty">Loading...</div>
      ) : activeTab === "category_interest" ? (
        <section className="expert-leads__list">
          {categoryInterest.length === 0 ? (
            <div className="expert-leads__empty">No category interest yet.</div>
          ) : (
            categoryInterest.map((item) => (
              <article className="expert-leads__card" key={`${item.event_type}-${item.source_page}`}>
                <span className="expert-leads__badge">Category Interest</span>
                <h3>{Number(item.total || 0)} users viewed your category</h3>
                <p>{item.source_page || "Unknown source"} - {item.event_type}</p>
              </article>
            ))
          )}
        </section>
      ) : activeTab === "profile_visits" ? (
        <section className="expert-leads__list">
          {profileVisits.length === 0 ? (
            <div className="expert-leads__empty">No profile visits yet.</div>
          ) : (
            profileVisits.map((visit) => (
              <article className="expert-leads__card" key={visit.id}>
                <span className="expert-leads__badge">Profile Visit</span>
                <h3>{visit.user_name || "A user"} from {visit.city || "unknown city"} viewed your profile</h3>
                <p>{visit.area || ""} {visit.source_page ? `- ${visit.source_page}` : ""}</p>
                <small>{visit.device_type || "device"} - {formatDate(visit.created_at)}</small>
              </article>
            ))
          )}
        </section>
      ) : (
        <section className="expert-leads__list">
          {visibleLeads.length === 0 ? (
            <div className="expert-leads__empty">No leads in this tab.</div>
          ) : (
            visibleLeads.map((lead) => (
              <article className="expert-leads__card" key={lead.id}>
                <div className="expert-leads__card-head">
                  <span className={`expert-leads__badge ${lead.priority === "hot" ? "is-hot" : ""}`}>
                    {sourceLabels[lead.source] || "Lead"}
                  </span>
                  <span className="expert-leads__status">{lead.status}</span>
                </div>
                <h3>{lead.user_name || "User"} {lead.city ? `- ${lead.city}` : ""}</h3>
                {lead.requirement && <p>{lead.requirement}</p>}
                <div className="expert-leads__meta">
                  <span>{lead.category_name || "Category"}</span>
                  <span>{formatDate(lead.created_at)}</span>
                </div>
                <div className="expert-leads__contact">
                  <span>{lead.user_phone || (lead.is_locked ? "Phone locked" : "Phone hidden")}</span>
                  <span>{lead.user_email || (lead.is_locked ? "Email locked" : "Email hidden")}</span>
                </div>
                {lead.is_locked && <p className="expert-leads__lock-reason">{lead.lock_reason}</p>}
                <div className="expert-leads__actions">
                  <button type="button" onClick={() => openLead(lead)}><FiEye /> View</button>
                  {lead.is_locked ? (
                    <button type="button" onClick={goUpgrade}><FiLock /> Upgrade to Contact</button>
                  ) : lead.status !== "accepted" && (
                    <button type="button" onClick={() => acceptLead(lead.id)}><FiCheckCircle /> Accept</button>
                  )}
                  {!lead.is_locked && (
                    <>
                      <button type="button" onClick={() => openLeadChat(lead)}><FiMessageCircle /> Chat Now</button>
                      <button type="button" onClick={() => openLeadCall(lead)}><FiPhoneCall /> Call via G9</button>
                      <button type="button" onClick={() => updateStatus(lead.id, "contacted")}><FiPhoneCall /> Contacted</button>
                      <button type="button" onClick={() => updateStatus(lead.id, "converted")}><FiCheckCircle /> Converted</button>
                      <button type="button" onClick={() => updateStatus(lead.id, "rejected")}><FiX /> Reject</button>
                      <button type="button" onClick={() => updateStatus(lead.id, "closed")}><FiX /> Close</button>
                    </>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      )}

      {selectedLead && (
        <div className="expert-leads__modal" role="dialog" aria-modal="true">
          <div className="expert-leads__sheet">
            <button className="expert-leads__close" type="button" onClick={() => setSelectedLead(null)}>
              <FiX />
            </button>
            <span className="expert-leads__badge">{sourceLabels[selectedLead.source] || "Lead"}</span>
            <h2>{selectedLead.user_name || "User"}</h2>
            <div className="expert-leads__detail-grid">
              <span>Phone</span><strong>{selectedLead.user_phone || "Hidden by consent rules"}</strong>
              <span>Email</span><strong>{selectedLead.user_email || "Hidden by consent rules"}</strong>
              <span>City</span><strong>{selectedLead.city || "-"}</strong>
              <span>Area</span><strong>{selectedLead.area || "-"}</strong>
              <span>Preferred mode</span><strong>{selectedLead.preferred_mode || "any"}</strong>
              <span>Status</span><strong>{selectedLead.status}</strong>
              <span>Assignment</span><strong>{selectedLead.assignment_status || "-"}</strong>
              <span>Priority</span><strong>{selectedLead.priority}</strong>
              <span>Source page</span><strong>{selectedLead.source_page || "-"}</strong>
            </div>
            {selectedLead.requirement && <p className="expert-leads__requirement">{selectedLead.requirement}</p>}

            <section className="expert-leads__timeline">
              <h3><FiClock /> Activity timeline</h3>
              {timeline.map((item) => (
                <div className="expert-leads__timeline-item" key={item.id}>
                  <strong>{item.description || item.action}</strong>
                  <span>{formatDate(item.created_at)}</span>
                </div>
              ))}
            </section>

            <section className="expert-leads__notes">
              <h3><FiMessageSquare /> Notes</h3>
              {notes.map((note) => (
                <p key={note.id}>{note.note} <small>{formatDate(note.created_at)}</small></p>
              ))}
              <div className="expert-leads__note-form">
                <input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add follow-up note" />
                <button type="button" onClick={addNote}><FiPlus /> Add</button>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
