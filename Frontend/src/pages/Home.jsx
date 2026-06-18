import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

const Home = () => {
  const { authUser, onlineUsers } = useAuthStore();
  const { selectedUser, users } = useChatStore();
  const isChatOpen = Boolean(selectedUser);

  const contactCount = users.length;
  const onlineCount = onlineUsers.filter((id) => id !== authUser?._id).length;

  useEffect(() => {
    // Prevent document-level scrolling on mobile and lock viewport
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlHeight = document.documentElement.style.height;

    // Apply viewport locks
    document.body.style.overflow = "hidden";
    document.body.style.height = "100dvh";
    // Explicitly reset any fixed body position left over by HMR
    document.body.style.position = "";
    document.body.style.width = "";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100dvh";

    // Reset scroll position to top
    window.scrollTo(0, 0);

    return () => {
      // Restore original styles
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.height = originalHtmlHeight;
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedUser]);

  return (
    <main className="h-full w-full bg-base-200 overflow-hidden">
      <div className="mx-auto flex flex-col h-full w-full max-w-full p-0 sm:p-4 lg:grid lg:max-w-7xl lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-4">
        <div className={`flex flex-1 min-h-0 flex-col rounded-none border border-base-300 bg-base-100 shadow-sm overflow-hidden lg:rounded-3xl lg:h-full ${isChatOpen ? "hidden lg:flex" : "flex"}`}>
          <Sidebar />
        </div>

        <div className={`flex flex-1 min-h-0 flex-col overflow-hidden border border-base-300 bg-base-100 shadow-sm lg:rounded-3xl lg:h-full ${selectedUser ? "flex" : "hidden lg:flex"}`}>
          {!selectedUser && (
            <div className="border-b border-base-300 bg-base-200 px-6 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-primary">
                    Welcome back
                  </p>
                  <h1 className="text-2xl font-semibold capitalize">
                    {authUser?.name || authUser?.fullName || "Vibe Chat"}
                  </h1>
                  <p className="text-sm text-base-content/70">
                    Select a contact on the left to start messaging.
                  </p>
                </div>

                <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-3">
                  <div className="rounded-3xl border border-base-300 bg-base-100 p-4 text-center">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                      Contacts
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{contactCount}</p>
                  </div>
                  <div className="rounded-3xl border border-base-300 bg-base-100 p-4 text-center">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                      Online
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{onlineCount}</p>
                  </div>
                  <div className="rounded-3xl border border-base-300 bg-base-100 p-4 text-center">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                      Active
                    </p>
                    <p className="mt-2 text-2xl font-semibold">None</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex min-h-0 flex-1 overflow-hidden">
            {selectedUser ? <ChatContainer /> : <NoChatSelected />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
