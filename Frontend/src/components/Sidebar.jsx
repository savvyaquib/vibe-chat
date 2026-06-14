import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, typingUsers } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users
    .filter((user) => user._id !== authUser?._id)
    .filter((user) => {
      const searchValue = search.toLowerCase();
      return (
        user.fullName?.toLowerCase().includes(searchValue) ||
        user.name?.toLowerCase().includes(searchValue)
      );
    })
    .filter((user) => (showOnlineOnly ? onlineUsers.includes(user._id) : true));

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full lg:w-72 flex flex-col transition-all duration-200">
      <div className="w-full p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium text-base">Contacts</span>
          </div>
          <span className="hidden sm:inline text-sm text-base-content/70">{filteredUsers.length} contacts</span>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-base-300 bg-base-200 px-3 py-2">
          <Search className="size-5 text-base-content/70" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts"
            className="w-full bg-transparent text-sm outline-none placeholder:text-base-content/50"
          />
        </div>

        <label className="mt-4 flex items-center justify-between p-3 rounded-2xl bg-base-200 transition-all duration-200 cursor-pointer select-none">
          <div className="flex items-center gap-2">
            <div className={`size-2.5 rounded-full transition-all duration-300 ${showOnlineOnly ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-base-content/30'}`} />
            <span className="text-sm font-semibold text-base-content/85">Show Online Only</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-base-300 text-base-content/70 font-semibold transition-colors">
              {Math.max(0, onlineUsers.length - (authUser && onlineUsers.includes(authUser._id) ? 1 : 0))}
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="sr-only"
            />
            {/* Custom iOS-style Switch */}
            <div className={`relative w-9 h-5 rounded-full border border-base-content/30 shadow-sm transition-colors duration-200 ${showOnlineOnly ? 'bg-primary' : 'bg-base-content/20'}`}>
              <div className={`absolute left-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200 ${showOnlineOnly ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </div>
        </label>
      </div>

      <div className="overflow-y-auto w-full py-3 scrollbar-hide">
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 text-left
              ${selectedUser?._id === user._id
                ? "bg-primary/20 border-l-4 border-primary shadow-sm"
                : "hover:bg-base-300/50"}
            `}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-base-100 bg-emerald-500"
                />
              )}
            </div>

            <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate capitalize">{user.fullName || user.name}</div>
                <div className="text-sm text-zinc-400 truncate">
                  {typingUsers[user._id] ? (
                      <span className="text-emerald-500 font-medium tracking-wide">typing...</span>
                  ) : user.lastMessage ? (
                      user.lastMessage.content || "🖼️ Photo"
                  ) : ""}
                </div>
              </div>
              {user.unreadCount > 0 && (
                <div className="bg-emerald-500 text-white text-xs font-bold min-w-[1.25rem] h-5 flex shrink-0 items-center justify-center rounded-full px-1.5 shadow-sm">
                  {user.unreadCount}
                </div>
              )}
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;