export const saveActiveChatSession = (sessionInfo) => { localStorage.setItem('active_chat_session', JSON.stringify(sessionInfo)); window.dispatchEvent(new Event('active_chat_session_changed')); };

export const clearActiveChatSession = () => { localStorage.removeItem('active_chat_session'); window.dispatchEvent(new Event('active_chat_session_changed')); };

export const getActiveChatSession = () => { try { const data = localStorage.getItem('active_chat_session'); return data ? JSON.parse(data) : null; } catch (e) { return null; } };
