import { useState, useRef } from "react";
import { useChatStore } from "../../store/chatStore";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { currentConversation, sendMessage } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        150
      )}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !currentConversation || isLoading) return;

    setIsLoading(true);
    try {
      await sendMessage(currentConversation.id, message.trim());
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }
  };

  if (!currentConversation) return null;

  return (
    <div className="pt-1 bg-bg">
      <div className="relative">
        <div className="flex items-center rounded-lg border border-secondary-bg bg-secondary-bg p-2">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 mx-2 outline-none resize-none max-h-36 bg-transparent text-text"
            rows={1}
            disabled={isLoading}
          />

          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={`ml-1 p-2 rounded-full ${
              message.trim() && !isLoading
                ? "bg-accent text-white hover:bg-blue-700"
                : "bg-gray-300 text-secondary-text cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
