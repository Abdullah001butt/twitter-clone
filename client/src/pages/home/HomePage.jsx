import { useState } from "react";
import Posts from "../../common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700/50 min-h-screen">
      {/* Header */}
      <div className="flex w-full border-b border-gray-700/50 sticky top-0 backdrop-blur-md bg-black/90 z-10">
        <div
          className={
            "flex justify-center flex-1 p-4 hover:bg-gray-800/40 transition-all duration-300 cursor-pointer relative"
          }
          onClick={() => setFeedType("forYou")}
        >
          <span className={`font-medium text-lg ${feedType === "forYou" ? "text-white" : "text-gray-400"}`}>
            For you
          </span>
          {feedType === "forYou" && (
            <div className="absolute bottom-0 w-12 h-1 rounded-full bg-blue-500 transition-all duration-300"></div>
          )}
        </div>
        <div
          className="flex justify-center flex-1 p-4 hover:bg-gray-800/40 transition-all duration-300 cursor-pointer relative"
          onClick={() => setFeedType("following")}
        >
          <span className={`font-medium text-lg ${feedType === "following" ? "text-white" : "text-gray-400"}`}>
            Following
          </span>
          {feedType === "following" && (
            <div className="absolute bottom-0 w-12 h-1 rounded-full bg-blue-500 transition-all duration-300"></div>
          )}
        </div>
      </div>

      {/* CREATE POST INPUT */}
      <div className="border-b border-gray-700/50">
        <CreatePost />
      </div>

      {/* POSTS */}
      <div className="transition-all duration-300">
        <Posts />
      </div>
    </div>
  );
};

export default HomePage;
