import { useState } from "react";
import { Link } from "react-router-dom";
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || data.message || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      // toast.success("Logged in successfully");
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      setFormData({
        username: "",
        password: "",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-95 flex">
      {/* Left side with logo */}
      <div className="flex-1 hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <XSvg className="lg:w-2/3 fill-white transform hover:scale-105 transition-transform duration-300" />
      </div>

      {/* Right side with form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12">
        <div className="w-full max-w-md">
          <XSvg className="w-24 lg:hidden fill-white mb-8 mx-auto" />

          <h1 className="text-5xl font-extrabold text-white mb-8 tracking-tight">
            Welcome <span className="text-blue-500">Back</span>
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="input input-bordered flex items-center gap-3 bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors duration-300">
              <MdOutlineMail className="text-gray-400 text-xl" />
              <input
                type="text"
                className="grow bg-transparent focus:outline-none text-white"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>

            <label className="input input-bordered flex items-center gap-3 bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors duration-300">
              <MdPassword className="text-gray-400 text-xl" />
              <input
                type="password"
                className="grow bg-transparent focus:outline-none text-white"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
              />
            </label>

            <button className="btn w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 font-semibold text-lg transition-colors duration-300">
              {isPending ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Log In"
              )}
            </button>
            {isError && <p className="text-red-500">{error.message}</p>}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">New to the platform?</p>
            <Link to="/signup">
              <button className="btn w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full py-3 font-semibold transition-all duration-300">
                Create account
              </button>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <button className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors duration-300">
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
