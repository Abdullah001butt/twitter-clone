import { Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/notifications", {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Notifications deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700/50 min-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-gray-700/50 sticky top-0 backdrop-blur-md bg-black/90 z-10">
        <h1 className="text-xl font-bold text-white/90">Notifications</h1>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="p-2 hover:bg-gray-800/50 rounded-full transition-all duration-300"
          >
            <IoSettingsOutline className="w-5 h-5 text-gray-300 hover:text-white" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow-lg bg-gray-900 rounded-xl w-52 border border-gray-700/50"
          >
            <li>
              <button
                onClick={deleteNotifications}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
              >
                Delete all notifications
              </button>
            </li>
          </ul>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center h-[400px] items-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {notifications?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 space-y-2">
          <span className="text-4xl">🤔</span>
          <p className="text-xl font-medium">No notifications yet</p>
        </div>
      )}

      <div className="divide-y divide-gray-700/50">
        {notifications?.map((notification) => (
          <div
            key={notification._id}
            className="hover:bg-gray-900/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 flex items-center justify-center">
                {notification.type === "follow" && (
                  <FaUser className="w-6 h-6 text-blue-500" />
                )}
                {notification.type === "like" && (
                  <FaHeart className="w-6 h-6 text-pink-500" />
                )}
              </div>

              <Link
                to={`/profile/${notification.from.username}`}
                className="flex items-center gap-3 group"
              >
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full ring-2 ring-blue-500/30 ring-offset-2 ring-offset-black">
                    <img
                      src={
                        notification.from.profileImg ||
                        "/avatar-placeholder.png"
                      }
                      className="object-cover"
                      alt={notification.from.username}
                    />
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="font-bold group-hover:text-blue-400 transition-colors">
                    @{notification.from.username}
                  </span>
                  <span className="text-gray-400">
                    {notification.type === "follow"
                      ? "followed you"
                      : "liked your post"}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
