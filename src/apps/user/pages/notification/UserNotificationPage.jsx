import NotificationHistory from "@/shared/components/notification/NotificationHistory";
import { useAuth } from "@/shared/context/UserAuthContext";
import { useNotifications } from "@/shared/hooks/useNotifications";

export default function UserNotificationPage() {
  const { user } = useAuth();
  const { notifications } = useNotifications({
    panel: "user",
    userId: user?.id,
  });

  return (
    <NotificationHistory
      title="User Notifications"
      data={notifications}
    />
  );
}
