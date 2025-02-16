import React, { useEffect, useState } from "react";
import { useSocket } from "../../providers/socketProvider";
import { CiBellOn, CiTrash } from "react-icons/ci";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  DeleteNotification_API,
  GetNotification_API,
} from "../../api/notificationApi";
interface Notification {
  _id: string;
  recipient: string;
  type: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const NotificationsPage = () => {
  const { notifications, isConnected } = useSocket();
  const { user } = useSelector((state: RootState) => state.user);
  const [readStatus, setReadStatus] = useState<Record<number, boolean>>({});
  const [userNotifications, setUserNotifications] = useState<Notification[]>(
    []
  );

  const toggleReadStatus = (index: number) => {
    setReadStatus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const clearAllNotifications = async() => {
    //setReadStatus({});
    if(!user?._id) return;
   const res =  await DeleteNotification_API(user?._id);
   if(res.success){
     setUserNotifications([]);
   }
  };

  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return;
      const res = await GetNotification_API(user?._id);
      console.log(res);
      if (res.success) {
        setUserNotifications(res.data);
      }
    }
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <CiBellOn className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Notifications</h1>
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>

          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            <CiTrash className="w-4 h-4" />
            Clear All
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {userNotifications.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <CiBellOn className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">No notifications to display</p>
            </div>
          ) : (
            userNotifications.map((notification, index) => (
              <div
                key={index}
                className={`p-4 bg-gray-800 rounded-lg transition-all ${
                  readStatus[index] ? "opacity-75" : ""
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {notification.message}
                      </h3>
                      {!notification.isRead && (
                        <span className="px-2 py-1 bg-blue-500 text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    {/* <p className="text-gray-400 mb-2">
                      Created by: {notification.createdAt}
                    </p> */}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {/* <Clock className="w-4 h-4" /> */}
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleReadStatus(index)}
                    className={`p-2 rounded-lg ${
                      readStatus[index]
                        ? "bg-gray-700 text-gray-400"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {/* <Check className="w-4 h-4" /> */}
                    check
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
