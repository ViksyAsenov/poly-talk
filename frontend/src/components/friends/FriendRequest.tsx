import { useUserStore } from "../../store/userStore";
import { FriendRequestReceived, FriendRequestSent } from "../../types/user";

type RequestItemProps =
  | { request: FriendRequestReceived; type: "received" }
  | { request: FriendRequestSent; type: "sent" };

const FriendRequest = ({ request, type }: RequestItemProps) => {
  const { acceptFriendRequest, rejectFriendRequest } = useUserStore();

  const user = type === "received" ? request.sender : request.receiver;
  return (
    <div className="border rounded-md bg-secondary-bg mb-2 p-4">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div className="flex items-center min-w-0">
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
          <div className="ml-3 truncate">
            <h3 className="font-medium text-text truncate">
              {user.displayName}
            </h3>
            <p className="text-sm text-secondary-text truncate">@{user.tag}</p>
          </div>
        </div>

        {type === "received" ? (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => acceptFriendRequest(request.id)}
              className="bg-accent text-white px-3 py-1 rounded-md text-sm hover:bg-accent-hover"
            >
              Accept
            </button>
            <button
              onClick={() => rejectFriendRequest(request.id)}
              className="bg-red text-white px-3 py-1 rounded-md text-sm hover:bg-red-hover"
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
    </div>
  );
};

export default FriendRequest;
