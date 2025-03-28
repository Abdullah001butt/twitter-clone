import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";
import useFollow from "../../hooks/useFollow";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { username } = useParams();

  const { follow, isPending } = useFollow();
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
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

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/users/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coverImg,
            profileImg,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isMyProfile = authUser._id === user?._id;
  const amIFollowing = authUser?.following.includes(user?._id);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <div className="flex-[4_4_0] border-r border-gray-700/50 min-h-screen">
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
      {(!isLoading || !isRefetching) && !user && (
        <p className="text-center text-lg mt-4 text-gray-400">User not found</p>
      )}
      <div className="flex flex-col">
        {!isLoading && !isRefetching && user && (
          <>
            <div className="flex gap-10 px-4 py-2 items-center sticky top-0 backdrop-blur-md bg-black/90 z-10 border-b border-gray-700/50">
              <Link
                to="/"
                className="p-2 hover:bg-gray-800/50 rounded-full transition-all duration-300"
              >
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex flex-col">
                <p className="font-bold text-lg text-white/90">
                  {user?.fullName}
                </p>
                <span className="text-sm text-gray-400">
                  {POSTS?.length} posts
                </span>
              </div>
            </div>

            <div className="relative group/cover">
              <img
                src={coverImg || user?.coverImg || "/cover.png"}
                className="h-52 w-full object-cover brightness-95 group-hover/cover:brightness-100 transition-all duration-300"
                alt="cover image"
              />
              {isMyProfile && (
                <div
                  className="absolute top-2 right-2 rounded-full p-2 bg-black/60 backdrop-blur-sm cursor-pointer opacity-0 group-hover/cover:opacity-100 transition-all duration-300"
                  onClick={() => coverImgRef.current.click()}
                >
                  <MdEdit className="w-5 h-5 text-white" />
                </div>
              )}

              <input
                type="file"
                hidden
                accept="image/*"
                ref={coverImgRef}
                onChange={(e) => handleImgChange(e, "coverImg")}
              />
              <input
                type="file"
                hidden
                accept="image/*"
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />

              <div className="avatar absolute -bottom-16 left-4">
                <div className="w-32 rounded-full relative group/avatar ring-4 ring-black">
                  <img
                    src={
                      profileImg ||
                      user?.profileImg ||
                      "/avatar-placeholder.png"
                    }
                  />
                  <div className="absolute top-5 right-3 p-1 bg-blue-500 rounded-full opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-all duration-300">
                    {isMyProfile && (
                      <MdEdit
                        className="w-4 h-4 text-white"
                        onClick={() => profileImgRef.current.click()}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end px-4 mt-5">
              {isMyProfile && <EditProfileModal authUser={authUser} />}
              {!isMyProfile && (
                <button
                  className="btn btn-outline rounded-full btn-sm hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300"
                  onClick={() => follow(user?._id)}
                >
                  {isPending && "Loading..."}
                  {!isPending && amIFollowing && "Unfollow"}
                  {!isPending && !amIFollowing && "Follow"}
                </button>
              )}
              {(coverImg || profileImg) && (
                <button
                  className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2 hover:bg-blue-600 transition-all duration-300"
                  onClick={() => updateProfile()}
                >
                  {isUpdatingProfile ? "Updating..." : "Update"}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-14 px-4">
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white/90">
                  {user?.fullName}
                </span>
                <span className="text-gray-400">@{user?.username}</span>
                <span className="text-sm my-1 text-white/80">{user?.bio}</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {user?.link && (
                  <div className="flex gap-1 items-center group">
                    <FaLink className="w-3 h-3 text-gray-400 group-hover:text-blue-400" />
                    <a
                      href={user.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-400 hover:underline"
                    >
                      {user.link.replace("https://", "")}
                    </a>
                  </div>
                )}
                <div className="flex gap-2 items-center text-gray-400">
                  <IoCalendarOutline className="w-4 h-4" />
                  <span className="text-sm">
                    {formatMemberSinceDate(user?.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex gap-1 items-center hover:text-blue-400 transition-colors cursor-pointer">
                  <span className="font-bold text-xs">
                    {user?.following.length}
                  </span>
                  <span className="text-gray-400 text-xs">Following</span>
                </div>
                <div className="flex gap-1 items-center hover:text-blue-400 transition-colors cursor-pointer">
                  <span className="font-bold text-xs">
                    {user?.followers.length}
                  </span>
                  <span className="text-gray-400 text-xs">Followers</span>
                </div>
              </div>
            </div>

            <div className="flex w-full border-b border-gray-700/50 mt-4">
              <div
                className="flex justify-center flex-1 p-3 hover:bg-gray-800/40 transition-all duration-300 cursor-pointer relative"
                onClick={() => setFeedType("posts")}
              >
                Posts
                {feedType === "posts" && (
                  <div className="absolute bottom-0 w-10 h-1 rounded-full bg-blue-500" />
                )}
              </div>
              <div
                className="flex justify-center flex-1 p-3 text-gray-400 hover:bg-gray-800/40 transition-all duration-300 cursor-pointer relative"
                onClick={() => setFeedType("likes")}
              >
                Likes
                {feedType === "likes" && (
                  <div className="absolute bottom-0 w-10 h-1 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          </>
        )}

        <Posts feedType={feedType} username={username} userId={user?._id} />
      </div>
    </div>
  );
};

export default ProfilePage;
