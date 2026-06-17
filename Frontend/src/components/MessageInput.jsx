import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const isSendingRef = useRef(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { socket } = useAuthStore();

  const isMobile = typeof window !== "undefined" && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  useEffect(() => {
    if (selectedUser && !isMobile) {
      inputRef.current?.focus();
    }
  }, [selectedUser, isMobile]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      toast.error("Only image files are supported.");
    }

    try {
      const newPreviews = await Promise.all(
        validFiles.map(async (file) => ({
          name: file.name,
          src: await readFileAsDataUrl(file),
        }))
      );
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } catch (error) {
      console.error("Failed to load image previews:", error);
      toast.error("Unable to preview selected images.");
    }
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearForm = () => {
    setText("");
    setImagePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (isSendingRef.current) return;

    const trimmedText = text.trim();
    const imagesToSend = imagePreviews.map((preview) => preview.src);
    if (!trimmedText && imagesToSend.length === 0) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (socket && selectedUser) socket.emit('stop_typing', { receiverId: selectedUser._id });

    // Clear form immediately for a seamless feel (WhatsApp style)
    clearForm();

    setIsSending(true);
    isSendingRef.current = true;

    try {
      await sendMessage({
        text: trimmedText,
        images: imagesToSend,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
      // Restore the text in the input box so the user doesn't lose it
      setText(trimmedText);
    } finally {
      setIsSending(false);
      isSendingRef.current = false;
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <div className="p-4 w-full bg-base-100 border-t border-base-300">
      {imagePreviews.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {imagePreviews.map((preview, index) => (
            <div
              key={`${preview.name}-${index}`}
              className="relative overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm"
            >
              <img
                src={preview.src}
                alt={preview.name}
                className="h-16 w-16 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-base-200 text-base-content flex items-center justify-center shadow hover:bg-error/80 hover:text-white transition-colors"
                disabled={isSending}
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 bg-base-200/50 p-3 rounded-lg transition-all duration-200 hover:shadow-lg focus-within:shadow-lg focus-within:shadow-primary/50"
      >
        <div className="flex-1 flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            className="w-full px-3 py-2 rounded-lg bg-base-100 text-base-content placeholder-base-content/50 focus:outline-none transition-all duration-200 focus:scale-105"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (socket && selectedUser) {
                socket.emit('typing', { receiverId: selectedUser._id });
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => {
                  socket.emit('stop_typing', { receiverId: selectedUser._id });
                }, 2000);
              }
            }}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isSending}
          />

          <button
            type="button"
            className={`btn btn-circle ${imagePreviews.length > 0 ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className={`btn btn-sm btn-circle ${isSending ? "loading" : ""}`}
          disabled={isSending || (!text.trim() && imagePreviews.length === 0)}
          aria-label={isSending ? "Sending message" : "Send message"}
        >
          {!isSending && <Send size={22} />}
        </button>
      </form>
    </div>
  );
};
export default MessageInput;