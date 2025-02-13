import React, { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { FaRegEye } from "react-icons/fa";
import { useSocket } from "../providers/socketProvider";

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

interface ChatProps {
  streamId: string;
}

// Initialize the Socket.IO connection
const socket: Socket = io("http://localhost:5005", {
  withCredentials: true,
});
// socket.emit('subscribeToNotifications');

const LiveChat = ({ streamId }: ChatProps) => {
  const { user } = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  // const { socket } = useSocket();
  const [viewers, setViewers] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for incoming messages from the server
  useEffect(() => {
    console.log(socket)
    if (!socket) return;
    console.log({ streamId, userId: user?._id });
    socket.emit("joinRoom", { streamId, userId: user?._id });

    socket.on("receiveMessage", (message: Message) => {
      console.log("receieved message", message, user?._id);
      if (message.userId != user?._id)
        setMessages((prev) => [...prev, message]);
    });
    socket.on("roomUserCount", (message: any) => {
      console.log("new user joined");
      if (message.roomId == streamId) {
        setViewers(message.count);
      }
    });

    return () => {
      socket.emit("leaveRoom", { streamId, userId: user?._id });
      socket.off("receiveMessage");
    };
  }, [streamId, user?._id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!socket) return;
    if (!user?._id) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: user?._id,
      username: user?.email,
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    // Emit the message to the server
    socket.emit("sendMessage", { streamId, message });
    setMessages((prev) => [...prev, message]); // Optimistically update the messages
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {isChatOpen ? (
        <div className=" bg-gray-900 rounded-lg shadow-xl flex flex-col">
          {/* Chat Header */}
          <div
            className="flex items-center justify-between p-4 border-b border-gray-700 cursor-pointer"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">Live Chat </h3>
            </div>
            <span className="text-sm text-gray-400 flex items-center gap-2">
              {viewers}
              <FaRegEye className="w-4 h-4" />
            </span>
          </div>

          <>
            {/* Messages Container */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 flex-1">
              {messages.map((message) => (
                <div key={message.id} className={`flex flex-col items-start`}>
                  <span className="text-xs text-gray-500 flex gap-2">
                    <span className="text-[10px] text-gray-600">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.username}
                    <span className="text-s text-white">{message.content}</span>
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-700"
            >
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        </div>
      ) : (
        <button
          className="min-w-max border border-white h-fit px-5 py-2 rounded-xl "
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          show chat
        </button>
      )}
    </>
  );
};

export default LiveChat;
