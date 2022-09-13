import React from "react";
import { BsCalendar2Week, BsSearch } from "react-icons/bs";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { IoLogOutOutline, IoLogInOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Tooltip } from "@material-tailwind/react";

const Sidebar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isActive = (route?: string) => {
    if (!route) return false;
    return router.asPath === route;
  };

  const handleClick = (route?: string, clickFn?: () => void) => {
    if (!route && clickFn) {
      return clickFn();
    } else if (route) {
      return router.push(route);
    }
    return;
  };

  // vars
  const isLoggedIn = Boolean(session && status === "authenticated");
  const isLoading = Boolean(status === "loading");

  const routes = [
    {
      route: "/",
      label: "Schedule",
      component: (
        <BsCalendar2Week className="text-gray-200 md:text-2xl text-lg" />
      ),
      tooltipContent: "View the arranged weekly schedules",
    },
    {
      route: "/courses",
      label: "Courses",
      component: (
        <AiOutlineAppstoreAdd className="text-gray-200 md:text-2xl text-lg" />
      ),
      tooltipContent: "Add, update or view your courses",
    },
    {
      route: "/search",
      label: "Search",
      component: <BsSearch className="text-gray-200 md:text-2xl text-lg" />,
      tooltipContent: "Search your lessons by tags",
    },
    {
      label: isLoading ? null : isLoggedIn ? "Logout" : "Sign In",
      clickFn: () =>
        isLoading ? null : isLoggedIn ? signOut() : signIn("github"),
      component: isLoading ? (
        <div className="md:h-12 md:w-12 h-6 w-6 animate-pulse bg-teal-700 rounded-lg" />
      ) : isLoggedIn ? (
        <IoLogOutOutline className="text-gray-200 md:text-2xl text-lg" />
      ) : (
        <IoLogInOutline className="text-gray-200 md:text-2xl text-lg" />
      ),
      tooltipContent: isLoading
        ? "Loading..."
        : isLoggedIn
        ? "Logout your session"
        : "Login with GitHub",
    },
  ];

  return (
    <>
      {/* DESKTOP VIEW ---------------------------------------- */}
      <div className="md:block hidden">
        <div className="h-screen w-20 bg-teal-800 flex flex-col items-center fixed">
          <h1 className="font-oswald text-2xl font-[700] mt-4 text-gray-100">
            Sched
          </h1>
          <div className="mt-32">
            {routes.map((obj, idx) => (
              <Tooltip
                key={`route__${idx}`}
                content={obj.tooltipContent}
                placement="left"
                className="rounded-md"
              >
                <div
                  className={`h-20 w-20 rounded-r-lg flex flex-grow flex-col items-center justify-center cursor-pointer hover:bg-teal-700 ease-in duration-100 ${
                    isActive(obj.route) ? "bg-teal-600" : ""
                  }`}
                  onClick={() => handleClick(obj.route, obj.clickFn)}
                >
                  {obj.component}
                  <p className="text-[12px] text-gray-300 mt-3">{obj.label}</p>
                </div>
              </Tooltip>
            ))}
          </div>

          {isLoggedIn &&
            session?.user &&
            session.user?.image &&
            session.user?.name && (
              <Tooltip
                content={session.user.name}
                placement="left"
                className="rounded-md"
              >
                <div className="fixed bottom-0 mb-4">
                  <Image
                    src={session.user.image}
                    height={40}
                    width={40}
                    alt="avatar"
                    className="rounded-full"
                  />
                </div>
              </Tooltip>
            )}
        </div>
        <div className="h-screen w-20" />
      </div>

      {/* MOBILE VIEW: sidebar turns to bottom bar ---------------------------------------- */}
      <div className="md:hidden block">
        <div className="fixed bottom-0 left-0 w-full bg-teal-800 flex flex-row items-center">
          {routes.map((obj, idx) => (
            <div
              key={`route__${idx}`}
              className={`w-full p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-teal-700 ease-in duration-100 ${
                isActive(obj.route) ? "bg-teal-600" : ""
              }`}
              onClick={() => handleClick(obj.route, obj.clickFn)}
            >
              {obj.component}
              <p className="text-[10px] text-gray-300 mt-1">{obj.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
