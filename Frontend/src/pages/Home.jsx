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

  return (
    <main className="h-screen h-[100dvh] bg-base-200 pt-16 overflow-hidden">
      <div className="mx-auto grid h-full max-w-full gap-4 p-0 sm:p-4 lg:max-w-7xl lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className={`flex h-full flex-col rounded-none border border-base-300 bg-base-100 shadow-sm overflow-hidden lg:rounded-3xl ${isChatOpen ? "hidden lg:flex" : "flex"}`}>
          <Sidebar />
        </div>

        <div className={`flex h-full min-h-0 flex-col overflow-hidden border border-base-300 bg-base-100 shadow-sm lg:rounded-3xl ${selectedUser ? "flex" : "hidden lg:flex"}`}>
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
