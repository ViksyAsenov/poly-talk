import { useNavigate } from "react-router-dom";
import { chatApi } from "../../api/client";
import { useUserStore } from "../../store/userStore";
import { IMinUser } from "../../types/user";

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
    <div className="flex flex-wrap justify-between items-center p-4 border border-accent rounded-md bg-secondary-bg mb-2">
      <div className="flex items-center min-w-0">
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
        <div className="ml-3 truncate">
          <h3 className="font-medium text-text truncate">
            {friend.displayName}
          </h3>
          <p className="text-sm text-secondary-text truncate">{friend.tag}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center mt-2 sm:mt-0">
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

export default FriendItem;
