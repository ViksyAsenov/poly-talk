import ChatWindow from "./chat/ChatWindow";
import ChatInput from "./chat/ChatInput";
import ConversationList from "./chat/ConversationList";

const ChatInterface = () => {
  return (
    <div className="h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto h-full">
        <div className="flex h-full bg-white shadow-lg">
          <div className="w-80 flex-shrink-0">
            <ConversationList />
          </div>
          <div className="flex-1 flex flex-col">
            <ChatWindow />
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
