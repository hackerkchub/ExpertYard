import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  User,
  Star,
  MapPin,
  Bot,
  RefreshCw,
  X,
  ChevronRight,
  HelpCircle,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { askG9Api, trackAIClickApi } from "../../api/userApi/ai.api";
import useChatRequest from "../../hooks/useChatRequest";
import { buildUserSearchPath } from "../../../apps/user/components/search/searchUtils";

const DEFAULT_SUGGESTIONS = [
  "Indore me property dispute lawyer",
  "GST Registration karwana hai",
  "Doctor video call consultation",
  "PAN card banwana hai",
];

export default function AskG9HomeWidget({ onOpenModal }) {
  const navigate = useNavigate();
  const { startChat, ChatPopups } = useChatRequest();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [showAllExperts, setShowAllExperts] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  // Out-of-order request tracking
  const reqIdRef = useRef(0);
  const widgetRef = useRef(null);

  const handleSubmitPrompt = (textToSend) => {
    const queryText = (textToSend || prompt).trim();
    if (!queryText) return;
    setPrompt("");
    navigate(buildUserSearchPath(queryText));
  };


  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in your browser. Please type your query.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0]?.transcript;
        if (transcript) {
          setPrompt(transcript);
          handleSubmitPrompt(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error("[ASK_G9][WIDGET] Voice Input Error:", err);
      setIsListening(false);
    }
  };

  const getExpertSlug = (expert) => {
    if (expert?.slug) return expert.slug;
    if (expert?.expert_slug) return expert.expert_slug;
    if (expert?.name) {
      return expert.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
    }
    return expert?.expert_id || expert?.id || "";
  };

  const handleActionClick = (action, expertId = null, serviceId = null, rankPos = null, expertObj = null) => {
    if (aiResult?.message_id) {
      trackAIClickApi(aiResult.message_id, expertId, serviceId, rankPos).catch(() => {});
    }

    if (expertObj || action.type === "navigate" || action.expert_slug) {
      const slug = action.expert_slug || getExpertSlug(expertObj);
      if (slug) {
        navigate(`/user/experts/${slug}`);
        return;
      }
    }

    if (action.url) {
      navigate(action.url);
    }
  };

  const clearResult = () => {
    reqIdRef.current++;
    setAiResult(null);
    setPrompt("");
  };

  return (
    <section
      ref={widgetRef}
      className="ask-g9-home-widget"
      style={{
        margin: "18px 0",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        border: "2px solid #e2e8f0",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 128, 0.08)",
        padding: "20px",
        position: "relative",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #000080 0%, #1e3a8a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,128,0.2)",
            }}
          >
            <Sparkles size={22} color="#fbbf24" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#000080" }}>
              Ask G9 <span style={{ fontSize: "0.75rem", background: "#fbbf24", color: "#000080", padding: "2px 6px", borderRadius: "10px", fontWeight: 800, marginLeft: "4px" }}>AI</span>
            </h3>
          </div>
        </div>

        {aiResult && (
          <button
            onClick={clearResult}
            style={{
              background: "#f1f5f9",
              border: "none",
              color: "#64748b",
              borderRadius: "20px",
              padding: "4px 12px",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <X size={14} /> Clear Results
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitPrompt();
        }}
        className="ask-g9-form-row"
        style={{ display: "flex", gap: "8px", alignItems: "center", position: "relative" }}
      >
        <input
          type="text"
          className="ask-g9-input-field"
          placeholder="Ask G9 AI (e.g. 'Indore me property lawyer', 'GST registration')..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            padding: "14px 18px",
            borderRadius: "14px",
            border: "1.5px solid #cbd5e1",
            fontSize: "0.95rem",
            outline: "none",
            background: "#ffffff",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
          }}
        />

        <button
          type="button"
          className="ask-g9-voice-btn"
          onClick={startVoiceInput}
          disabled={loading}
          style={{
            padding: "13px 14px",
            borderRadius: "14px",
            border: "1.5px solid #cbd5e1",
            background: isListening ? "#fee2e2" : "#f8fafc",
            color: isListening ? "#dc2626" : "#64748b",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Voice Search"
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <button
          type="submit"
          className="ask-g9-submit-btn"
          disabled={loading || !prompt.trim()}
          style={{
            padding: "14px 22px",
            borderRadius: "14px",
            border: "none",
            background: "linear-gradient(135deg, #000080 0%, #1e3a8a 100%)",
            color: "#ffffff",
            fontWeight: 700,
            cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 4px 12px rgba(0,0,128,0.25)",
            opacity: loading || !prompt.trim() ? 0.75 : 1,
          }}
        >
          {loading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
          <span>{loading ? "Searching..." : "Ask AI"}</span>
        </button>
      </form>

      {/* Initial Suggestions */}
      {!aiResult && !loading && (
        <div className="ask-g9-chip-container" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", display: "flex", alignItems: "center", alignSelf: "center", flexShrink: 0 }}>
            Try asking:
          </span>
          {DEFAULT_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              className="ask-g9-chip-btn"
              onClick={() => {
                setPrompt(sug);
                handleSubmitPrompt(sug);
              }}
              style={{
                padding: "5px 12px",
                borderRadius: "16px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#334155",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Compact Professional Loading UI */}
      {loading && (
        <div
          style={{
            margin: "14px 0",
            padding: "12px 16px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)",
            border: "1px solid #bfdbfe",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 128, 0.04)",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #000080 0%, #1e3a8a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Sparkles size={18} color="#ffffff" className="animate-spin" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#1e3a8a", fontWeight: 700 }}>
              Finding the right experts…
            </p>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.76rem", color: "#64748b" }}>
              Analyzing requirement & checking verified profiles
            </p>
          </div>
        </div>
      )}

      {/* AI RESULT CONTAINER */}
      {aiResult && !loading && (
        <div
          style={{
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1.5px dashed #cbd5e1",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          {/* AI Message & Dynamic Clarification / Suggestion Chips */}
          <div
            style={{
              background: aiResult.result_mode === "CLARIFICATION" || aiResult.needs_clarification ? "#fffbeb" : "#eff6ff",
              borderRadius: "14px",
              padding: "14px 16px",
              marginBottom: "14px",
              border: aiResult.result_mode === "CLARIFICATION" || aiResult.needs_clarification ? "1px solid #fde68a" : "1px solid #bfdbfe",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              {aiResult.result_mode === "CLARIFICATION" || aiResult.needs_clarification ? (
                <HelpCircle size={18} color="#d97706" style={{ marginTop: "2px", flexShrink: 0 }} />
              ) : (
                <Bot size={18} color="#2563eb" style={{ marginTop: "2px", flexShrink: 0 }} />
              )}
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#334155", lineHeight: 1.5, fontWeight: 500 }}>
                {aiResult.message}
              </p>
            </div>

            {/* Dynamic Grounded Category / Suggestion Chips */}
            {((aiResult.suggestions && aiResult.suggestions.length > 0) || (aiResult.clarifying_options && aiResult.clarifying_options.length > 0)) && (
              <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(aiResult.suggestions.length > 0 ? aiResult.suggestions : aiResult.clarifying_options).map((opt, oIdx) => {
                  const optLabel = typeof opt === "string" ? opt : opt.label || opt.query;
                  const optQuery = typeof opt === "string" ? opt : opt.query || opt.label;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => {
                        setPrompt(optQuery);
                        handleSubmitPrompt(optQuery);
                      }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "20px",
                        border: aiResult.result_mode === "CLARIFICATION" || aiResult.needs_clarification ? "1px solid #d97706" : "1px solid #2563eb",
                        background: aiResult.result_mode === "CLARIFICATION" || aiResult.needs_clarification ? "#fef3c7" : "#eff6ff",
                        color: aiResult.result_mode === "CLARIFICATION" || aiResult.needs_clarification ? "#b45309" : "#1d4ed8",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <span>💡</span> {optLabel}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Expert Cards Grid */}
          {aiResult.experts && aiResult.experts.length > 0 && (
            <div>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "0.95rem", color: "#0f172a", fontWeight: 800 }}>
                Matched Verified Experts ({aiResult.experts.length})
              </h4>
              <div className="ask-g9-expert-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                {(showAllExperts ? aiResult.experts : aiResult.experts.slice(0, 2)).map((exp, eIdx) => {
                  const canonicalSlug = exp.slug || exp.expert_slug || getExpertSlug(exp);
                  return (
                    <div
                      key={eIdx}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        padding: "14px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        {exp.profile_photo ? (
                          <img
                            src={exp.profile_photo}
                            alt={exp.name}
                            style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "46px",
                              height: "46px",
                              borderRadius: "50%",
                              background: "#e2e8f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <User size={22} color="#64748b" />
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h5 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {exp.name}
                          </h5>
                          <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                            {exp.position} {exp.category_name ? `• ${exp.category_name}` : ""}
                          </p>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "4px", fontSize: "0.75rem" }}>
                            {exp.avg_rating > 0 && (
                              <span style={{ color: "#d97706", fontWeight: 700, display: "flex", alignItems: "center", gap: "2px" }}>
                                <Star size={12} fill="#d97706" /> {exp.avg_rating}
                              </span>
                            )}
                            {exp.location && (
                              <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "2px" }}>
                                <MapPin size={12} /> {exp.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* View Profile Primary Action ONLY */}
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
                        <button
                          onClick={() => handleActionClick({ type: "navigate", expert_slug: canonicalSlug }, exp.expert_id || exp.id, null, eIdx + 1, exp)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "10px",
                            border: "none",
                            background: "linear-gradient(135deg, #000080 0%, #1e3a8a 100%)",
                            color: "#ffffff",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 2px 6px rgba(0,0,128,0.2)",
                          }}
                        >
                          <span>View Profile</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!showAllExperts && aiResult.experts.length > 2 && (
                <button
                  onClick={() => setShowAllExperts(true)}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    padding: "8px",
                    borderRadius: "10px",
                    border: "1px dashed #2563eb",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  View {aiResult.experts.length - 2} more experts
                </button>
              )}
            </div>
          )}

          {/* Service Cards Grid */}
          {aiResult.services && aiResult.services.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "0.95rem", color: "#0f172a", fontWeight: 800 }}>
                Matched Services ({aiResult.services.length})
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
                {(showAllServices ? aiResult.services : aiResult.services.slice(0, 2)).map((srv, sIdx) => {
                  const srvSlug = srv.slug || "";
                  const srvUrl = srvSlug ? `/user/service-details/${srvSlug}` : `/user/all-services`;
                  return (
                    <div
                      key={sIdx}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <h5 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700 }}>{srv.title}</h5>
                        <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                          {srv.category_name} {srv.price ? `• ₹${srv.price}` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => handleActionClick({ type: "navigate", url: srvUrl }, null, srv.id, sIdx + 1)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "8px",
                          background: "#000080",
                          color: "#ffffff",
                          border: "none",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Book Service
                      </button>
                    </div>
                  );
                })}
              </div>
              {!showAllServices && aiResult.services.length > 2 && (
                <button
                  onClick={() => setShowAllServices(true)}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    padding: "8px",
                    borderRadius: "10px",
                    border: "1px dashed #2563eb",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  View {aiResult.services.length - 2} more services
                </button>
              )}
            </div>
          )}
        </div>
      )}
      <ChatPopups />
    </section>
  );
}
