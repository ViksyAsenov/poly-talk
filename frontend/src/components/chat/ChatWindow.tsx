import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/chatStore";
import { Message } from "../../types/chat";
import { formatDistanceToNow } from "date-fns";
import { useUserStore } from "../../store/userStore";
import { useSocket } from "../../hooks/useSocket";
import { socket } from "../../api/socket";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-lg px-4 py-2 shadow 
          ${isOwn ? "bg-accent text-white" : "bg-bg text-text"}`}
      >
        <div className="text-sm font-medium mb-1">
          {message.sender.displayName}
        </div>
        <div className="text-sm break-words">{message.displayContent}</div>
        <div
          className={`text-xs mt-1 ${
            isOwn ? "text-white text-opacity-80" : "text-secondary-text"
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

const EmptyConversation = () => (
  <div className="flex items-center justify-center h-full p-4">
    <div className="text-center">
      <p className="text-secondary-text mb-2">No conversation selected</p>
      <p className="text-secondary-text text-sm">
        Select a conversation from the list to start chatting
      </p>
    </div>
  </div>
);

const NoMessages = () => (
  <div className="h-full flex items-center justify-center">
    <p className="text-secondary-text text-center">
      No messages yet. Start the conversation!
    </p>
  </div>
);

const ChatWindow: React.FC = () => {
  const { messages, currentConversation, fetchMessages, addMessage } =
    useChatStore();
  const { user } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      if (currentConversation) {
        await fetchMessages(currentConversation.id);
      }
    };

    load();
  }, [currentConversation, fetchMessages]);

  useEffect(() => {
    if (!currentConversation) return;

    socket.emit("room", {
      id: currentConversation.id,
      type: "JOIN",
    });

    return () => {
      socket.emit("room", {
        id: currentConversation.id,
        type: "LEAVE",
      });
    };
  }, [currentConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useSocket<{ conversationId: string; message: Message }>({
    event: "chat:message",
    handler: (data) => {
      addMessage(data.conversationId, data.message);
    },
    dependencies: [currentConversation],
  });

  if (!currentConversation) {
    return <EmptyConversation />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-secondary-bg flex-shrink-0 bg-bg">
        <h2 className="text-xl font-semibold truncate text-text">
          {currentConversation.isGroup
            ? currentConversation.name
            : currentConversation.participants.find(
                (p) => p.user.id !== user?.id
              )?.user.displayName}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-6 bg-secondary-bg">
        {messages.length === 0 ? (
          <NoMessages />
        ) : (
          <div>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender.id === user?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
