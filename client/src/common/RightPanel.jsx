import { Link } from "react-router-dom";
import RightPanelSkeleton from "../components/skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";

const RightPanel = () => {
  const { data: suggestedUser, isLoading } = useQuery({
    queryKey: ["suggestedUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
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

  if (suggestedUser?.length === 0)
    return (
      <div>
        <h2 className="text-xl font-bold text-white/90 text-center">
          No suggestions found.
        </h2>
      </div>
    );

  return (
    <div className="hidden lg:block my-6 mx-4">
      <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl overflow-hidden shadow-xl border border-gray-800/50">
        <div className="p-4 border-b border-gray-800/50">
          <h2 className="text-xl font-bold text-white/90">Who to follow</h2>
        </div>

        <div className="divide-y divide-gray-800/50">
          {isLoading && (
            <div className="space-y-2 p-4">
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </div>
          )}

          {!isLoading &&
            suggestedUser?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between p-4 hover:bg-gray-800/30 transition-colors duration-300"
                key={user._id}
              >
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full ring-2 ring-blue-500/50 ring-offset-2 ring-offset-gray-900">
                      <img
                        src={user.profileImg || "/avatar-placeholder.png"}
                        className="object-cover"
                        alt={user.fullName}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white/90 hover:text-blue-400 transition-colors duration-300">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-gray-400">
                      @{user.username}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-sm bg-white hover:bg-gray-200 text-black font-semibold rounded-full px-4 transition-all duration-300 transform hover:scale-105"
                  onClick={(e) => e.preventDefault()}
                >
                  Follow
                </button>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
