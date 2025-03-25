import { useState, KeyboardEvent } from "react";
import { useChatStore } from "../../store/chatStore";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { currentConversation, sendMessage } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || !currentConversation || isLoading) return;

    setIsLoading(true);

    await sendMessage(currentConversation.id, message.trim());

    setMessage("");
    setIsLoading(false);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentConversation) return null;

  return (
    <div className="border-t p-4">
      <div className="flex items-end space-x-2">
        <textarea
          className="input resize-none"
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button
          className="btn btn-primary p-2"
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
