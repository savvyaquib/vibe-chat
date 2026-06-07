import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users
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
    <aside className="h-full w-full lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
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

        <div className="mt-4 hidden lg:flex items-center gap-3 bg-base-300/30 p-3 rounded-lg">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm checkbox-primary cursor-pointer w-5 h-5"
            id="online-filter"
          />
          <label htmlFor="online-filter" className="cursor-pointer flex items-center gap-2 flex-1">
            <span className="text-sm font-medium text-base-content">Show online only</span>
          </label>
          <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap">({Math.max(0, onlineUsers.length)} online)</span>
        </div>
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
                  className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-base-100 bg-emerald-500"
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="font-medium truncate">{user.fullName || user.name}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
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