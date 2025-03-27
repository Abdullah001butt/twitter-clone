import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || data.message || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      setText("");
      setImg(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-6 items-start gap-4 transition-all duration-300">
      <div className="avatar">
        <div className="w-12 h-12 rounded-full ring-2 ring-blue-500/30 ring-offset-2 ring-offset-black">
          <img
            src={authUser.profileImg || "/avatar-placeholder.png"}
            alt="profile"
            className="object-cover"
          />
        </div>
      </div>

      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-2 text-lg resize-none border-none focus:outline-none bg-transparent placeholder-gray-500 min-h-[120px]"
          placeholder="What's happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {img && (
          <div className="relative w-full max-w-md mx-auto group">
            <button
              className="absolute top-2 right-2 p-1 bg-gray-900/80 hover:bg-gray-800 rounded-full transition-colors duration-300"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            >
              <IoCloseSharp className="w-5 h-5 text-white" />
            </button>
            <img
              src={img}
              className="w-full rounded-2xl shadow-lg border border-gray-700/50"
              alt="preview"
            />
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-800">
          <div className="flex gap-4 items-center">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-blue-500/20 transition-colors duration-300 group"
              onClick={() => imgRef.current.click()}
            >
              <CiImageOn className="w-6 h-6 text-blue-500 group-hover:text-blue-400" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-blue-500/20 transition-colors duration-300 group"
            >
              <BsEmojiSmileFill className="w-5 h-5 text-blue-500 group-hover:text-blue-400" />
            </button>
          </div>

          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />

          <button
            className="btn bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            disabled={!text.trim() && !img}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Post"
            )}
          </button>
        </div>
        {isError && <p className="text-red-500">{error.message}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
