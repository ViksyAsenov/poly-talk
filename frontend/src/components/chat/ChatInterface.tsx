import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import ConversationList from "./ConversationList";
import { useChatStore } from "../../store/chatStore";
import { useAppStore } from "../../store/appStore";
import { useUserStore } from "../../store/userStore";

const ChatInterface = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { isMobileView } = useAppStore();
  const { user } = useUserStore();
  const {
    currentConversation,
    setCurrentConversation,
    conversations,
    fetchConversations,
  } = useChatStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchConversations();
    };

    load();
  }, [fetchConversations, user?.languageId]);

  useEffect(() => {
    const initializeChat = async () => {
      if (conversations.length === 0 || isMobileView || !isInitialLoad) return;

      const conversation = conversationId
        ? conversations.find((c) => c.id === conversationId)
        : null;

      if (conversation) {
        setCurrentConversation(conversation);
      } else if (isInitialLoad) {
        navigate(`/chat/${conversations[0].id}`, { replace: true });
      }

      setIsInitialLoad(false);
    };

    initializeChat();
  }, [
    conversations,
    conversationId,
    setCurrentConversation,
    navigate,
    isInitialLoad,
    isMobileView,
  ]);

  useEffect(() => {
    if (currentConversation && !isInitialLoad) {
      navigate(`/chat/${currentConversation.id}`, { replace: true });
    }
  }, [currentConversation, isMobileView, navigate, isInitialLoad]);

  return (
    <div className="h-screen w-full bg-secondary-bg overflow-hidden">
      <div className="mx-auto h-full flex">
        {(!isMobileView || !currentConversation) && (
          <div
            className={`${
              isMobileView ? "w-full" : "w-80"
            } h-full flex-shrink-0`}
          >
            <ConversationList />
          </div>
        )}

        {(!isMobileView || currentConversation) && (
          <div className="flex-1 h-full flex flex-col">
            <div className="flex-1 flex flex-col overflow-hidden">
              <ChatWindow />
            </div>

            <div className="flex-shrink-0">
              <ChatInput />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
