import Post from "./Post";
import PostSkeleton from "../components/skeletons/PostSkeleton";
import { POSTS } from "../utils/db/dummy";

const Posts = () => {
	const isLoading = false;

	return (
		<div className="transition-all duration-300">
			{isLoading && (
				<div className="flex flex-col gap-4 animate-fade-in">
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			
			{!isLoading && POSTS?.length === 0 && (
				<div className="flex flex-col items-center justify-center py-10 text-gray-400">
					<p className="text-xl font-medium">No posts in this tab</p>
					<p className="text-sm">Switch tabs to see different content 👻</p>
				</div>
			)}
			
			{!isLoading && POSTS && (
				<div className="divide-y divide-gray-800/50">
					{POSTS.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</div>
	);
};

export default Posts;