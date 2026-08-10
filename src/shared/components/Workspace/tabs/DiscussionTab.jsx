import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DiscussionTab({ bookingId, workspace, snapshot, permissions, currentUserRole }) {
  const navigate = useNavigate();
  const [chatMessage, setChatMessage] = useState("");

  const isCompleted =
    workspace?.current_step_key === "COMPLETED" ||
    workspace?.current_step_key === "CANCELLED" ||
    workspace?.booking_status === "completed" ||
    workspace?.booking_status === "cancelled";

  const allowChat = !isCompleted && permissions?.allow_chat !== false;
  const allowVoice = !isCompleted && permissions?.allow_voice_call !== false;
  

  const expertId = snapshot?.expert?.expert_id || workspace?.expert_id;
  const userId = workspace?.user_id;

  const handleVoiceCall = () => {
    if (isCompleted) return alert("Service is completed. Voice call is disabled.");
    if (currentUserRole === "expert") {
      if (!userId) return alert("User ID missing for voice call.");
      navigate(`/expert/voice-call/${userId}`);
    } else {
      if (!expertId) return alert("Expert ID missing for voice call.");
      navigate(`/user/voice-call/${expertId}`);
    }
  };

  const handleVideoCall = () => {
    if (isCompleted) return alert("Service is completed. Video call is disabled.");
    if (currentUserRole === "expert") {
      if (!userId) return alert("User ID missing for video call.");
      navigate(`/expert/video-call/${userId}`);
    } else {
      if (!expertId) return alert("Expert ID missing for video call.");
      navigate(`/user/video-call/${expertId}`);
    }
  };

  const handleOpenChat = () => {
    const returnUrl = currentUserRole === "expert"
      ? `/expert/workspace/${bookingId}`
      : `/user/workspace/${bookingId}`;
    const navState = {
      returnUrl,
      fromWorkspace: true,
      fromService: true,
      bookingId,
    };
    if (currentUserRole === "expert") {
      navigate(`/expert/chat/chat_${userId}_${expertId}`, { state: navState });
    } else {
      navigate(`/user/chat/chat_${userId}_${expertId}`, { state: navState });
    }
  };

  return (
    <div className="tab-discussion">
      <h3 className="tab-panel-title">Workspace Discussion Hub</h3>
      
      {/* Call & Chat Access Control Banner when Completed */}
      {isCompleted ? (
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🔒</span>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.15rem' }}>Service Order Completed & Closed</h4>
          <p style={{ margin: '0 0 1.25rem 0', color: '#64748b', fontSize: '0.9rem', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
            This service order (Booking #{bookingId}) has been completed. Active live chat, voice call, and video call privileges are now disabled. Past chat history remains available in read-only mode below.
          </p>
          <button
            onClick={handleOpenChat}
            style={{ padding: '0.65rem 1.35rem', background: '#475569', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            📜 View Historical Chat Logs (Read-Only)
          </button>
        </div>
      ) : (
        <>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Communication within this active workspace (Booking #{bookingId}) is <strong>100% FREE</strong> and included in your service execution.
          </p>

          {/* Active Call Launch Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {allowVoice && (
              <button
                style={{ padding: '0.65rem 1.25rem', background: '#059669', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                onClick={handleVoiceCall}
              >
                📞 Launch Voice Call (Free)
              </button>
            )}
            {allowChat && (
              <button
                style={{ padding: '0.65rem 1.25rem', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                onClick={handleOpenChat}
              >
                💬 Open Full Chat Console
              </button>
            )}
          </div>

          {/* Embedded Chat Room Console */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', background: '#f8fafc' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>Workspace Active Chat Room</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Type your message to launch chat..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleOpenChat(); }}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <button
                onClick={handleOpenChat}
                style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
              >
                Send Message
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
