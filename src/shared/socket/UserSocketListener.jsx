import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../api/socket";
import { useAuth } from "../context/UserAuthContext";
import { getChatRoomCandidates, getChatRoomId } from "../utils/chatRoom";

const UserSocketListener = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    const handleChatAccepted = (data = {}) => {
      if (data.user_id && Number(data.user_id) !== Number(user.id)) return;

      const room_id = getChatRoomId(data);
      if (!room_id) return;

      console.log("✅ USER GLOBAL REDIRECT:", room_id);
      navigate(`/user/chat/${room_id}`, {
        replace: true,
        state: { roomCandidates: getChatRoomCandidates(data) },
      });
    };

    socket.on("chat_accepted", handleChatAccepted);

    return () => {
      socket.off("chat_accepted", handleChatAccepted);
    };
  }, [user?.id, navigate]);

  return null;
};

export default UserSocketListener;
