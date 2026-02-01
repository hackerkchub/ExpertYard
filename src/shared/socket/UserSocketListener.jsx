import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../api/socket";
import { useAuth } from "../context/UserAuthContext";

const UserSocketListener = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    const handleChatAccepted = ({ user_id, room_id }) => {
      if (Number(user_id) !== Number(user.id)) return;

      console.log("✅ USER GLOBAL REDIRECT:", room_id);
      navigate(`/user/chat/${room_id}`, { replace: true });
    };

    socket.on("chat_accepted", handleChatAccepted);

    return () => {
      socket.off("chat_accepted", handleChatAccepted);
    };
  }, [user?.id, navigate]);

  return null;
};

export default UserSocketListener;
