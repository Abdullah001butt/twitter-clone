import Post from "./Post";
import PostSkeleton from "../components/skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, username, userId }) => {
  const getFeedEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${username}`;
      case "likes":
        return `/api/posts/likes/${userId}`;
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getFeedEndpoint();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  return (
    <div className="transition-all duration-300">
      {(isLoading || isRefetching) && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {(!isLoading || !isRefetching) && posts?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <p className="text-xl font-medium">No posts in this tab</p>
          <p className="text-sm">Switch tabs to see different content 👻</p>
        </div>
      )}

      {(!isLoading || !isRefetching) && posts && (
        <div className="divide-y divide-gray-800/50">
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
