import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { Message } from "../../types/chat";
import { useUserStore } from "../../store/userStore";
import { useSocket } from "../../hooks/useSocket";
import { socket } from "../../api/socket";
import { useAppStore } from "../../store/appStore";

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
        <div className="text-sm break-all">{message.displayContent}</div>
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

const GroupInfoModal = ({ onClose }: { onClose: () => void }) => {
  const { user, friends, fetchFriends } = useUserStore();
  const {
    currentConversation,
    changeGroupConversationName,
    addParticipant,
    removeParticipant,
    makeParticipantAdmin,
  } = useChatStore();

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const [newName, setNewName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setNewName(currentConversation?.name ?? "");
  }, [currentConversation]);

  const isAdmin = currentConversation?.participants.find(
    (p) => p.user.id === user?.id
  )?.isAdmin;

  const participantIds =
    currentConversation?.participants.map((p) => p.user.id) ?? [];
  const nonParticipantFriends = friends.filter(
    (f) => !participantIds.includes(f.id)
  );

  const filteredFriends = nonParticipantFriends.filter((f) =>
    f.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-secondary-bg rounded-lg shadow-lg p-6 w-full max-w-lg relative mx-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray hover:text-gray-hover text-lg"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold mb-6 text-text">Group Info</h1>

        {isAdmin && (
          <div className="mb-6">
            <label className="block text-secondary-text mb-1 font-medium">
              Group Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-bg rounded-lg bg-bg text-text focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Group Name"
            />
            <button
              onClick={() => {
                changeGroupConversationName(currentConversation.id, newName);
              }}
              className="w-full mt-2 bg-accent text-white py-2 rounded-lg font-medium hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Change Name
            </button>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-text">Participants</h2>
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {currentConversation?.participants.map((participant) => {
              const isMe = participant.user.id === user?.id;
              const isParticipantAdmin = participant.isAdmin;

              return (
                <li
                  key={participant.user.id}
                  className="flex justify-between items-center px-3 py-2 bg-bg rounded-lg text-sm"
                >
                  <div className="text-text">
                    <span className="font-medium">
                      {participant.user.displayName}
                    </span>
                    {isParticipantAdmin && (
                      <span className="ml-2 text-xs text-accent font-semibold">
                        (Admin)
                      </span>
                    )}
                  </div>

                  {isAdmin && !isMe && (
                    <div className="flex gap-2">
                      {!isParticipantAdmin && (
                        <button
                          onClick={() =>
                            makeParticipantAdmin(
                              currentConversation.id,
                              participant.user.id
                            )
                          }
                          className="text-accent hover:text-accent-hover text-sm"
                        >
                          Promote
                        </button>
                      )}
                      <button
                        onClick={() =>
                          removeParticipant(
                            currentConversation.id,
                            participant.user.id
                          )
                        }
                        className="text-red hover:text-red-hover text-sm"
                      >
                        Kick
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {isAdmin && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-text">
              Add Friends
            </h2>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mb-3 px-3 py-2 border border-secondary-bg rounded-lg bg-bg text-text focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Search friends..."
            />

            {filteredFriends.length === 0 ? (
              <p className="text-secondary-text text-sm">No friends found.</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {filteredFriends.map((friend) => (
                  <li
                    key={friend.id}
                    className="flex justify-between items-center px-3 py-2 bg-bg rounded-lg text-sm"
                  >
                    <span className="text-text">{friend.displayName}</span>
                    <button
                      onClick={() =>
                        addParticipant(currentConversation.id, friend.id)
                      }
                      className="text-accent hover:text-accent-hover text-sm"
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ChatWindow = () => {
  const navigate = useNavigate();
  const { isMobileView } = useAppStore();
  const {
    messages,
    currentConversation,
    fetchMessages,
    addMessage,
    setCurrentConversation,
  } = useChatStore();
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

  const handleBack = () => {
    navigate("/chat", { replace: true });
    setCurrentConversation(null);
  };

  if (!currentConversation) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <p className="text-secondary-text mb-2">No conversation selected</p>
          <p className="text-secondary-text text-sm">
            Select a conversation from the list to start chatting
          </p>
        </div>
      </div>
    );
  }
  const conversationTitle = currentConversation.isGroup
    ? currentConversation.name
    : currentConversation.participants.find((p) => p.user.id !== user?.id)?.user
        .displayName;

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b border-accent flex-shrink-0 bg-bg flex justify-between items-center">
        <div className="flex text-xl font-semibold truncate text-text">
          {isMobileView && currentConversation && (
            <button
              className="flex items-center text-accent hover:text-accent-hover mr-2"
              onClick={handleBack}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          {conversationTitle}
        </div>
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
          <div className="h-full flex items-center justify-center">
            <p className="text-secondary-text text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
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
