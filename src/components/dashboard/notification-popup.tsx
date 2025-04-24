/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Bell, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "@/store/slices/notificationSlice";
import { formatDistanceToNow } from "date-fns";
import { NotificationType } from "@/types/notification";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
}

export default function NotificationPopup() {
  const [isOpen, setIsOpen] = useState(false);
  // const [notifications, setNotifications] = useState<Notification[]>([
  //   {
  //     id: "1",
  //     title: "New message received",
  //     message: "You have a new message from Jane Doe",
  //     timestamp: "Just now",
  //     type: "info",
  //     read: false,
  //   },
  //   {
  //     id: "2",
  //     title: "Payment successful",
  //     message: "Your payment of $250 has been processed",
  //     timestamp: "10 minutes ago",
  //     type: "success",
  //     read: false,
  //   },
  //   {
  //     id: "3",
  //     title: "Action required",
  //     message: "Please update your account information",
  //     timestamp: "1 hour ago",
  //     type: "warning",
  //     read: false,
  //   },
  //   {
  //     id: "4",
  //     title: "System maintenance",
  //     message: "Scheduled downtime on Sunday 10pm-2am",
  //     timestamp: "Yesterday",
  //     type: "info",
  //     read: true,
  //   },
  //   {
  //     id: "5",
  //     title: "Error processing request",
  //     message: "Your last transaction was declined",
  //     timestamp: "2 days ago",
  //     type: "error",
  //     read: true,
  //   },
  //   {
  //     id: "6",
  //     title: "Error processing request",
  //     message: "Your last transaction was declined",
  //     timestamp: "2 days ago",
  //     type: "error",
  //     read: true,
  //   },
  //   {
  //     id: "7",
  //     title: "Error processing request",
  //     message: "Your last transaction was declined",
  //     timestamp: "2 days ago",
  //     type: "error",
  //     read: true,
  //   },
  //   {
  //     id: "7",
  //     title: "Error processing request",
  //     message: "Your last transaction was declined",
  //     timestamp: "2 days ago",
  //     type: "error",
  //     read: true,
  //   },
  // ]);

  const dispatch = useAppDispatch();
  const { notifications, isLoading } = useAppSelector(
    (state) => state.notifications
  );
  useEffect(() => {
    dispatch(getUserNotifications());
  }, [dispatch]);
  const unreadCount = notifications.filter((n) => n.status == "UNREAD").length;


  const notificationTypeToStatus: NotificationType = {
    LEAVE_REQUEST_CREATED: "info",
    LEAVE_REQUEST_APPROVED: "success",
    LEAVE_REQUEST_REJECTED: "error",
    LEAVE_REQUEST_CANCELLED: "warning",
    LEAVE_BALANCE_UPDATED: "success",
    LEAVE_REQUEST_UPDATE: "info",
    SYSTEM_NOTIFICATION: "info",
    CALENDAR_UPDATE: "info", 
  };
  
  const typeToColor = {
    info: "text-africa-blue",
    warning: "text-africa-yellow",
    success: "text-africa-sage",
    error: "text-africa-red",
  };

  // Handle body scroll lock when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);



  const markAsRead = async (id: string) => {
    await dispatch(markNotificationAsRead(id)).unwrap();
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full justify-start"
        size="sm"
        id="notification-button"
      >
        <Bell className="h-4 w-4 mr-2" />
        <span>Notifications</span>
        <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      </Button>

      {isOpen &&
        createPortal(
          <div className="fixed  inset-0 z-[9999] flex flex-col bg-white md:bg-black md:bg-opacity-20 md:items-end md:p-4">
            {/* Panel Container */}
            <div className="bg-white w-full h-full md:max-w-md md:h-auto md:rounded-lg md:shadow-lg flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden mr-2 p-0 h-8 w-8"
                    onClick={() => setIsOpen(false)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-lg font-medium">Notifications</h2>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="text-xs h-8 disabled"
                    >
                      Mark all as read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex h-8 p-0 w-8"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto p-4   max-h-[calc(80vh-132px)]">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-4 ">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`relative ${
                          notification.status !== "READ" ? "pl-3" : ""
                        } hover:bg-gray-50 p-3 rounded-md cursor-pointer`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative flex-shrink-0 my-auto">
                            <Bell
                              className={`h-5 w-5  ${
                                typeToColor[
                                  notificationTypeToStatus[
                                    notification.type as any
                                  ]
                                ]
                              }`}
                            />

                            {notification.status !== "READ" && (
                              <span className="absolute  top-[5px] right-0 -translate-y-1/2 h-2 w-2 rounded-full bg-primary"></span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                { addSuffix: true }
                              )}
                            </p>
                          </div>
                        </div>
                        <Separator className="mt-3" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
