import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../../store/chatStore";
import { Message } from "../../types/chat";
import { formatDistanceToNow } from "date-fns";
import { useUserStore } from "../../store/userStore";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwn ? "bg-primary-600 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="text-sm font-medium mb-1">
          {message.sender.displayName}
        </div>
        <div className="text-sm">{message.displayContent}</div>
        <div
          className={`text-xs mt-1 ${
            isOwn ? "text-primary-100" : "text-gray-500"
          }`}
        >
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </div>
      </div>
    </div>
  );
};

const ChatWindow: React.FC = () => {
  const { messages, currentConversation, fetchMessages } = useChatStore();
  const { user } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (currentConversation) {
        setIsLoading(true);
        fetchMessages(currentConversation.id);
        setIsLoading(false);
      }
    };

    load();
  }, [currentConversation, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">
          {currentConversation.isGroup
            ? currentConversation.name
            : currentConversation.participants[0].user.displayName}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.sender.id === user?.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
