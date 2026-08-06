import { socket } from "../../api/socket";

class PresenceService {
  constructor() {
    this.userId = null;
    this.role = null;
    this.activeRoomId = null;
    this.currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    this.isPageVisible = typeof document !== "undefined" ? document.visibilityState === "visible" : true;
    this.activeRoomsMap = new Map(); // room_id -> Set of active user keys

    this.initListeners();
  }

  initListeners() {
    if (typeof window === "undefined") return;

    document.addEventListener("visibilitychange", () => {
      this.isPageVisible = document.visibilityState === "visible";
      this.broadcastPresence();
    });

    window.addEventListener("focus", () => {
      this.isPageVisible = true;
      this.broadcastPresence();
    });

    window.addEventListener("blur", () => {
      this.isPageVisible = false;
      this.broadcastPresence();
    });

    if (socket) {
      socket.on("presence:sync", (data = {}) => {
        if (data.roomId && Array.isArray(data.activeUsers)) {
          this.activeRoomsMap.set(String(data.roomId), new Set(data.activeUsers.map(String)));
        }
      });

      socket.on("presence:user_joined", (data = {}) => {
        if (data.roomId && data.userId) {
          const rId = String(data.roomId);
          if (!this.activeRoomsMap.has(rId)) this.activeRoomsMap.set(rId, new Set());
          this.activeRoomsMap.get(rId).add(String(data.userId));
        }
      });

      socket.on("presence:user_left", (data = {}) => {
        if (data.roomId && data.userId) {
          const rId = String(data.roomId);
          if (this.activeRoomsMap.has(rId)) {
            this.activeRoomsMap.get(rId).delete(String(data.userId));
          }
        }
      });

      socket.on("connect", () => {
        this.broadcastPresence();
      });
    }
  }

  setIdentity(userId, role) {
    this.userId = userId ? String(userId) : null;
    this.role = role || null;
    this.broadcastPresence();
  }

  setActiveRoom(roomId, path = typeof window !== "undefined" ? window.location.pathname : "") {
    const prevRoom = this.activeRoomId;
    this.activeRoomId = roomId ? String(roomId) : null;
    this.currentPath = path;

    if (socket && socket.connected) {
      if (prevRoom && prevRoom !== this.activeRoomId) {
        socket.emit("presence:leave_room", { roomId: prevRoom, userId: this.userId, role: this.role });
      }
      if (this.activeRoomId) {
        socket.emit("presence:join_room", { roomId: this.activeRoomId, userId: this.userId, role: this.role });
      }
    }
    this.broadcastPresence();
  }

  clearActiveRoom() {
    if (this.activeRoomId && socket && socket.connected) {
      socket.emit("presence:leave_room", { roomId: this.activeRoomId, userId: this.userId, role: this.role });
    }
    this.activeRoomId = null;
    this.broadcastPresence();
  }

  broadcastPresence() {
    if (!socket || !socket.connected || !this.userId) return;

    socket.emit("presence:update", {
      userId: this.userId,
      role: this.role,
      activeRoomId: this.activeRoomId,
      currentPath: typeof window !== "undefined" ? window.location.pathname : "",
      isPageVisible: typeof document !== "undefined" ? document.visibilityState === "visible" : true,
    });
  }

  /**
   * Determine if recipient is online & actively connected to the chat room
   */
  isRecipientActiveInRoom(roomId, recipientId) {
    if (!roomId) return false;
    const rId = String(roomId);

    // Check socket room presence map
    const activeUsersInRoom = this.activeRoomsMap.get(rId);
    if (activeUsersInRoom && recipientId && activeUsersInRoom.has(String(recipientId))) {
      return true;
    }

    // Check browser tab visibility and route
    const isCurrentRoom = String(this.activeRoomId) === rId;
    const isChatRoute = this.currentPath.includes("/chat") || this.currentPath.includes("/workspace");

    return isCurrentRoom && isChatRoute && this.isPageVisible;
  }
}

export const presenceService = new PresenceService();
