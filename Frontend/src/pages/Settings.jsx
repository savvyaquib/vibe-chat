import { Bell, Check, MessageSquare, Palette, Send, Volume2 } from "lucide-react";
import { useState } from "react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

const PREVIEW_MESSAGES = [
  {
    id: 1,
    content: "Hey! How's the new theme looking?",
    isSent: false,
    time: "10:24",
  },
  {
    id: 2,
    content: "Clean, sharp, and very Vibe Chat.",
    isSent: true,
    time: "10:25",
  },
];

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  const [compactMode, setCompactMode] = useState(false);
  const [enterToSend, setEnterToSend] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  return (
    <main className="h-full overflow-y-auto bg-base-200">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl border border-[#9D00FF]/25 bg-[#9D00FF]/15 text-[#D59AFF]">
              <Palette className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Settings</h1>
              <p className="text-sm text-base-content/60">
                Personalize your chat workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-lg bg-base-100 p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Theme</h2>
                <p className="text-sm text-base-content/60">
                  Choose a theme for your chat interface.
                </p>
              </div>
              <span className="rounded-md border border-base-300 px-3 py-1 text-sm capitalize text-base-content/70">
                {theme}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {THEMES.map((themeName) => (
                <button
                  key={themeName}
                  type="button"
                  data-theme={themeName}
                  onClick={() => setTheme(themeName)}
                  className={`group rounded-lg border bg-base-100 p-3 text-left transition hover:-translate-y-0.5 hover:border-[#9D00FF]/60 hover:shadow-md ${
                    theme === themeName
                      ? "border-[#9D00FF] ring-2 ring-[#9D00FF]/30"
                      : "border-base-300"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {themeName}
                    </span>
                    {theme === themeName && (
                      <Check className="size-4 text-[#9D00FF]" />
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-1">
                    <span className="h-6 rounded bg-primary" />
                    <span className="h-6 rounded bg-secondary" />
                    <span className="h-6 rounded bg-accent" />
                    <span className="h-6 rounded bg-neutral" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-lg bg-base-100 p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#9D00FF]/15 text-[#D59AFF]">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Preview</h2>
                  <p className="text-sm text-base-content/60">
                    Current theme in conversation.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-base-300 bg-base-200">
                <div className="flex items-center gap-3 border-b border-base-300 p-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#9D00FF] font-semibold text-white">
                    V
                  </div>
                  <div>
                    <p className="font-medium">Vibe Chat</p>
                    <p className="text-xs text-base-content/60">Online now</p>
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isSent ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[82%] rounded-lg px-4 py-2 ${
                          message.isSent
                            ? "bg-[#9D00FF] text-white"
                            : "bg-base-100 text-base-content"
                        } ${compactMode ? "text-sm" : "text-base"}`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`mt-1 text-right text-xs ${
                            message.isSent
                              ? "text-white/70"
                              : "text-base-content/50"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 border-t border-base-300 p-4">
                  <div className="h-10 flex-1 rounded-lg bg-base-100" />
                  <button
                    type="button"
                    className="btn size-10 border-[#8A00E0] bg-[#9D00FF] p-0 text-white hover:border-[#7800C2] hover:bg-[#8500D9]"
                    aria-label="Send preview message"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-lg bg-base-100 p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Chat Preferences</h2>

              <div className="space-y-4">
                <label className="flex items-center justify-between gap-4 rounded-lg border border-base-300 p-4">
                  <div>
                    <p className="font-medium">Compact messages</p>
                    <p className="text-sm text-base-content/60">
                      Reduce vertical spacing in conversations.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle border-[#9D00FF] bg-base-300 checked:border-[#9D00FF] checked:bg-[#9D00FF]"
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-lg border border-base-300 p-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="size-5 text-base-content/60" />
                    <div>
                      <p className="font-medium">Enter to send</p>
                      <p className="text-sm text-base-content/60">
                        Submit messages with the Enter key.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle border-[#9D00FF] bg-base-300 checked:border-[#9D00FF] checked:bg-[#9D00FF]"
                    checked={enterToSend}
                    onChange={(e) => setEnterToSend(e.target.checked)}
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-lg border border-base-300 p-4">
                  <div className="flex items-center gap-3">
                    {soundAlerts ? (
                      <Volume2 className="size-5 text-base-content/60" />
                    ) : (
                      <Bell className="size-5 text-base-content/60" />
                    )}
                    <div>
                      <p className="font-medium">Sound alerts</p>
                      <p className="text-sm text-base-content/60">
                        Play a tone for new messages.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle border-[#9D00FF] bg-base-300 checked:border-[#9D00FF] checked:bg-[#9D00FF]"
                    checked={soundAlerts}
                    onChange={(e) => setSoundAlerts(e.target.checked)}
                  />
                </label>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Settings;
