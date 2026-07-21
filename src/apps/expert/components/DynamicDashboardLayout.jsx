import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageSquare, Video, Check, X, ShieldAlert, Sparkles, ChevronRight } from "lucide-react";

export default function DynamicDashboardLayout({
  activeRequest = null, // e.g. { id: '123', type: 'voice_call', senderName: 'Rahul Sharma', title: 'Astrology Consultation', targetUrl: '/expert/voice-call/123' }
  onAccept,
  onReject,
  serviceCards = [],
}) {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Services", count: 6 },
    {
      id: "call",
      label: "Calls",
      count: activeRequest?.type === "voice_call" ? 1 : 0,
      hasAlert: activeRequest?.type === "voice_call",
    },
    {
      id: "video",
      label: "Video Calls",
      count: activeRequest?.type === "video_call" ? 1 : 0,
      hasAlert: activeRequest?.type === "video_call",
    },
    {
      id: "chat",
      label: "Chats",
      count: activeRequest?.type === "chat_request" ? 1 : 0,
      hasAlert: activeRequest?.type === "chat_request",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      
      {/* 🚀 1. RAPIDO-STYLE DYNAMIC TOP REQUEST BANNER */}
      <AnimatePresence mode="wait">
        {activeRequest && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-indigo-500/30 overflow-hidden">
              
              {/* Background Pulse Glow (Rapido Style) */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Left: Avatar & Request Info */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  
                  {/* Pulsing Avatar Ring */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                    <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg ring-4 ring-emerald-500/30">
                      {activeRequest.senderName?.[0] || "U"}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                        <Sparkles className="w-3 h-3" /> Live Request
                      </span>
                      <span className="text-xs text-slate-400">Just now</span>
                    </div>

                    <h3 className="text-lg font-bold text-white truncate mt-0.5">
                      {activeRequest.senderName || "Incoming Customer"}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {activeRequest.type === "video_call"
                        ? "Wants to start a Video Consultation"
                        : activeRequest.type === "chat_request"
                        ? "Wants to start a Live Chat Session"
                        : "Wants to start an Audio Call"}
                    </p>
                  </div>
                </div>

                {/* Right: Accept / Decline Rapido Buttons */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button
                    onClick={() => onReject && onReject(activeRequest)}
                    className="flex-1 md:flex-initial min-h-[48px] px-6 rounded-xl bg-slate-800/80 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/50 text-red-400 hover:text-red-300 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <X className="w-4 h-4" /> Decline
                  </button>

                  <button
                    onClick={() => onAccept && onAccept(activeRequest)}
                    className="flex-1 md:flex-initial min-h-[48px] px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
                  >
                    <Check className="w-5 h-5 stroke-[3]" /> Accept Now
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔔 2. DYNAMIC HIGHLIGHTED TABS BAR */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const hasAlert = tab.hasAlert;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative min-h-[44px] px-5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 ${
                hasAlert
                  ? "bg-red-500/10 text-red-600 border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse"
                  : isActive
                  ? "bg-indigo-900 text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                  hasAlert
                    ? "bg-red-600 text-white"
                    : isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>

              {/* Pulsing Red Dot for Urgent Activity */}
              {hasAlert && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 📦 3. RESPONSIVE SERVICE CARDS GRID (AUTOMATICALLY RESIZES / SHIFTS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(serviceCards.length > 0 ? serviceCards : defaultServiceCards).map((card) => (
          <motion.div
            layout
            key={card.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {card.category}
                </span>
                <span className="text-base font-extrabold text-indigo-950">
                  ₹{card.price}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 mb-1">
                {card.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                {card.description}
              </p>
            </div>

            <button className="mt-4 w-full min-h-[40px] bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform">
              <span>View Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

// Fallback demo cards
const defaultServiceCards = [
  { id: 1, title: "1-on-1 Audio Consultation", category: "Voice Call", price: "499", description: "Direct 15 min audio guidance on expert inquiries." },
  { id: 2, title: "Video Strategy Session", category: "Video Call", price: "999", description: "Face-to-face video consultation for in-depth resolution." },
  { id: 3, title: "Instant Chat Consultation", category: "Chat", price: "299", description: "Real-time message exchange with document sharing." },
  { id: 4, title: "Digital Package Review", category: "Package", price: "1499", description: "Comprehensive analysis and strategy report." },
  { id: 5, title: "Career Guidance Course", category: "Course", price: "1999", description: "Self-paced video modules with direct mentorship." },
  { id: 6, title: "Custom Priority Advisory", category: "Custom", price: "2499", description: "Dedicated priority support & emergency consultation." },
];
