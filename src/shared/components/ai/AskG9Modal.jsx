import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  X,
  User,
  Star,
  MapPin,
  Bot,
  RefreshCw,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { sendChatbotMessageApi } from "../../api/userApi/chatbot.api";
import useChatRequest from "../../hooks/useChatRequest";
import { APP_CONFIG } from "../../../config/appConfig";
import "./AskG9Modal.css";

const isDangerousUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== "string") return true;
  const trimmed = urlStr.trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:") ||
    trimmed.startsWith("file:")
  ) {
    return true;
  }
  return false;
};

const getFrontendBaseUrl = () => {
  if (APP_CONFIG && APP_CONFIG.FRONTEND_BASE_URL) {
    return APP_CONFIG.FRONTEND_BASE_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }
  return "https://g9expert.com";
};

const resolveUrl = (rawUrl) => {
  if (!rawUrl || isDangerousUrl(rawUrl)) {
    return { isDangerous: true, fullUrl: null, internalPath: null, isInternal: false };
  }

  const trimmed = rawUrl.trim();
  const baseUrl = getFrontendBaseUrl();

  // Internal relative path starting with /
  if (trimmed.startsWith("/")) {
    return {
      isDangerous: false,
      isInternal: true,
      internalPath: trimmed,
      fullUrl: `${baseUrl}${trimmed}`,
    };
  }

  // Absolute URL
  try {
    const parsed = new URL(trimmed, baseUrl);
    const isSameOrigin = parsed.origin.toLowerCase() === baseUrl.toLowerCase();
    if (isSameOrigin) {
      return {
        isDangerous: false,
        isInternal: true,
        internalPath: parsed.pathname + parsed.search + parsed.hash,
        fullUrl: parsed.href,
      };
    }
    return {
      isDangerous: false,
      isInternal: false,
      internalPath: null,
      fullUrl: parsed.href,
    };
  } catch {
    return { isDangerous: true, fullUrl: null, internalPath: null, isInternal: false };
  }
};

const SAFETY_NOTICE = `⚠️ Important Safety Notice:
G9Expert kabhi bhi kisi individual ke personal mobile number, WhatsApp, UPI ID ya personally shared QR code par direct payment karne ke liye nahi kehta. Agar koi person G9Expert ke naam par aise payment ki demand kare, to payment na karein — ye fraud ho sakta hai. Payments sirf G9Expert ke official platform/payment flow ke through hi karein.`;

const sanitizeAskG9ResponseText = (text, queryText = "") => {
  if (!text || typeof text !== "string") return text;

  const baseUrl = getFrontendBaseUrl();
  const canonicalRegUrl = `${baseUrl}/expert/register`;

  let cleaned = text;

  // Replace any wrong domain expert.g9expert.com variants with canonical expert registration URL
  cleaned = cleaned
    .replace(/https?:\/\/expert\.g9expert\.com\/register\/?/gi, canonicalRegUrl)
    .replace(/expert\.g9expert\.com\/register\/?/gi, canonicalRegUrl)
    .replace(/https?:\/\/expert\.g9expert\.com\/?/gi, canonicalRegUrl)
    .replace(/expert\.g9expert\.com\/?/gi, canonicalRegUrl);

  // Completely remove "No Registration Fees", "registration is free", "koi charges nahi hai", etc.
  cleaned = cleaned
    .replace(/(?:no\s+registration\s+fees?:?\s*)?(?:expert\s+banne\s+ke\s+liye\s+)?koi\s+charges\s+nahi\s+hai[^\n.]*[.\n]?/gi, "")
    .replace(/no\s+registration\s+fees?:?[^\n.]*[.\n]?/gi, "")
    .replace(/registration\s+(?:is\s+)?free[^\n.]*[.\n]?/gi, "")
    .replace(/free\s+of\s+cost\s+registration[^\n.]*[.\n]?/gi, "")
    .replace(/there\s+(?:are\s+)?no\s+fees?\s+to\s+register[^\n.]*[.\n]?/gi, "");

  cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();

  // Determine if the prompt/query or message text is about expert registration or payment/fees
  const combinedCtx = `${queryText} ${cleaned}`.toLowerCase();
  const isExpertRegQuery =
    combinedCtx.includes("expert") &&
    (combinedCtx.includes("register") || combinedCtx.includes("registration") || combinedCtx.includes("banna") || combinedCtx.includes("link"));

  const isExpertRegOrPayment =
    isExpertRegQuery ||
    combinedCtx.includes("payment") ||
    combinedCtx.includes("fee") ||
    combinedCtx.includes("charge");

  // Ensure explicit clickable Expert Registration link is present if user specifically asked for expert registration link
  if (isExpertRegQuery && !cleaned.includes("/expert/register")) {
    cleaned = `${cleaned}\n\n[Expert Registration Link](${canonicalRegUrl})`;
  }

  if (isExpertRegOrPayment && !cleaned.includes("Important Safety Notice")) {
    cleaned = `${cleaned}\n\n${SAFETY_NOTICE}`;
  }

  return cleaned;
};

const DEFAULT_SUGGESTIONS = [
  "GST expert chahiye",
  "Mere orders dikhao",
  "Mere wallet me kitne paise hain?",
  "Mera booking status kya hai?",
  "Income tax return service",
];

export default function AskG9Modal({ isOpen, onClose, initialPrompt = "" }) {
  const navigate = useNavigate();
  const { startChat, ChatPopups } = useChatRequest();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const reqIdRef = useRef(0);
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

  const parseTextWithFormatting = (str, keyPrefix = "") => {
    if (!str) return [];

    const baseUrl = getFrontendBaseUrl();

    // Regex matching:
    // Group 1 & 2: Markdown links [label](url)
    // Group 3: Standalone absolute URLs http://... or https://...
    // Group 4: Standalone internal relative paths starting with /
    const combinedRegex = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s<]+)|(\/(?:expert|user|experts|services|all-services|categories|category|subcategory|service-details|orders|bookings|inquiries|workspace|auth|profile|call-chat|reels|master-services)[a-zA-Z0-9\-\/_?=#]*)/g;

    const elements = [];
    let lastIndex = 0;
    let match;

    const parseBoldInText = (text, prefix) => {
      if (!text) return [];
      const boldParts = text.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={`${prefix}-b-${pIdx}`} style={{ fontWeight: 700 }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
    };

    while ((match = combinedRegex.exec(str)) !== null) {
      const matchIndex = match.index;

      if (matchIndex > lastIndex) {
        const plainText = str.substring(lastIndex, matchIndex);
        elements.push(...parseBoldInText(plainText, `${keyPrefix}-t-${lastIndex}`));
      }

      let linkText = "";
      let rawTargetUrl = "";
      let isRawRelativePath = false;
      let trailingPunctuation = "";

      if (match[1] !== undefined && match[2] !== undefined) {
        linkText = match[1];
        rawTargetUrl = match[2];
      } else if (match[3] !== undefined) {
        rawTargetUrl = match[3];
        const punctMatch = rawTargetUrl.match(/[.,;:!?]+$/);
        if (punctMatch) {
          trailingPunctuation = punctMatch[0];
          rawTargetUrl = rawTargetUrl.slice(0, -trailingPunctuation.length);
        }
        linkText = rawTargetUrl;
      } else if (match[4] !== undefined) {
        rawTargetUrl = match[4];
        isRawRelativePath = true;
        const punctMatch = rawTargetUrl.match(/[.,;:!?]+$/);
        if (punctMatch) {
          trailingPunctuation = punctMatch[0];
          rawTargetUrl = rawTargetUrl.slice(0, -trailingPunctuation.length);
        }
        linkText = `${baseUrl}${rawTargetUrl}`;
      }

      const resolved = resolveUrl(rawTargetUrl);

      if (resolved.isDangerous) {
        const displayText = linkText || rawTargetUrl;
        elements.push(...parseBoldInText(displayText + trailingPunctuation, `${keyPrefix}-d-${matchIndex}`));
      } else {
        const fullHref = resolved.fullUrl;
        const isInternal = resolved.isInternal;
        const internalPath = resolved.internalPath;

        elements.push(
          <a
            key={`${keyPrefix}-link-${matchIndex}`}
            href={fullHref}
            target={isInternal ? "_self" : "_blank"}
            rel={isInternal ? undefined : "noopener noreferrer"}
            onClick={(e) => {
              if (isInternal && internalPath) {
                e.preventDefault();
                onClose();
                navigate(internalPath);
              }
            }}
            style={{
              color: "#2563eb",
              textDecoration: "underline",
              fontWeight: 600,
              wordBreak: "break-word",
              cursor: "pointer",
            }}
          >
            {parseBoldInText(linkText, `${keyPrefix}-lt-${matchIndex}`)}
          </a>
        );

        if (trailingPunctuation) {
          elements.push(trailingPunctuation);
        }
      }

      lastIndex = combinedRegex.lastIndex;
    }

    if (lastIndex < str.length) {
      const remainingText = str.substring(lastIndex);
      elements.push(...parseBoldInText(remainingText, `${keyPrefix}-t-${lastIndex}`));
    }

    return elements;
  };

  const renderFormattedText = (text) => {
    if (!text) return null;

    const lines = text.split("\n");

    return lines.map((line, lIdx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={lIdx} style={{ height: "6px" }} />;

      const isNumberedStep = /^\d+\.\s+/.test(trimmed);
      const isBullet = /^[\bullet\-\*]\s+/.test(trimmed);

      if (isNumberedStep) {
        const stepMatch = trimmed.match(/^(\d+\.)\s+(.*)/);
        const stepNum = stepMatch ? stepMatch[1] : "";
        const stepContent = stepMatch ? stepMatch[2] : trimmed;
        return (
          <div key={lIdx} style={{ display: "flex", gap: "8px", marginTop: "6px", marginBottom: "4px" }}>
            <span style={{ fontWeight: 800, color: "#000080", flexShrink: 0 }}>{stepNum}</span>
            <div style={{ flex: 1 }}>{parseTextWithFormatting(stepContent, `line-${lIdx}`)}</div>
          </div>
        );
      }

      if (isBullet) {
        const bulletContent = trimmed.replace(/^[\bullet\-\*]\s+/, "");
        return (
          <div key={lIdx} style={{ display: "flex", gap: "8px", marginTop: "4px", marginBottom: "4px" }}>
            <span style={{ color: "#000080", flexShrink: 0, fontWeight: 700 }}>•</span>
            <div style={{ flex: 1 }}>{parseTextWithFormatting(bulletContent, `line-${lIdx}`)}</div>
          </div>
        );
      }

      return (
        <div key={lIdx} style={{ marginTop: lIdx > 0 ? "4px" : 0 }}>
          {parseTextWithFormatting(trimmed, `line-${lIdx}`)}
        </div>
      );
    });
  };

  const handleSendPrompt = async (textToSend) => {
    const queryText = (textToSend || prompt).trim();
    if (!queryText || loading) return;

    const currentReqId = ++reqIdRef.current;
    const userMsg = { role: "user", text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);

    try {
      console.log(`[GIA_ASSISTANT][FE_REQUEST] requestId=${currentReqId} conversationId="${conversationId || "none"}" message="${queryText}"`);
      const response = await sendChatbotMessageApi({
        message: queryText,
        conversation_id: conversationId,
      });

      if (currentReqId !== reqIdRef.current) return;

      const resData = response?.data || response;

      if (response?.success && resData) {
        if (resData.conversation_id) {
          setConversationId(resData.conversation_id);
        }

        const rawMsgText = resData.message || "Main aapki query process nahi kar pa rahi hoon.";
        const msgText = sanitizeAskG9ResponseText(rawMsgText, queryText);
        const isAuthRequired = resData.requires_auth || (typeof msgText === "string" && msgText.toLowerCase().includes("please log in"));

        const aiMsg = {
          role: "assistant",
          text: msgText,
          experts: resData.experts || [],
          services: resData.services || [],
          actionLabel: isAuthRequired ? "Log In to Account" : null,
          actionUrl: isAuthRequired ? "/user/auth" : null,
        };

        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const rawMsg = response?.message || "Main abhi aapki request process nahi kar pa rahi hoon. Kripya thodi der baad try karein.";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: sanitizeAskG9ResponseText(rawMsg, queryText),
          },
        ]);
      }
    } catch (err) {
      if (currentReqId !== reqIdRef.current) return;
      console.error("[GIA_ASSISTANT][MODAL] Chatbot Error:", err);
      const isAuthError = err?.response?.status === 401 || err?.response?.status === 403;
      const rawErrMsg = isAuthError
        ? "Please log in to your account to view your private details."
        : "Main abhi aapki request process nahi kar pa rahi hoon. Please thodi der baad try karein.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: sanitizeAskG9ResponseText(rawErrMsg, queryText),
          actionLabel: isAuthError ? "Log In to Account" : null,
          actionUrl: isAuthError ? "/user/auth" : null,
        },
      ]);
    } finally {
      if (currentReqId === reqIdRef.current) {
        setLoading(false);
      }
    }
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
          handleSendPrompt(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error("[ASK_G9][MODAL] Voice Input Error:", err);
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
    return "";
  };

  const handleActionClick = (action, expert = null) => {
    const slug = action.expert_slug || getExpertSlug(expert);
    if (slug) {
      onClose();
      navigate(`/user/experts/${slug}`);
      return;
    }
    if (action.url) {
      onClose();
      navigate(action.url);
    }
  };

  const getThinkingState = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.text || prompt || "";
    const q = lastUserMsg.toLowerCase().trim();

    if (q.includes("expert") || q.includes("ca") || q.includes("lawyer") || q.includes("doctor")) {
      return { title: "Gia is thinking...", subtitle: "" };
    }
    if (q.includes("service") || q.includes("pan") || q.includes("gst") || q.includes("itr") || q.includes("tax")) {
      return { title: "Finding matching services…", subtitle: "Checking G9Expert catalog" };
    }
    if (q.includes("order") || q.includes("booking")) {
      return { title: "Checking your order status…", subtitle: "Verifying booking details" };
    }
    if (q.includes("wallet") || q.includes("balance")) {
      return { title: "Checking your wallet…", subtitle: "Retrieving latest balance" };
    }
    if (q.includes("workspace") || q.includes("document")) {
      return { title: "Checking workspace…", subtitle: "Retrieving project files & timeline" };
    }
    return { title: "Gia is thinking...", subtitle: "" };
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

        {/* Header */}
        <div
          style={{
            padding: "12px 16px",
            background: "linear-gradient(135deg, #000080 0%, #1e3a8a 100%)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            minHeight: "56px",
            gap: "10px",
            boxShadow: "0 2px 8px rgba(0, 0, 128, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Sparkles size={18} color="#fbbf24" />
            </div>
            <div style={{ minWidth: 0, flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                Ask G9
              </h3>
              <span
                style={{
                  fontSize: "0.68rem",
                  background: "#fbbf24",
                  color: "#000080",
                  padding: "2px 7px",
                  borderRadius: "8px",
                  fontWeight: 800,
                  letterSpacing: "0.4px",
                  whiteSpace: "nowrap",
                }}
              >
                AI Assistance : Gia
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Assistant"
            style={{
              background: "rgba(255, 255, 255, 0.18)",
              border: "none",
              color: "#ffffff",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              transition: "background 0.2s ease",
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
                How can I help you with G9Expert?
              </h4>
              <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "0.85rem" }}>
                Ask in English, Hindi, or Hinglish about service booking, orders, expert registration, or consultations.
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
                    background: msg.role === "user" ? "#000080" : msg.result_mode === "CLARIFICATION" || msg.needs_clarification ? "#fffbeb" : "#ffffff",
                    color: msg.role === "user" ? "#ffffff" : "#0f172a",
                    border: msg.role === "user" ? "none" : msg.result_mode === "CLARIFICATION" || msg.needs_clarification ? "1px solid #fde68a" : "1px solid #e2e8f0",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    boxShadow: msg.role === "user" ? "none" : "0 2px 4px rgba(0,0,0,0.03)",
                  }}
                >
                  <div>{renderFormattedText(msg.text)}</div>

                  {/* Action Button for Platform Navigation */}
                  {msg.actionLabel && msg.actionUrl && (
                    <div style={{ marginTop: "12px" }}>
                      <button
                        onClick={() => {
                          onClose();
                          navigate(msg.actionUrl);
                        }}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, #000080 0%, #1e3a8a 100%)",
                          color: "#ffffff",
                          border: "none",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          boxShadow: "0 2px 6px rgba(0,0,128,0.2)",
                        }}
                      >
                        <span>{msg.actionLabel}</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}

                  {/* Clarifying & Suggestion Chips */}
                  {((msg.suggestions && msg.suggestions.length > 0) || (msg.clarifying_options && msg.clarifying_options.length > 0)) && (
                    <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {(msg.suggestions?.length > 0 ? msg.suggestions : msg.clarifying_options).map((opt, oIdx) => {
                        const optLabel = typeof opt === "string" ? opt : opt.label || opt.query;
                        const optQuery = typeof opt === "string" ? opt : opt.query || opt.label;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSendPrompt(optQuery)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "20px",
                              border: msg.result_mode === "CLARIFICATION" || msg.needs_clarification ? "1px solid #d97706" : "1px solid #2563eb",
                              background: msg.result_mode === "CLARIFICATION" || msg.needs_clarification ? "#fef3c7" : "#eff6ff",
                              color: msg.result_mode === "CLARIFICATION" || msg.needs_clarification ? "#b45309" : "#2563eb",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            💡 {optLabel}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Matching Expert Cards */}
                  {msg.experts && msg.experts.length > 0 && (
                    <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {(msg.showAllExperts ? msg.experts : msg.experts.slice(0, 2)).map((exp, eIdx) => {
                        const canonicalSlug = exp.slug || exp.expert_slug || getExpertSlug(exp);
                        return (
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

                            {/* Primary View Profile Action ONLY */}
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
                              <button
                                onClick={() => handleActionClick({ type: "navigate", expert_slug: canonicalSlug }, exp)}
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
                      {!msg.showAllExperts && msg.experts.length > 2 && (
                        <button
                          onClick={() => {
                            setMessages(prev => prev.map((m, idx) => idx === index ? { ...m, showAllExperts: true } : m));
                          }}
                          style={{
                            padding: "8px",
                            borderRadius: "10px",
                            border: "1px dashed #2563eb",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          View {msg.experts.length - 2} more experts
                        </button>
                      )}
                    </div>
                  )}

                  {/* Matching Service Cards */}
                  {msg.services && msg.services.length > 0 && (
                    <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {(msg.showAllServices ? msg.services : msg.services.slice(0, 3)).map((srv, sIdx) => {
                        const srvSlug = srv.slug || srv.id || "";
                        const srvUrl = srvSlug ? `/user/service-details/${srvSlug}` : `/user/all-services`;
                        const priceVal = srv.starting_price || srv.price || srv.min_price;

                        return (
                          <div
                            key={sIdx}
                            style={{
                              border: "1px solid #cbd5e1",
                              borderRadius: "12px",
                              padding: "12px",
                              background: "#ffffff",
                              color: "#0f172a",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h5 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 700, color: "#0f172a" }}>
                                {srv.title || srv.name}
                              </h5>
                              <p style={{ margin: "3px 0 0 0", fontSize: "0.76rem", color: "#64748b" }}>
                                {srv.category_name ? `${srv.category_name} ` : ""}
                                {priceVal > 0 ? `• Starting ₹${priceVal}` : ""}
                                {srv.delivery_time_days ? ` • ${srv.delivery_time_days} days` : ""}
                              </p>
                            </div>
                            <button
                              onClick={() => handleActionClick({ type: "navigate", url: srvUrl })}
                              style={{
                                padding: "7px 14px",
                                borderRadius: "8px",
                                background: "linear-gradient(135deg, #000080 0%, #1e3a8a 100%)",
                                color: "#ffffff",
                                border: "none",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}
                            >
                              View Service
                            </button>
                          </div>
                        );
                      })}
                      {!msg.showAllServices && msg.services.length > 3 && (
                        <button
                          onClick={() => {
                            setMessages(prev => prev.map((m, idx) => idx === index ? { ...m, showAllServices: true } : m));
                          }}
                          style={{
                            padding: "8px",
                            borderRadius: "10px",
                            border: "1px dashed #2563eb",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          View {msg.services.length - 3} more services
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div
              style={{
                margin: "10px 0",
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
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #000080 0%, #1e3a8a 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Sparkles size={16} color="#ffffff" className="animate-spin" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#1e3a8a", fontWeight: 700 }}>
                  {getThinkingState().title}
                </p>
                {getThinkingState().subtitle ? (
                  <p style={{ margin: "2px 0 0 0", fontSize: "0.74rem", color: "#64748b" }}>
                    {getThinkingState().subtitle}
                  </p>
                ) : null}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar Footer */}
        <div className="ask-g9-input-footer">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="ask-g9-input-form"
          >
            <input
              type="text"
              className="ask-g9-input-field"
              placeholder="Ask G9 about booking, orders, registration, consultations..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />

            <button
              type="button"
              onClick={startVoiceInput}
              disabled={loading}
              className={`ask-g9-mic-btn ${isListening ? "is-listening" : ""}`}
              title="Voice Input"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="ask-g9-send-btn"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
              <span>{loading ? "Searching..." : "Ask"}</span>
            </button>
          </form>
        </div>
      </div>
      <ChatPopups />
    </div>
  );
}
