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
import Settings from "./components/Settings";
import { useAppStore } from "./store/appStore";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Navigate to="/chat" />} />
      <Route path="/chat" element={<ChatInterface />} />
      <Route path="/chat/:conversationId" element={<ChatInterface />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/settings" element={<Settings />} />
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
      className={`mb-2 px-2 py-1 rounded transition-colors duration-200 ${
        isActive ? "bg-accent text-white" : "text-text hover:bg-secondary-bg"
      }`}
    >
      {label}
    </Link>
  );
};

const App = () => {
  const { isMobileView, setIsMobileView } = useAppStore();
  const { isAuthenticated, checkAuth, fetchLanguages } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

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
        <div className="bg-bg border-r border-secondary-bg shadow-sm w-20 flex flex-col items-center py-4 h-full justify-center space-y-6">
          <NavButton to="/chat" label="Chat" />
          <NavButton to="/friends" label="Friends" />
          <NavButton to="/settings" label="Settings" />
        </div>

        <div className="flex-1 overflow-hidden relative">
          <AnimatedRoutes />
        </div>

        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
};

export default App;
