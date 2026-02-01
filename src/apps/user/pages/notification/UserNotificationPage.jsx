import NotificationHistory from "@/shared/components/notification/NotificationHistory";

const dummyData = [
  {
    id: 1,
    type: "call",
    title: "Incoming Call",
    message: "Expert Rahul called you",
    time: "5 min ago",
    read: false,
  },
  {
    id: 2,
    type: "chat",
    title: "New Message",
    message: "You received a chat reply",
    time: "10 min ago",
    read: false,
  },
  {
    id: 3,
    type: "system",
    title: "Profile Updated",
    message: "Your profile saved successfully",
    time: "Yesterday",
    read: true,
  },
];

export default function UserNotificationPage() {
  return (
    <NotificationHistory
      title="User Notifications"
      data={dummyData}
    />
  );
}
