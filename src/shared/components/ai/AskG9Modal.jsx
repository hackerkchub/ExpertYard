import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  X,
  User,
  Phone,
  Video,
  MessageSquare,
  Briefcase,
  Star,
  MapPin,
  Bot,
  RefreshCw,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { askG9Api } from "../../api/userApi/ai.api";

const DEFAULT_SUGGESTIONS = [
  "Indore me property dispute ke liye lawyer chahiye",
  "GST Registration karwana hai",
  "Top rated CA for tax filing in Bhopal",
  "Doctor for consultation on video call",
];

export default function AskG9Modal({ isOpen, onClose, initialPrompt = "" }) {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialPrompt && (!messages.length || initialPrompt !== prompt)) {
        handleSendPrompt(initialPrompt);
      }
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendPrompt = async (textToSend) => {
    const queryText = (textToSend || prompt).trim();
    if (!queryText || loading) return;

    const userMsg = { role: "user", text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);

    try {
      const data = await askG9Api(queryText, conversationId);

      if (data?.success) {
        if (data.conversation_id) {
          setConversationId(data.conversation_id);
        }

        const aiMsg = {
          role: "assistant",
          text: data.message || "Here are your search results:",
          intent: data.intent,
          needs_clarification: data.needs_clarification,
          clarifying_question: data.clarifying_question,
          clarifying_options: data.clarifying_options || [],
          experts: data.experts || [],
          services: data.services || [],
          categories: data.categories || [],
        };

        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data?.message || "Sorry, I couldn't process that. Please try again.",
          },
        ]);
      }
    } catch (err) {
      console.error("Ask G9 API Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong while communicating with Ask G9 AI. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in your browser. Please type your query.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN"; // Supports Hindi / Hinglish / English
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setPrompt(transcript);
          handleSendPrompt(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error("Speech Recognition Error:", err);
      setIsListening(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.url) {
      onClose();
      navigate(action.url);
    }
  };

  return (
    <div
      className="ask-g9-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="ask-g9-modal-sheet"
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "680px",
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ask-g9-modal-drag-handle" />
        {/* Modal Header */}
        <div
          style={{
            padding: "16px 20px",
            background: "linear-gradient(135deg, #000080 0%, #1e3a8a 100%)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={20} color="#fbbf24" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>
                Ask G9 <span style={{ fontSize: "0.75rem", background: "#fbbf24", color: "#000080", padding: "2px 6px", borderRadius: "10px", fontWeight: 800, marginLeft: "6px" }}>AI</span>
              </h3>
              <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.85 }}>
                Intelligent Search & Service Discovery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "none",
              color: "#ffffff",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Conversation Body */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            background: "#f8fafc",
          }}
        >
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#eff6ff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                <Bot size={32} color="#2563eb" />
              </div>
              <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "1.1rem" }}>
                What are you looking for today?
              </h4>
              <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "0.85rem" }}>
                Ask in English, Hindi, or Hinglish for experts, services, and location consultations.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {DEFAULT_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendPrompt(sug)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      background: "#ffffff",
                      color: "#334155",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span>"{sug}"</span>
                    <ChevronRight size={16} color="#94a3b8" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "12px 16px",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.role === "user" ? "#000080" : "#ffffff",
                    color: msg.role === "user" ? "#ffffff" : "#0f172a",
                    border: msg.role === "user" ? "none" : "1px solid #e2e8f0",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    boxShadow: msg.role === "user" ? "none" : "0 2px 4px rgba(0,0,0,0.03)",
                  }}
                >
                  {msg.text}

                  {/* Clarifying Chips */}
                  {msg.clarifying_options && msg.clarifying_options.length > 0 && (
                    <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {msg.clarifying_options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleSendPrompt(opt)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            border: "1px solid #2563eb",
                            background: "#eff6ff",
                            color: "#2563eb",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          + {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Matching Expert Cards */}
                  {msg.experts && msg.experts.length > 0 && (
                    <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {msg.experts.map((exp, eIdx) => (
                        <div
                          key={eIdx}
                          style={{
                            border: "1px solid #cbd5e1",
                            borderRadius: "12px",
                            padding: "12px",
                            background: "#ffffff",
                            color: "#0f172a",
                          }}
                        >
                          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            {exp.profile_photo ? (
                              <img
                                src={exp.profile_photo}
                                alt={exp.name}
                                style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  borderRadius: "50%",
                                  background: "#e2e8f0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <User size={24} color="#64748b" />
                              </div>
                            )}

                            <div style={{ flex: 1 }}>
                              <h5 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>{exp.name}</h5>
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

                          {/* Action Buttons */}
                          {exp.actions && exp.actions.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px", paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
                              {exp.actions.map((act, aIdx) => (
                                <button
                                  key={aIdx}
                                  onClick={() => handleActionClick(act)}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    border: "none",
                                    background: act.variant === "primary" ? "#000080" : act.variant === "success" ? "#16a34a" : act.variant === "accent" ? "#9333ea" : "#f1f5f9",
                                    color: act.variant === "secondary" ? "#334155" : "#ffffff",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  {act.type === "chat" && <MessageSquare size={12} />}
                                  {act.type === "call" && <Phone size={12} />}
                                  {act.type === "video_call" && <Video size={12} />}
                                  {act.type === "navigate" && <User size={12} />}
                                  {act.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matching Service Cards */}
                  {msg.services && msg.services.length > 0 && (
                    <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {msg.services.map((srv, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            border: "1px solid #cbd5e1",
                            borderRadius: "10px",
                            padding: "10px 12px",
                            background: "#ffffff",
                            color: "#0f172a",
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
                          {srv.actions && srv.actions[0] && (
                            <button
                              onClick={() => handleActionClick(srv.actions[0])}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "8px",
                                background: "#000080",
                                color: "#ffffff",
                                border: "none",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Book Now
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "0.85rem" }}>
              <RefreshCw size={16} className="animate-spin" />
              <span>Ask G9 AI is searching G9Expert database...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar Footer */}
        <div style={{ padding: "12px 16px", background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. Indore me lawyer, GST registration)..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />

            <button
              type="button"
              onClick={startVoiceInput}
              style={{
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                background: isListening ? "#fee2e2" : "#f8fafc",
                color: isListening ? "#dc2626" : "#64748b",
                cursor: "pointer",
              }}
              title="Voice Input"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "none",
                background: "#000080",
                color: "#ffffff",
                fontWeight: 700,
                cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Send size={16} />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
