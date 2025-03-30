import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./store/userStore";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import ChatInterface from "./components/ChatInterface";
import Friends from "./components/Friends";
import Settings from "./components/Settings";
import { pageTransition } from "./utils/animations";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        {...pageTransition}
        className="h-full w-full absolute"
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/chat" />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/chat/:conversationId" element={<ChatInterface />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
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
  const { isAuthenticated, checkAuth, fetchLanguages } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

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
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
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
