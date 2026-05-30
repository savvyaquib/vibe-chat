import {
  CheckCheck,
  Image,
  MoreHorizontal,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Users,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const CONTACTS = [
  {
    id: 1,
    name: "Aarav Mehta",
    role: "Product Designer",
    initials: "AM",
    online: true,
    unread: 2,
    lastMessage: "The new dashboard feels much smoother now.",
    lastSeen: "2m",
  },
  {
    id: 2,
    name: "Nina Kapoor",
    role: "Frontend Engineer",
    initials: "NK",
    online: true,
    unread: 0,
    lastMessage: "Pushed the theme selector fix.",
    lastSeen: "8m",
  },
  {
    id: 3,
    name: "Kabir Sethi",
    role: "Backend Engineer",
    initials: "KS",
    online: false,
    unread: 0,
    lastMessage: "Cloudinary env is updated on staging.",
    lastSeen: "1h",
  },
  {
    id: 4,
    name: "Sara Khan",
    role: "QA Lead",
    initials: "SK",
    online: true,
    unread: 4,
    lastMessage: "I found one edge case in auth refresh.",
    lastSeen: "now",
  },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    contactId: 1,
    content: "Hey, the chat shell is ready for review.",
    sentByMe: false,
    time: "10:18 AM",
  },
  {
    id: 2,
    contactId: 1,
    content: "Nice. I am checking spacing and theme contrast now.",
    sentByMe: true,
    time: "10:20 AM",
  },
  {
    id: 3,
    contactId: 1,
    content: "The conversation area looks clean. Composer needs a little more presence.",
    sentByMe: false,
    time: "10:23 AM",
  },
  {
    id: 4,
    contactId: 1,
    content: "Agreed. I will make the actions clearer and keep the layout dense.",
    sentByMe: true,
    time: "10:24 AM",
  },
  {
    id: 5,
    contactId: 2,
    content: "Pushed the theme selector fix.",
    sentByMe: false,
    time: "9:42 AM",
  },
  {
    id: 6,
    contactId: 3,
    content: "Cloudinary env is updated on staging.",
    sentByMe: false,
    time: "Yesterday",
  },
  {
    id: 7,
    contactId: 4,
    content: "I found one edge case in auth refresh.",
    sentByMe: false,
    time: "10:05 AM",
  },
];

const Home = () => {
  const { authUser } = useAuthStore();
  const [selectedContactId, setSelectedContactId] = useState(CONTACTS[0].id);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");

  const selectedContact = CONTACTS.find(
    (contact) => contact.id === selectedContactId,
  );

  const visibleMessages = useMemo(
    () => messages.filter((message) => message.contactId === selectedContactId),
    [messages, selectedContactId],
  );

  const onlineCount = CONTACTS.filter((contact) => contact.online).length;

  const handleSend = (event) => {
    event.preventDefault();

    const content = draft.trim();
    if (!content) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        contactId: selectedContactId,
        content,
        sentByMe: true,
        time: "Just now",
      },
    ]);
    setDraft("");
  };

  return (
    <main className="min-h-screen bg-base-200 pt-16">
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl gap-4 p-4">
        <aside className="hidden w-80 shrink-0 flex-col rounded-lg border border-base-300 bg-base-100 shadow-sm md:flex">
          <div className="border-b border-base-300 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Messages</h2>
                <p className="text-sm text-base-content/60">
                  {onlineCount} online contacts
                </p>
              </div>
              <button className="btn btn-sm btn-ghost size-9 p-0" type="button">
                <Users className="size-4" />
              </button>
            </div>

            <label className="input input-bordered flex h-10 w-full items-center gap-2 bg-base-200">
              <Search className="size-4 text-base-content/50" />
              <input
                type="text"
                className="grow"
                placeholder="Search conversations"
              />
            </label>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {CONTACTS.map((contact) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => setSelectedContactId(contact.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                  selectedContactId === contact.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-base-200"
                }`}
              >
                <div className="relative">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">
                    {contact.initials}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-base-100 ${
                      contact.online ? "bg-success" : "bg-base-300"
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-medium">{contact.name}</p>
                    <span className="text-xs text-base-content/50">
                      {contact.lastSeen}
                    </span>
                  </div>
                  <p className="truncate text-sm text-base-content/60">
                    {contact.lastMessage}
                  </p>
                </div>

                {contact.unread > 0 && (
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-content">
                    {contact.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm">
          <header className="flex items-center justify-between border-b border-base-300 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-content">
                  {selectedContact.initials}
                </div>
                <span
                  className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-base-100 ${
                    selectedContact.online ? "bg-success" : "bg-base-300"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <h1 className="truncate font-semibold">
                  {selectedContact.name}
                </h1>
                <p className="truncate text-sm text-base-content/60">
                  {selectedContact.online ? "Active now" : selectedContact.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="btn btn-sm btn-ghost size-9 p-0" type="button">
                <Phone className="size-4" />
              </button>
              <button className="btn btn-sm btn-ghost size-9 p-0" type="button">
                <Video className="size-4" />
              </button>
              <button className="btn btn-sm btn-ghost size-9 p-0" type="button">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-base-200/60 p-4 md:p-6">
            <div className="mx-auto w-fit rounded-full bg-base-100 px-3 py-1 text-xs text-base-content/60">
              Today
            </div>

            {visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sentByMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm md:max-w-[62%] ${
                    message.sentByMe
                      ? "rounded-br-md bg-primary text-primary-content"
                      : "rounded-bl-md bg-base-100 text-base-content"
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  <div
                    className={`mt-2 flex items-center justify-end gap-1 text-xs ${
                      message.sentByMe
                        ? "text-primary-content/70"
                        : "text-base-content/50"
                    }`}
                  >
                    <span>{message.time}</span>
                    {message.sentByMe && <CheckCheck className="size-3.5" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            className="border-t border-base-300 bg-base-100 p-3 md:p-4"
          >
            <div className="flex items-end gap-2 rounded-lg border border-base-300 bg-base-200 p-2">
              <button className="btn btn-ghost size-10 p-0" type="button">
                <Paperclip className="size-5" />
              </button>
              <button className="btn btn-ghost size-10 p-0" type="button">
                <Image className="size-5" />
              </button>

              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend(event);
                  }
                }}
                rows={1}
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 outline-none placeholder:text-base-content/45"
                placeholder={`Message ${selectedContact.name}`}
              />

              <button className="btn btn-ghost size-10 p-0" type="button">
                <Smile className="size-5" />
              </button>
              <button
                className="btn size-10 border-[#8A00E0] bg-[#9D00FF] p-0 text-white hover:border-[#7800C2] hover:bg-[#8500D9]"
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send message"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </section>

        <aside className="hidden w-72 shrink-0 rounded-lg border border-base-300 bg-base-100 p-5 shadow-sm xl:block">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex size-20 items-center justify-center rounded-full bg-primary/15 text-2xl font-semibold text-primary">
              {selectedContact.initials}
            </div>
            <h2 className="font-semibold">{selectedContact.name}</h2>
            <p className="text-sm text-base-content/60">
              {selectedContact.role}
            </p>
            <span
              className={`mt-4 rounded-full px-3 py-1 text-xs font-medium ${
                selectedContact.online
                  ? "bg-success/15 text-success"
                  : "bg-base-200 text-base-content/60"
              }`}
            >
              {selectedContact.online ? "Online" : "Offline"}
            </span>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-lg border border-base-300 p-4">
              <p className="text-sm text-base-content/60">Shared media</p>
              <p className="mt-1 text-2xl font-semibold">18</p>
            </div>
            <div className="rounded-lg border border-base-300 p-4">
              <p className="text-sm text-base-content/60">Pinned messages</p>
              <p className="mt-1 text-2xl font-semibold">3</p>
            </div>
            <div className="rounded-lg border border-base-300 p-4">
              <p className="text-sm text-base-content/60">Signed in as</p>
              <p className="mt-1 truncate font-medium">
                {authUser?.name || "You"}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Home;
