import XSvg from "../components/svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";

const Sidebar = () => {
  const data = {
    fullName: "John Doe",
    username: "johndoe",
    profileImg: "/avatars/boy1.png",
  };

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-800 w-20 md:w-full bg-black bg-opacity-95 backdrop-blur-lg">
        {/* Logo Section */}
        <Link to="/" className="flex justify-center md:justify-start p-4">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900 transition-colors duration-300" />
        </Link>

        {/* Navigation Menu */}
        <ul className="flex flex-col gap-4 mt-8">
          <li className="flex justify-center md:justify-start px-4">
            <Link
              to="/"
              className="flex gap-4 items-center hover:bg-blue-500/10 transition-all rounded-full duration-300 py-3 pl-3 pr-6 w-full group"
            >
              <MdHomeFilled className="w-7 h-7 text-gray-200 group-hover:text-blue-500 transition-colors" />
              <span className="text-gray-200 text-lg hidden md:block font-medium group-hover:text-blue-500">
                Home
              </span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start px-4">
            <Link
              to="/notifications"
              className="flex gap-4 items-center hover:bg-blue-500/10 transition-all rounded-full duration-300 py-3 pl-3 pr-6 w-full group"
            >
              <IoNotifications className="w-6 h-6 text-gray-200 group-hover:text-blue-500 transition-colors" />
              <span className="text-gray-200 text-lg hidden md:block font-medium group-hover:text-blue-500">
                Notifications
              </span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start px-4">
            <Link
              to={`/profile/${data?.username}`}
              className="flex gap-4 items-center hover:bg-blue-500/10 transition-all rounded-full duration-300 py-3 pl-3 pr-6 w-full group"
            >
              <FaUser className="w-6 h-6 text-gray-200 group-hover:text-blue-500 transition-colors" />
              <span className="text-gray-200 text-lg hidden md:block font-medium group-hover:text-blue-500">
                Profile
              </span>
            </Link>
          </li>
        </ul>

        {/* User Profile Section */}
        {data && (
          <Link
            to={`/profile/${data.username}`}
            className="mt-auto mb-6 mx-4 flex items-center gap-3 transition-all duration-300 hover:bg-blue-500/10 p-3 rounded-full group"
          >
            <div className="avatar">
              <div className="w-10 h-10 rounded-full ring-2 ring-blue-500 ring-offset-2 ring-offset-black">
                <img
                  src={data?.profileImg || "/avatar-placeholder.png"}
                  alt="profile"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="hidden md:flex justify-between items-center flex-1">
              <div className="flex flex-col">
                <p className="text-white font-bold text-sm group-hover:text-blue-500 transition-colors">
                  {data?.fullName}
                </p>
                <p className="text-gray-500 text-sm">@{data?.username}</p>
              </div>
              <BiLogOut className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
