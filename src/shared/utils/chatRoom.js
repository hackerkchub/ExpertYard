export const getChatRoomId = (data = {}) => {
  if (!data || typeof data !== "object") return null;

  return (
    data.chat_room_id ||
    data.chatRoomId ||
    data.roomId ||
    data.room_id ||
    data.session?.chat_room_id ||
    data.session?.chatRoomId ||
    data.session?.roomId ||
    data.session?.room_id ||
    null
  );
};

export const getChatRoomCandidates = (...sources) => {
  const candidates = [];

  const add = (value) => {
    if (value == null || value === "") return;
    const normalized = String(value);
    if (!candidates.includes(normalized)) {
      candidates.push(normalized);
    }
  };

  sources.forEach((source) => {
    if (!source) return;

    if (Array.isArray(source)) {
      source.forEach(add);
      return;
    }

    if (typeof source !== "object") {
      add(source);
      return;
    }

    add(source.chat_room_id);
    add(source.chatRoomId);
    add(source.roomId);
    add(source.room_id);
    add(source.session?.chat_room_id);
    add(source.session?.chatRoomId);
    add(source.session?.roomId);
    add(source.session?.room_id);
  });

  return candidates;
};

export const waitForChatDetailsRetry = (ms = 350) =>
  new Promise((resolve) => setTimeout(resolve, ms));
