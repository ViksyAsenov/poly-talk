import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./store/userStore";
import Login from "./components/Login";
import ChatInterface from "./components/ChatInterface";
import Settings from "./components/Settings";
import Friends from "./components/Friends";

export const App = () => {
  const { isAuthenticated, checkAuth, fetchLanguages } = useUserStore();
  const [currentPage, setCurrentPage] = useState<
    "chat" | "friends" | "settings"
  >("chat");
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">PolyTalk</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setCurrentPage("chat")}
                  className={`${
                    currentPage === "chat"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setCurrentPage("friends")}
                  className={`${
                    currentPage === "friends"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Friends
                </button>
                <button
                  onClick={() => setCurrentPage("settings")}
                  className={`${
                    currentPage === "settings"
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {(() => {
            switch (currentPage) {
              case "chat":
                return <ChatInterface />;
              case "friends":
                return <Friends />;
              case "settings":
                return <Settings />;
              default:
                return <div>Page not found</div>;
            }
          })()}
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};
