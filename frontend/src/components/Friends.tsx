import { useState, useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { IMinUser } from "../types/user";
import { motion } from "framer-motion";
import { pageTransition } from "../utils/animations";

const FriendItem = ({ friend }: { friend: IMinUser }) => {
  const { removeFriend } = useUserStore();

  return (
    <div className="flex items-center justify-between p-4 border-b border-secondary-bg">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-secondary-bg flex items-center justify-center text-text overflow-hidden">
          {friend.avatar ? (
            <img
              src={friend.avatar}
              alt={friend.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            friend.displayName?.charAt(0).toUpperCase()
          )}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-text">{friend.displayName}</h3>
          <p className="text-sm text-secondary-text">{friend.tag}</p>
        </div>
      </div>
      <button
        onClick={() => removeFriend(friend.id)}
        className="text-error hover:bg-error hover:bg-opacity-10 px-3 py-1 rounded-md text-sm"
      >
        Remove
      </button>
    </div>
  );
};

const FriendRequestItem = ({ request }: { request: any }) => {
  const { acceptFriendRequest, rejectFriendRequest } = useUserStore();

  return (
    <div className="flex items-center justify-between p-4 border-b border-secondary-bg">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-secondary-bg flex items-center justify-center text-text overflow-hidden">
          {request.sender.avatar ? (
            <img
              src={request.sender.avatar}
              alt={request.sender.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            request.sender.displayName?.charAt(0).toUpperCase()
          )}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-text">
            {request.sender.displayName}
          </h3>
          <p className="text-sm text-secondary-text">@{request.sender.tag}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => acceptFriendRequest(request.id)}
          className="bg-accent text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
        >
          Accept
        </button>
        <button
          onClick={() => rejectFriendRequest(request.id)}
          className="bg-secondary-bg text-text px-3 py-1 rounded-md text-sm hover:bg-gray-300"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

const SentRequestItem = ({ request }: { request: any }) => (
  <div className="flex items-center justify-between p-4 border-b border-secondary-bg">
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-secondary-bg flex items-center justify-center text-text overflow-hidden">
        {request.receiver.avatar ? (
          <img
            src={request.receiver.avatar}
            alt={request.receiver.displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          request.receiver.displayName?.charAt(0).toUpperCase()
        )}
      </div>
      <div className="ml-3">
        <h3 className="font-medium text-text">
          {request.receiver.displayName}
        </h3>
        <p className="text-sm text-secondary-text">@{request.receiver.tag}</p>
      </div>
    </div>
    <div className="flex space-x-2">
      <span className="text-sm text-secondary-text italic">Pending</span>
    </div>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <p className="text-secondary-text">{message}</p>
  </div>
);

const Friends = () => {
  const [tag, setTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const {
    friends,
    pendingFriendRequests,
    fetchFriends,
    fetchPendingFriendRequests,
    sendFriendRequest,
  } = useUserStore();

  useEffect(() => {
    fetchFriends();
    fetchPendingFriendRequests();
  }, [fetchFriends, fetchPendingFriendRequests]);

  const handleSendRequest = async () => {
    if (!tag) return;

    setIsLoading(true);
    try {
      await sendFriendRequest(tag);
      setTag("");
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      {...pageTransition}
      className="p-6 bg-bg flex-1 overflow-y-auto"
    >
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-text">Friends</h1>

        <div className="bg-secondary-bg rounded-lg shadow mb-6 border border-secondary-bg">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2 text-text">Add Friend</h2>
            <p className="text-sm text-secondary-text mb-4">
              Enter a friend's tag to send them a friend request
            </p>
            <div className="flex">
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Enter username#tag"
                className="flex-1 px-3 py-2 border border-secondary-bg rounded-l-lg bg-bg focus:outline-none focus:ring-2 focus:ring-accent text-text"
              />
              <button
                onClick={handleSendRequest}
                disabled={!tag || isLoading}
                className="bg-accent text-white px-4 py-2 rounded-r-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-secondary-bg rounded-lg shadow border border-secondary-bg">
          <div className="flex border-b border-secondary-bg">
            <button
              onClick={() => setActiveTab("friends")}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "friends"
                  ? "text-accent border-b-2 border-accent"
                  : "text-secondary-text hover:bg-gray-200"
              }`}
            >
              Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "requests"
                  ? "text-accent border-b-2 border-accent"
                  : "text-secondary-text hover:bg-gray-200"
              }`}
            >
              Requests (
              {pendingFriendRequests.received.length +
                pendingFriendRequests.sent.length}
              )
            </button>
          </div>

          {activeTab === "friends" ? (
            <div key="friends" className="max-h-96 overflow-y-auto">
              {friends.length === 0 ? (
                <EmptyState message="You don't have any friends yet. Add some friends to get started!" />
              ) : (
                friends.map((friend) => (
                  <FriendItem key={friend.id} friend={friend} />
                ))
              )}
            </div>
          ) : (
            <div key="requests" className="max-h-96 overflow-y-auto">
              {pendingFriendRequests.received.length === 0 &&
              pendingFriendRequests.sent.length === 0 ? (
                <EmptyState message="You don't have any pending friend requests." />
              ) : (
                <>
                  {pendingFriendRequests.received.length > 0 && (
                    <div className="p-2 bg-gray-100">
                      <h3 className="text-sm font-medium text-secondary-text px-2">
                        Received Requests
                      </h3>
                    </div>
                  )}
                  {pendingFriendRequests.received.map((request) => (
                    <FriendRequestItem key={request.id} request={request} />
                  ))}

                  {pendingFriendRequests.sent.length > 0 && (
                    <div className="p-2 bg-gray-100">
                      <h3 className="text-sm font-medium text-secondary-text px-2">
                        Sent Requests
                      </h3>
                    </div>
                  )}
                  {pendingFriendRequests.sent.map((request) => (
                    <SentRequestItem key={request.id} request={request} />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Friends;
