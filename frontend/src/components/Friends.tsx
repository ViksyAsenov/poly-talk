import { useState, useEffect } from "react";
import { useUserStore } from "../store/userStore";
import {
  FriendRequestReceived,
  FriendRequestSent,
  IMinUser,
} from "../types/user";
import { chatApi } from "../api/client";
import { useNavigate } from "react-router-dom";

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

  const messageFriend = async (id: string) => {
    const response = await chatApi.createDirectConversation(id);
    const { success, data } = response.data;
    if (success) {
      navigate(`/chat/${data.id}`);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-accent rounded-md bg-secondary-bg mb-2">
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
      <div className="flex gap-2 items-center">
        <button
          onClick={() => messageFriend(friend.id)}
          className="text-white bg-accent px-3 py-1 rounded-md text-sm hover:bg-accent-hover"
        >
          Message
        </button>
        <button
          onClick={() => removeFriend(friend.id)}
          className="text-white bg-red px-3 py-1 rounded-md text-sm hover:bg-red-hover"
        >
          Remove
        </button>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(friend.id)}
        />
      </div>
    </div>
  );
};

type RequestItemProps =
  | { request: FriendRequestReceived; type: "received" }
  | { request: FriendRequestSent; type: "sent" };

const RequestItem = ({ request, type }: RequestItemProps) => {
  const { acceptFriendRequest, rejectFriendRequest } = useUserStore();

  const user = type === "received" ? request.sender : request.receiver;

  return (
    <div className="flex items-center justify-between p-4 border rounded-md bg-secondary-bg mb-2">
      <div className="flex items-center">
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
        <div className="ml-3">
          <h3 className="font-medium text-text">{user.displayName}</h3>
          <p className="text-sm text-secondary-text">@{user.tag}</p>
        </div>
      </div>
      {type === "received" ? (
        <div className="flex gap-2">
          <button
            onClick={() => acceptFriendRequest(request.id)}
            className="bg-accent text-white px-3 py-1 rounded-md text-sm hover:bg-accent-hover"
          >
            Accept
          </button>
          <button
            onClick={() => rejectFriendRequest(request.id)}
            className="bg-secondary-bg text-text px-3 py-1 rounded-md text-sm hover:bg-gray-hover"
          >
            Reject
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <span className="text-sm text-secondary-text italic">Pending</span>
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <p className="text-secondary-text">{message}</p>
  </div>
);

const Friends = () => {
  const [tag, setTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
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
    }
  };

  return (
    <div className="h-screen w-full bg-secondary-bg overflow-hidden">
      <div className="bg-bg p-6 rounded-lg shadow border border-secondary-bg mb-6">
        <h2 className="text-xl font-semibold mb-2 text-text">Add Friend</h2>
        <p className="text-md text-accent mb-4">{user?.tag}</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter friend tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="flex-1 p-2 border rounded-md"
          />
          <button
            onClick={handleSendRequest}
            className="bg-accent text-white px-4 py-2 rounded-md whitespace-nowrap"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Request"}
          </button>
        </div>
      </div>

      <div className="bg-bg p-6 rounded-lg shadow border border-secondary-bg mb-6">
        <div className="flex border-b border-secondary-bg mb-4">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "friends"
                ? "text-accent border-b-2 border-accent"
                : "text-gray hover:bg-gray-hover"
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "requests"
                ? "text-accent border-b-2 border-accent"
                : "text-gray hover:bg-gray-hover"
            }`}
          >
            Requests (
            {pendingFriendRequests.received.length +
              pendingFriendRequests.sent.length}
            )
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {activeTab === "friends" ? (
            friends.length === 0 ? (
              <EmptyState message="You don't have any friends yet. Add some friends to get started!" />
            ) : (
              friends.map((friend) => (
                <FriendItem
                  key={friend.id}
                  friend={friend}
                  onSelect={toggleFriendSelection}
                  isSelected={selectedFriends.includes(friend.id)}
                />
              ))
            )
          ) : pendingFriendRequests.received.length === 0 &&
            pendingFriendRequests.sent.length === 0 ? (
            <EmptyState message="You don't have any pending friend requests." />
          ) : (
            <>
              {pendingFriendRequests.received.map((request) => (
                <RequestItem
                  key={request.id}
                  request={request}
                  type="received"
                />
              ))}
              {pendingFriendRequests.sent.map((request) => (
                <RequestItem key={request.id} request={request} type="sent" />
              ))}
            </>
          )}
        </div>
      </div>

      <div className="bg-bg p-6 rounded-lg shadow border border-secondary-bg">
        <h2 className="text-xl font-semibold mb-2 text-text">Create Group</h2>
        <div className="mb-4">
          <label className="block text-sm text-secondary-text mb-1">
            Selected Friends: {selectedFriends.length}
          </label>
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          onClick={() => createGroup(groupName, selectedFriends)}
          className="w-full bg-accent text-white py-2 rounded-md"
          disabled={!groupName || selectedFriends.length === 0}
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default Friends;
