import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { chatApi } from "../../api/client";
import { useAppStore } from "../../store/appStore";
import FriendRequest from "./FriendRequest";
import FriendItem from "./FriendItem";

const Friends = () => {
  const [tag, setTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { isMobileView } = useAppStore();
  const navigate = useNavigate();

  const {
    user,
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

  const toggleFriendSelection = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id)
        ? prev.filter((friendId) => friendId !== id)
        : [...prev, id]
    );
  };

  const deselectAllFriends = () => {
    setSelectedFriends([]);
  };

  const createGroup = async () => {
    if (!groupName || selectedFriends.length === 0) return;
    const response = await chatApi.createGroupConversation(
      groupName,
      selectedFriends
    );
    const { success, data } = response.data;
    if (success) {
      navigate(`/chat/${data.id}`);
    }
  };

  const requestsCount =
    pendingFriendRequests.received.length + pendingFriendRequests.sent.length;

  const filteredFriends = friends.filter((friend) =>
    friend.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`h-screen w-full flex ${
        isMobileView ? "flex-col" : ""
      } bg-secondary-bg overflow-hidden`}
    >
      <div className="flex-1 flex flex-col min-h-0">
        {selectedFriends.length > 0 && (
          <div className="sticky top-0 z-10 bg-secondary-bg px-4 py-2 border-b border-secondary-bg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="text-sm text-text mb-2 sm:mb-0">
                <span className="font-medium">{selectedFriends.length}</span>{" "}
                friend{selectedFriends.length > 1 && "s"} selected
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-3 py-1 text-sm bg-secondary-bg text-text rounded-md hover:bg-gray-hover"
                  onClick={deselectAllFriends}
                >
                  Deselect All
                </button>
                <input
                  id="group-name-input"
                  type="text"
                  placeholder="Group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="px-3 py-1 text-sm bg-secondary-bg text-text rounded-md border border-accent focus:outline-none"
                />
                <button
                  className="px-3 py-1 text-sm bg-accent text-white rounded-md hover:bg-accent-hover"
                  onClick={createGroup}
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-2 border-b border-secondary-bg">
          <input
            type="text"
            placeholder="Search friends"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 bg-secondary-bg rounded-md text-text border border-accent focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {friends.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <p className="text-secondary-text mb-4">
                You don't have any friends yet
              </p>

              <button
                onClick={() =>
                  document.getElementById("add-friend-input")?.focus()
                }
                className="text-accent hover:underline text-sm"
              >
                Find Friends
              </button>
            </div>
          ) : (
            <div>
              {filteredFriends.length > 0 && (
                <h2 className="text-xs font-medium text-secondary-text mb-2 uppercase tracking-wider pl-1">
                  All Friends ({filteredFriends.length})
                </h2>
              )}

              {filteredFriends.map((friend) => (
                <FriendItem
                  key={friend.id}
                  friend={friend}
                  onSelect={toggleFriendSelection}
                  isSelected={selectedFriends.includes(friend.id)}
                />
              ))}
              {filteredFriends.length === 0 && (
                <div className="text-center text-secondary-text text-sm">
                  No friends found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className={`w-80 border-l border-secondary-bg bg-bg flex flex-col overflow-hidden ${
          isMobileView ? "w-full border-t border-l-0 h-1/2" : "min-h-0"
        }`}
      >
        <div className="p-4 border-b border-secondary-bg">
          <h2 className="text-sm font-medium text-secondary-text mb-3 uppercase tracking-wider">
            Add Friend
          </h2>
          <div className="flex mb-2">
            <input
              id="add-friend-input"
              type="text"
              placeholder="Enter friend tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="flex-1 p-2 bg-secondary-bg rounded-l-md text-text border border-accent focus:outline-none"
            />
            <button
              onClick={handleSendRequest}
              className="bg-accent text-white px-3 py-2 rounded-r-md hover:bg-accent-hover disabled:bg-secondary-text disabled:opacity-50"
              disabled={isLoading || !tag}
            >
              +
            </button>
          </div>
          <p className="text-xs text-secondary-text">
            Your tag: <span className="text-accent">{user?.tag}</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-medium text-secondary-text uppercase tracking-wider">
                Friend Requests
              </h2>
              {requestsCount > 0 && (
                <span className="bg-accent bg-opacity-10 text-accent text-xs px-2 py-0.5 rounded-full">
                  {requestsCount}
                </span>
              )}
            </div>

            {pendingFriendRequests.received.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs text-secondary-text mb-2 flex items-center">
                  Received ({pendingFriendRequests.received.length})
                </h3>
                {pendingFriendRequests.received.map((request) => (
                  <div className="mb-2">
                    <FriendRequest
                      key={request.id}
                      request={request}
                      type="received"
                    />
                  </div>
                ))}
              </div>
            )}

            {pendingFriendRequests.sent.length > 0 && (
              <div>
                <h3 className="text-xs text-secondary-text mb-2 flex items-center">
                  Sent ({pendingFriendRequests.sent.length})
                </h3>
                {pendingFriendRequests.sent.map((request) => (
                  <div className="mb-2">
                    <FriendRequest
                      key={request.id}
                      request={request}
                      type="sent"
                    />
                  </div>
                ))}
              </div>
            )}

            {requestsCount === 0 && (
              <div className="text-center py-6">
                <p className="text-secondary-text text-sm">
                  No pending requests
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
