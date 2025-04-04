import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { chatApi } from "../api/client";
import {
  FriendRequestReceived,
  FriendRequestSent,
  IMinUser,
} from "../types/user";
import {
  UserCircle,
  Search,
  X,
  Plus,
  Clock,
  MessageSquare,
  UserMinus,
  Users,
  Settings,
  Bell,
  Filter,
  ChevronDown,
  Check,
} from "lucide-react";

// Friend card with expanded functionality
const FriendItem = ({
  friend,
  onSelect,
  isSelected,
}: {
  friend: IMinUser;
  onSelect: (id: string) => void;
  isSelected: boolean;
}) => {
  const { removeFriend } = useUserStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const messageFriend = async (id: string) => {
    const response = await chatApi.createDirectConversation(id);
    const { success, data } = response.data;
    if (success) {
      navigate(`/chat/${data.id}`);
    }
  };

  // Simulate last seen status randomly for demo
  const getRandomStatus = () => {
    const statuses = ["Active now", "5m ago", "1h ago", "Yesterday"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  return (
    <div
      className={`mb-2 rounded-md transition-all duration-200 ${
        isSelected
          ? "border-l-4 border-l-accent"
          : "border-l-4 border-l-transparent"
      }`}
    >
      <div className="flex items-center justify-between p-3 bg-bg hover:bg-secondary-bg rounded-r-md">
        <div className="flex items-center flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(friend.id)}
            className="mr-3 h-4 w-4 accent-accent"
          />
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-secondary-bg flex items-center justify-center text-text overflow-hidden">
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
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-bg"></div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-text truncate">
                {friend.displayName}
              </h3>
              <span className="text-xs text-secondary-text">
                {getRandomStatus()}
              </span>
            </div>
            <p className="text-sm text-secondary-text truncate">{friend.tag}</p>
          </div>
        </div>

        <div className="flex">
          <button
            onClick={() => messageFriend(friend.id)}
            className="text-secondary-text hover:text-accent p-2 rounded-full transition-colors"
            title="Message"
          >
            <MessageSquare size={18} />
          </button>
          <button
            onClick={() => removeFriend(friend.id)}
            className="text-secondary-text hover:text-red p-2 rounded-full transition-colors"
            title="Remove Friend"
          >
            <UserMinus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Consistent request item with improved status indicators
const RequestItem = ({
  request,
  type,
}: {
  request: FriendRequestReceived | FriendRequestSent;
  type: "received" | "sent";
}) => {
  const { acceptFriendRequest, rejectFriendRequest } = useUserStore();
  const user =
    type === "received" && "sender" in request
      ? request.sender
      : "receiver" in request
      ? request.receiver
      : null;

  // Get relative time for the request
  const getRequestTime = () => {
    const times = ["Just now", "5m ago", "2h ago", "Yesterday"];
    return times[Math.floor(Math.random() * times.length)];
  };

  if (user === null) {
    return <div>empty</div>;
  }

  return (
    <div className="mb-2 rounded-md bg-bg hover:bg-secondary-bg transition-all duration-200">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-secondary-bg flex items-center justify-center text-text overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              user.displayName?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-text truncate">
                {user.displayName}
              </h3>
              <span className="text-xs text-secondary-text">
                {getRequestTime()}
              </span>
            </div>
            <p className="text-sm text-secondary-text truncate">@{user.tag}</p>
          </div>
        </div>

        {type === "received" ? (
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => acceptFriendRequest(request.id)}
              className="bg-accent text-white px-3 py-1 rounded-md text-sm hover:bg-accent-hover transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => rejectFriendRequest(request.id)}
              className="bg-secondary-bg text-secondary-text px-3 py-1 rounded-md text-sm hover:bg-gray-hover transition-colors"
            >
              Reject
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-xs text-secondary-text flex items-center">
              <Clock size={14} className="mr-1" /> Pending
            </span>
            <button
              className="ml-2 text-secondary-text hover:text-red p-1 rounded-full transition-colors"
              title="Cancel Request"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for friend statistics card
const FriendStats = ({ friends }: { friends: IMinUser[] }) => {
  return (
    <div className="bg-bg p-4 rounded-md shadow-sm border border-secondary-bg">
      <h3 className="text-sm font-medium text-secondary-text mb-3">
        FRIEND STATS
      </h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2">
          <p className="text-2xl font-semibold text-text">{friends.length}</p>
          <p className="text-xs text-secondary-text">Total Friends</p>
        </div>
        <div className="p-2">
          <p className="text-2xl font-semibold text-accent">3</p>
          <p className="text-xs text-secondary-text">Online Now</p>
        </div>
        <div className="p-2">
          <p className="text-2xl font-semibold text-gray">5</p>
          <p className="text-xs text-secondary-text">In Groups</p>
        </div>
      </div>
    </div>
  );
};

// Empty state component with action
const EmptyState = ({
  message,
  actionText,
  onAction,
}: {
  message: string;
  actionText?: string;
  onAction?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
    <div className="w-16 h-16 mb-4 rounded-full bg-secondary-bg flex items-center justify-center">
      <Users size={24} className="text-secondary-text" />
    </div>
    <p className="text-secondary-text mb-4">{message}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="text-accent hover:underline text-sm"
      >
        {actionText}
      </button>
    )}
  </div>
);

const SearchBar = ({ placeholder }: { placeholder: string }) => {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-text"
      />
      <input
        type="text"
        placeholder={placeholder}
        className="pl-9 pr-3 py-2 w-full bg-secondary-bg border-0 rounded-md text-sm focus:ring-1 focus:ring-accent focus:outline-none"
      />
    </div>
  );
};

const Friends = () => {
  const [tag, setTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState<"all" | "online" | "recent">("all");
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

  const createGroup = async (groupName: string, participantIds: string[]) => {
    const response = await chatApi.createGroupConversation(
      groupName,
      participantIds
    );

    const { success, data } = response.data;

    if (success) {
      navigate(`/chat/${data.id}`);
      setSelectedFriends([]);
      setGroupName("");
    }
  };

  const selectAllFriends = () => {
    if (selectedFriends.length === friends.length) {
      setSelectedFriends([]);
    } else {
      setSelectedFriends(friends.map((f) => f.id));
    }
  };

  const requestsCount =
    pendingFriendRequests.received.length + pendingFriendRequests.sent.length;

  return (
    <div className="h-screen w-full bg-secondary-bg flex flex-col overflow-hidden">
      {/* Header with user info and actions */}
      <div className="bg-bg shadow-sm z-10 flex justify-between items-center px-4 py-3 border-b border-secondary-bg">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-text mr-3">Friends</h1>
          <span className="bg-accent bg-opacity-10 text-accent text-xs px-2 py-0.5 rounded-full">
            {friends.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-secondary-text hover:bg-secondary-bg rounded-full">
            <Bell size={18} />
          </button>
          <button className="p-2 text-secondary-text hover:bg-secondary-bg rounded-full">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search and filters */}
          <div className="p-4 bg-bg border-b border-secondary-bg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 max-w-md">
                <SearchBar placeholder="Search friends..." />
              </div>
              <div className="flex ml-4">
                <button
                  className="flex items-center text-sm text-secondary-text hover:text-text px-3 py-1.5 rounded-md bg-secondary-bg"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter size={14} className="mr-1.5" />
                  Filter
                  <ChevronDown size={14} className="ml-1.5" />
                </button>

                {selectedFriends.length > 0 && (
                  <button
                    onClick={selectAllFriends}
                    className="ml-2 px-3 py-1.5 text-sm bg-secondary-bg text-secondary-text hover:text-text rounded-md"
                  >
                    Deselect All
                  </button>
                )}
              </div>
            </div>

            {filterOpen && (
              <div className="flex space-x-2 mb-2">
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    view === "all"
                      ? "bg-accent text-white"
                      : "bg-secondary-bg text-secondary-text"
                  }`}
                  onClick={() => setView("all")}
                >
                  All Friends
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    view === "online"
                      ? "bg-accent text-white"
                      : "bg-secondary-bg text-secondary-text"
                  }`}
                  onClick={() => setView("online")}
                >
                  Online
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    view === "recent"
                      ? "bg-accent text-white"
                      : "bg-secondary-bg text-secondary-text"
                  }`}
                  onClick={() => setView("recent")}
                >
                  Recent
                </button>
              </div>
            )}
          </div>

          {/* Action banner for selected friends */}
          {selectedFriends.length > 0 && (
            <div className="bg-accent bg-opacity-10 px-4 py-2 flex justify-between items-center">
              <div className="text-sm text-accent">
                <span className="font-medium">{selectedFriends.length}</span>{" "}
                friends selected
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 text-sm bg-secondary-bg text-text rounded-md hover:bg-gray-hover"
                  onClick={selectAllFriends}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 text-sm bg-accent text-white rounded-md hover:bg-accent-hover"
                  onClick={() => {
                    // Open create group modal or section
                    document.getElementById("group-name-input")?.focus();
                  }}
                >
                  Create Group
                </button>
              </div>
            </div>
          )}

          {/* Friends list */}
          <div className="flex-1 overflow-y-auto p-4">
            {friends.length === 0 ? (
              <EmptyState
                message="You don't have any friends yet"
                actionText="Find Friends"
                onAction={() =>
                  document.getElementById("add-friend-input")?.focus()
                }
              />
            ) : (
              <div>
                {/* Optional section heading */}
                {friends.length > 0 && (
                  <h2 className="text-xs font-medium text-secondary-text mb-2 uppercase tracking-wider pl-1">
                    All Friends ({friends.length})
                  </h2>
                )}

                {friends.map((friend) => (
                  <FriendItem
                    key={friend.id}
                    friend={friend}
                    onSelect={toggleFriendSelection}
                    isSelected={selectedFriends.includes(friend.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-80 border-l border-secondary-bg bg-bg flex flex-col overflow-hidden">
          {/* Add Friend section */}
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
                className="flex-1 p-2 bg-secondary-bg border-0 rounded-l-md text-text focus:ring-1 focus:ring-accent focus:outline-none"
              />
              <button
                onClick={handleSendRequest}
                className="bg-accent text-white px-3 py-2 rounded-r-md hover:bg-accent-hover disabled:bg-secondary-text disabled:opacity-50"
                disabled={isLoading || !tag}
              >
                <Plus size={18} />
              </button>
            </div>
            <p className="text-xs text-secondary-text">
              Your tag: <span className="text-accent">{user?.tag}</span>
            </p>
          </div>

          {/* Create Group section (if friends selected) */}
          {selectedFriends.length > 0 && (
            <div className="p-4 border-b border-secondary-bg bg-secondary-bg bg-opacity-50">
              <h2 className="text-sm font-medium text-secondary-text mb-3 uppercase tracking-wider">
                Create Group
              </h2>
              <div className="mb-3">
                <input
                  id="group-name-input"
                  type="text"
                  placeholder="Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full p-2 bg-secondary-bg border-0 rounded-md focus:ring-1 focus:ring-accent focus:outline-none"
                />
              </div>
              <div className="mb-2 text-xs text-secondary-text flex justify-between">
                <span>Selected:</span>
                <span className="text-accent">
                  {selectedFriends.length} friends
                </span>
              </div>
              <button
                onClick={() => createGroup(groupName, selectedFriends)}
                className={`w-full py-2 rounded-md transition text-sm font-medium flex items-center justify-center ${
                  !groupName || selectedFriends.length === 0
                    ? "bg-secondary-bg text-secondary-text cursor-not-allowed"
                    : "bg-accent text-white hover:bg-accent-hover"
                }`}
                disabled={!groupName || selectedFriends.length === 0}
              >
                <Users size={16} className="mr-2" />
                Create Group Chat
              </button>
            </div>
          )}

          {/* Friend Requests section */}
          <div className="flex-1 overflow-y-auto">
            {/* Friend stats */}
            <div className="p-4">
              <FriendStats friends={friends} />
            </div>

            {/* Pending requests section */}
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

              {/* Received requests */}
              {pendingFriendRequests.received.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs text-secondary-text mb-2 flex items-center">
                    <ChevronDown size={14} className="mr-1" />
                    Received ({pendingFriendRequests.received.length})
                  </h3>
                  {pendingFriendRequests.received.map((request) => (
                    <RequestItem
                      key={request.id}
                      request={request}
                      type="received"
                    />
                  ))}
                </div>
              )}

              {/* Sent requests */}
              {pendingFriendRequests.sent.length > 0 && (
                <div>
                  <h3 className="text-xs text-secondary-text mb-2 flex items-center">
                    <ChevronDown size={14} className="mr-1" />
                    Sent ({pendingFriendRequests.sent.length})
                  </h3>
                  {pendingFriendRequests.sent.map((request) => (
                    <RequestItem
                      key={request.id}
                      request={request}
                      type="sent"
                    />
                  ))}
                </div>
              )}

              {/* Empty state for requests */}
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
    </div>
  );
};

export default Friends;
