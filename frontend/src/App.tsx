import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./store/userStore";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import ChatInterface from "./components/ChatInterface";
import Friends from "./components/Friends";
import { useAppStore } from "./store/appStore";
import Settings from "./components/Settings";
import ThemeToggle from "./components/ThemeToggle";
import { useChatStore } from "./store/chatStore";

const RoutesHandler = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Navigate to="/chat" />} />
      <Route path="/chat" element={<ChatInterface />} />
      <Route path="/chat/:conversationId" element={<ChatInterface />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="*" element={<Navigate to="/" replace />} />{" "}
    </Routes>
  );
};

const NavButton = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`px-2 py-1 rounded transition-colors duration-200 items-center text-center ${
        isActive ? "bg-accent text-white" : "text-text bg-secondary-bg"
      }`}
    >
      {label}
    </Link>
  );
};

const App = () => {
  const { isMobileView, setIsMobileView } = useAppStore();
  const { user, isAuthenticated, checkAuth, fetchLanguages } = useUserStore();
  const { currentConversation } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobileView]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      await checkAuth();
      await fetchLanguages();

      setIsLoading(false);
    };

    load();
  }, [checkAuth, fetchLanguages]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <div className="h-screen w-screen flex bg-bg">
        {!isMobileView && (
          <div className="bg-bg border-r border-accent shadow-sm w-20 flex flex-col items-center py-4 h-full justify-between">
            <div className="flex flex-col gap-4">
              <NavButton to="/chat" label="Chat" />
              <NavButton to="/friends" label="Friends" />
              <ThemeToggle />
            </div>

            {user && (
              <button onClick={() => setIsSettingsOpen(true)}>
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full border-2 border-accent hover:opacity-80 transition"
                />
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-hidden relative">
          <RoutesHandler />
        </div>

        {isSettingsOpen && (
          <Settings onClose={() => setIsSettingsOpen(false)} />
        )}

        {!currentConversation && isMobileView && (
          <div className="bg-bg border-t border-accent shadow-sm h-20 flex items-center py-4 w-full justify-between fixed bottom-0 left-0 z-40 px-4">
            <div className="flex gap-4">
              <NavButton to="/chat" label="Chat" />
              <NavButton to="/friends" label="Friends" />
              <ThemeToggle />
            </div>

            {user && (
              <button onClick={() => setIsSettingsOpen(true)}>
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full border-2 border-accent hover:opacity-80 transition"
                />
              </button>
            )}
          </div>
        )}

        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
};

export default App;
