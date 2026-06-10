import { ArrowLeft, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = ({ onBack }) => {
  const { selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) {
    return null;
  }

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="border-b border-base-300 bg-base-200 px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="lg:hidden rounded-full p-2 hover:bg-base-300 transition-colors"
          aria-label="Back to contacts"
        >
          <ArrowLeft className="size-5" />
        </button>

        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName || selectedUser.username}
              className="size-14 rounded-full object-cover"
            />
            {isOnline && (
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-base-100 bg-emerald-500" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">{selectedUser.fullName || selectedUser.username}</h2>
            <p className="text-sm text-base-content/60 truncate">
              {isOnline ? "Active now" : "Offline"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="rounded-full p-2 hover:bg-base-300 transition-colors"
          aria-label="Close chat"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
