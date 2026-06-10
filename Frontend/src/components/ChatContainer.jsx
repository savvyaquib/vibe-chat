import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, setSelectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleCloseChat = () => {
    setSelectedUser(null);
  };

  const openPreview = (src) => {
    setPreviewImage(src);
    setZoomLevel(1);
  };

  const closePreview = () => {
    setPreviewImage(null);
    setZoomLevel(1);
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.6));
  const resetZoom = () => setZoomLevel(1);

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); 

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-x-hidden">
      <ChatHeader onBack={handleCloseChat} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-base-100 to-base-200/30">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-base-content/50 text-center">No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((message, index) => {
          const senderId = message.sender?._id || message.sender;
          const currentUserId = authUser._id;
          const isOwnMessage = senderId === currentUserId;

          return (
            <div
              key={message._id}
              className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border-2 border-base-300 shadow-sm">
                  <img
                    src={
                      isOwnMessage
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser?.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className={`flex flex-col gap-3 ${isOwnMessage ? "items-end" : "items-start"}`}>
                {(message.images?.length > 0 || message.image) && (
                  <div className={`grid gap-2 ${message.images?.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {(message.images?.length > 0 ? message.images : [message.image]).map((imgSrc, imgIndex) => (
                      <button
                        key={`${message._id}-img-${imgIndex}`}
                        type="button"
                        onClick={() => openPreview(imgSrc)}
                        className="rounded-3xl overflow-hidden border border-base-300 bg-base-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <img
                          src={imgSrc}
                          alt={`Attachment ${imgIndex + 1}`}
                          className={`w-full rounded-3xl object-cover transition-all duration-200 hover:opacity-90 ${message.images?.length > 1 ? "max-h-[200px]" : "max-h-[280px]"}`}
                          style={{ maxWidth: message.images?.length > 1 ? "220px" : "320px" }}
                        />
                      </button>
                    ))}
                  </div>
                )}
                {message.content && (
                  <div className={`chat-bubble flex flex-col shadow-md ${isOwnMessage ? "bg-primary text-primary-content" : "bg-base-300 text-base-content"}`}>
                    <p>{message.content}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <MessageInput />

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative flex flex-col rounded-2xl bg-base-100 shadow-2xl">
            <div className="flex items-center justify-between gap-2 p-3 border-b border-base-300">
              <div />
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-xs btn-circle bg-base-200/90 hover:bg-base-300"
                  type="button"
                  onClick={zoomOut}
                  title="Zoom out"
                >
                  −
                </button>
                <button
                  className="btn btn-xs btn-circle bg-base-200/90 hover:bg-base-300"
                  type="button"
                  onClick={resetZoom}
                  title="Reset zoom"
                >
                  1x
                </button>
                <button
                  className="btn btn-xs btn-circle bg-base-200/90 hover:bg-base-300"
                  type="button"
                  onClick={zoomIn}
                  title="Zoom in"
                >
                  +
                </button>
                <button
                  className="btn btn-xs btn-circle bg-base-200/90 hover:bg-base-300"
                  type="button"
                  onClick={closePreview}
                  title="Close"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="overflow-auto flex items-center justify-center" style={{ maxHeight: "calc(100vh - 80px)", maxWidth: "90vw" }}>
              <img
                src={previewImage}
                alt="Preview"
                style={{ transform: `scale(${zoomLevel})` }}
                className="max-w-[85vw] max-h-[calc(100vh-100px)] object-contain transition-transform duration-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatContainer;