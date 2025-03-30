import ChatWindow from "./chat/ChatWindow";
import ChatInput from "./chat/ChatInput";
import ConversationList from "./chat/ConversationList";
import { useChatStore } from "../store/chatStore";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useParams, useNavigate } from "react-router-dom";

const ChatInterface = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const {
    currentConversation,
    setCurrentConversation,
    conversations,
    fetchConversations,
  } = useChatStore();
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const initializeChat = async () => {
      if (conversations.length === 0) return;

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
  ]);

  useEffect(() => {
    if (currentConversation && !isInitialLoad) {
      navigate(`/chat/${currentConversation.id}`, { replace: true });

      if (isMobileView) {
        setShowChatOnMobile(true);
      }
    }
  }, [currentConversation, isMobileView, navigate, isInitialLoad]);

  const handleBack = () => {
    setShowChatOnMobile(false);
  };

  return (
    <div className="h-screen w-full bg-secondary-bg overflow-hidden">
      <div className="mx-auto h-full flex">
        {(!isMobileView || !showChatOnMobile) && (
          <div className="w-80 h-full flex-shrink-0">
            <ConversationList />
          </div>
        )}

        {(!isMobileView || showChatOnMobile) && (
          <div className="flex-1 h-full flex flex-col">
            {isMobileView && showChatOnMobile && (
              <div className="p-2 border-b border-secondary-bg flex-shrink-0 bg-bg">
                <button
                  className="flex items-center text-secondary-text hover:text-text"
                  onClick={handleBack}
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-1" />
                  <span>Back</span>
                </button>
              </div>
            )}

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
