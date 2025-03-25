import { useState, useMemo, useEffect } from "react";
import { chatApi } from "../api/client";
import toast from "react-hot-toast";
import { useUserStore } from "../store/userStore";

export const Friends = () => {
  const {
    user,
    friends,
    pendingFriendRequests,
    sendFriendRequest,
    removeFriend,
    acceptFriendRequest,
    rejectFriendRequest,
    fetchFriends,
    fetchPendingFriendRequests,
  } = useUserStore();
  const [friendTag, setFriendTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");

  useEffect(() => {
    fetchFriends();
    fetchPendingFriendRequests();
  }, [fetchFriends, fetchPendingFriendRequests]);

  const handleStartDirectConversation = async (friendId: string) => {
    try {
      const response = await chatApi.createDirectConversation(friendId);
      const { data } = response.data;
      window.location.href = `/chat/${data.id}`;
    } catch (error) {
      toast.error("Failed to start conversation");
    }
  };

  const filteredFriends = useMemo(() => {
    return friends.filter(
      (friend) =>
        friend.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [friends, searchTerm]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Friends</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <div>{user?.tag}</div>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={friendTag}
            onChange={(e) => setFriendTag(e.target.value)}
            placeholder="Enter friend's tag (e.g., username#1234)"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={async () => {
              await sendFriendRequest(friendTag);
              setFriendTag("");
            }}
          >
            Add Friend
          </button>
        </div>
      </div>

      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab("friends")}
          className={`px-4 py-2 ${
            activeTab === "friends"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          } mr-2 rounded`}
        >
          Friends
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 ${
            activeTab === "requests"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          } rounded`}
        >
          Friend Requests
        </button>
      </div>

      {activeTab === "friends" && (
        <div className="bg-white shadow rounded-lg p-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search friends..."
            className="w-full mb-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />

          <div className="space-y-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={friend.avatar || "/default-avatar.png"}
                    alt={friend.displayName}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{friend.displayName}</div>
                    <div className="text-sm text-gray-500">{friend.tag}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStartDirectConversation(friend.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Message
                  </button>
                  <button
                    onClick={() => removeFriend(friend.id)}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {filteredFriends.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                {searchTerm ? "No friends match your search" : "No friends yet"}
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "requests" && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Received Requests</h3>
          <div className="space-y-4">
            {pendingFriendRequests.received.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={request.sender.avatar || "/default-avatar.png"}
                    alt={request.sender.displayName}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">
                      {request.sender.displayName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.sender.tag}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => acceptFriendRequest(request.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectFriendRequest(request.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingFriendRequests.received.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No pending friend requests
              </p>
            )}
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-4">Sent Requests</h3>
          <div className="space-y-4">
            {pendingFriendRequests.sent.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={request.receiver.avatar || "/default-avatar.png"}
                    alt={request.receiver.displayName}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">
                      {request.receiver.displayName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.receiver.tag}
                    </div>
                  </div>
                </div>
                <span className="text-gray-500 text-sm">Pending</span>
              </div>
            ))}
            {pendingFriendRequests.sent.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No sent friend requests
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
