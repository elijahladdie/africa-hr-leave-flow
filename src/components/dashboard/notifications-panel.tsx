
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
}

interface NotificationsPanelProps {
  notifications: Notification[];
}

export function NotificationsPanel({ notifications }: NotificationsPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  // Map notification types to icon colors
  const typeToColor = {
    info: "text-africa-blue",
    warning: "text-africa-yellow",
    success: "text-africa-sage",
    error: "text-africa-red",
  };

  return (
    <Card className="africa-card animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Notifications</CardTitle>
          {unreadCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-africa-terracotta px-2 py-0.5 text-xs text-white">
              {unreadCount} new
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className={`relative ${!notification.read ? 'pl-3' : ''}`}>
                {!notification.read && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-africa-terracotta"></span>
                )}
                <div className="flex items-start gap-2">
                  <Bell className={`h-4 w-4 mt-0.5 ${typeToColor[notification.type]}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notification.timestamp}</p>
                  </div>
                </div>
                <Separator className="mt-3" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {notifications.length > 3 && (
        <CardFooter className="pt-0">
          <Button variant="link" className="w-full text-africa-blue">
            View all notifications
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
