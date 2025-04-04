import React, { useEffect, useRef, useState } from "react";
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

const GroupInfoModal = ({ onClose }: { onClose: () => void }) => {
  const { user } = useUserStore();
  const {
    currentConversation,
    changeGroupConversationName,
    addParticipant,
    removeParticipant,
  } = useChatStore();

  const [newName, setNewName] = useState("");

  useEffect(() => {
    setNewName(currentConversation?.name ?? "");
  }, [currentConversation]);

  const isAdmin = currentConversation?.participants.find(
    (p) => p.user.id === user?.id
  )?.isAdmin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-bg rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Group Info</h2>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>
        {isAdmin && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Group Name:
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={() => {
                changeGroupConversationName(currentConversation.id, newName);
              }}
              className="mt-2 px-4 py-2 bg-accent text-white rounded"
            >
              Change Name
            </button>
          </div>
        )}
        <div>
          <h3 className="font-semibold mb-2">Participants</h3>
          <ul>
            {currentConversation?.participants.map((participant) => (
              <li
                key={participant.user.id}
                className="flex justify-between items-center py-1 border-b border-gray"
              >
                <span>{participant.user.displayName}</span>
                {isAdmin && participant.user.id !== user?.id && (
                  <button
                    onClick={() =>
                      removeParticipant(
                        currentConversation.id,
                        participant.user.id
                      )
                    }
                    className="text-red text-sm"
                  >
                    Kick
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        {isAdmin && (
          <div className="mt-4">
            <button
              onClick={() => {
                addParticipant(currentConversation.id, "asd");
              }}
              className="px-4 py-2 bg-accent text-white rounded w-full"
            >
              Add User
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatWindow: React.FC = () => {
  const { messages, currentConversation, fetchMessages, addMessage } =
    useChatStore();
  const { user } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (currentConversation) {
        await fetchMessages(currentConversation.id);
      }
    };
    load();
  }, [currentConversation, fetchMessages, user?.languageId]);

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
  const conversationTitle = currentConversation.isGroup
    ? currentConversation.name
    : currentConversation.participants.find((p) => p.user.id !== user?.id)?.user
        .displayName;

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b border-accent flex-shrink-0 bg-bg flex justify-between items-center">
        <h2 className="text-xl font-semibold truncate text-text">
          {conversationTitle}
        </h2>
        {currentConversation.isGroup && (
          <button
            onClick={() => setShowGroupInfo(true)}
            className="text-text focus:outline-none"
          >
            Group Info
          </button>
        )}
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

      {showGroupInfo && currentConversation.isGroup && (
        <GroupInfoModal onClose={() => setShowGroupInfo(false)} />
      )}
    </div>
  );
};

export default ChatWindow;
