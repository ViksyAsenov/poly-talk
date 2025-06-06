import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useChatStore } from "../../store/chatStore";
import { Conversation } from "../../types/chat";
import { useUserStore } from "../../store/userStore";
import { useAppStore } from "../../store/appStore";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (conversation: Conversation) => void;
}

const ConversationItem = ({
  conversation,
  isSelected,
  onSelect,
}: ConversationItemProps) => {
  const { user } = useUserStore();

  const displayName = conversation.isGroup
    ? conversation.name
    : conversation.participants.find((p) => p.user.id !== user?.id)?.user
        .displayName;

  const profilePicture = conversation.isGroup
    ? (conversation.name ?? "").slice(0, 2)
    : conversation.participants.find((p) => p.user.id !== user?.id)?.user
        .avatar;

  return (
    <div
      onClick={() => onSelect(conversation)}
      className={`flex items-center px-4 py-3 cursor-pointer 
        hover:bg-secondary-bg transition-colors
        ${isSelected ? "bg-secondary-bg" : "bg-bg"}`}
    >
      {conversation.isGroup ? (
        <div className="w-12 h-12 rounded-full bg-accent bg-opacity-20 flex items-center justify-center flex-shrink-0 text-white font-medium">
          {profilePicture || "G"}
        </div>
      ) : (
        <img
          src={profilePicture ?? ""}
          alt={displayName ?? ""}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
      )}

      <div className="ml-3 flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-text truncate">{displayName}</h3>
          {conversation.lastActivity && (
            <span className="text-xs text-secondary-text ml-2 whitespace-nowrap">
              {formatDistanceToNow(new Date(conversation.lastActivity), {
                addSuffix: true,
              })}
            </span>
          )}
        </div>
        {conversation.preview && (
          <p className="text-sm text-secondary-text truncate">
            {conversation.preview}
          </p>
        )}
      </div>
    </div>
  );
};

const ConversationList = () => {
  const navigate = useNavigate();
  const { isMobileView } = useAppStore();
  const { conversations, currentConversation, setCurrentConversation } =
    useChatStore();

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    navigate(`/chat/${conversation.id}`, { replace: true });
  };

  return (
    <div
      className={`flex flex-col h-full  ${
        isMobileView ? "" : "border-r border-accent"
      }`}
    >
      <div className="p-4 border-b border-accent bg-bg flex-shrink-0">
        <h3 className="text-lg font-semibold text-text">Conversations</h3>
      </div>

      <div className="flex-1 overflow-y-auto bg-bg">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <p className="text-secondary-text text-center">
              No conversations yet
            </p>
            <p className="text-secondary-text text-sm text-center mt-2">
              Add friends to start chatting
            </p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={currentConversation?.id === conversation.id}
              onSelect={handleSelectConversation}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
