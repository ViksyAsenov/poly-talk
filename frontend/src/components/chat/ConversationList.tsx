import { useState, useEffect } from "react";
import { useChatStore } from "../../store/chatStore";
import { Conversation } from "../../types/chat";
import { formatDistanceToNow } from "date-fns";
import { useUserStore } from "../../store/userStore";

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

  console.log(user);
  console.log(conversation);

  const displayName = conversation.isGroup
    ? conversation.name
    : conversation.participants.find((p) => p.user.id !== user?.id)?.user
        .displayName;

  return (
    <div
      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-primary-50" : ""
      }`}
      onClick={() => onSelect(conversation)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{displayName}</h3>
          {conversation.preview && (
            <p className="text-sm text-gray-500 truncate max-w-[200px]">
              {conversation.preview}
            </p>
          )}
        </div>

        {conversation.lastActivity && (
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(conversation.lastActivity), {
              addSuffix: true,
            })}
          </span>
        )}
      </div>
    </div>
  );
};

const ConversationList: React.FC = () => {
  const {
    conversations,
    currentConversation,
    fetchConversations,
    setCurrentConversation,
  } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      fetchConversations();
      setIsLoading(false);
    };

    load();
  }, [fetchConversations]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto border-r">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={currentConversation?.id === conversation.id}
          onSelect={setCurrentConversation}
        />
      ))}
    </div>
  );
};

export default ConversationList;
