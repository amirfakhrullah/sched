import React from "react";
import { BsCalendar2Week, BsSearch } from "react-icons/bs";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  Tooltip,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

const Sidebar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isActive = (route?: string) => {
    if (!route) return false;
    return router.asPath === route;
  };

  // vars
  const isLoggedIn = Boolean(session && status === "authenticated");
  const isLoading = status === "loading";

  const iconClassName="text-gray-200 md:text-2xl text-lg";
  const routes = [
    {
      route: "/",
      label: "Schedule",
      component: (
        <BsCalendar2Week className={iconClassName} />
      ),
      tooltipContent: "View the arranged weekly schedules",
    },
    {
      route: "/courses",
      label: "Courses",
      component: (
        <AiOutlineAppstoreAdd className={iconClassName} />
      ),
      tooltipContent: "Add, update or view all your courses",
    },
    {
      route: "/search",
      label: "Search",
      component: <BsSearch className={iconClassName} />,
      tooltipContent: "Search your lessons by tags",
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
                  onClick={() => router.push(obj.route)}
                >
                  {obj.component}
                  <p className="text-[12px] text-gray-300 mt-3">{obj.label}</p>
                </div>
              </Tooltip>
            ))}
          </div>

          {isLoading ? (
            <div className="fixed bottom-0 mb-2 h-[40px] w-[40px] animate-pulse bg-teal-700 rounded-full" />
          ) : (
            isLoggedIn &&
            session?.user &&
            session.user?.image &&
            session.user?.name &&
            session.user?.email && (
              <Menu placement="left-end">
                <MenuHandler>
                  <div className="fixed bottom-0 mb-2">
                    <Image
                      src={session.user.image}
                      height={40}
                      width={40}
                      alt="avatar"
                      className="rounded-full cursor-pointer"
                    />
                  </div>
                </MenuHandler>
                <MenuList className="rounded-md">
                  <div className="border-gray-600 border-b-[1px] mb-2">
                    <p className="text-gray-900">{session.user.name}</p>
                    <p className="text-[12px]">{session.user.email}</p>
                  </div>
                  <MenuItem
                    className="flex flex-row items-center"
                    onClick={() => signOut()}
                  >
                    <IoLogOutOutline className="text-gray-500 text-lg mr-2" />
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            )
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
              onClick={() => router.push(obj.route)}
            >
              {obj.component}
              <p className="text-[10px] text-gray-300 mt-1">{obj.label}</p>
            </div>
          ))}
          <div className="w-full flex flex-col items-center justify-center cursor-pointer">
            {isLoading ? (
              <div className="h-[35px] w-[35px] animate-pulse bg-teal-700 rounded-full" />
            ) : (
              isLoggedIn &&
              session?.user &&
              session.user?.image &&
              session.user?.name &&
              session.user?.email && (
                <Menu placement="top-end">
                  <MenuHandler>
                    <div className="flex justify-center items-center">
                      <Image
                        src={session.user.image}
                        height={35}
                        width={35}
                        alt="avatar"
                        className="rounded-full cursor-pointer"
                      />
                    </div>
                  </MenuHandler>
                  <MenuList className="rounded-md">
                    <div className="border-gray-600 border-b-[1px] mb-2">
                      <p className="text-gray-900">{session.user.name}</p>
                      <p className="text-[12px]">{session.user.email}</p>
                    </div>
                    <MenuItem
                      className="flex flex-row items-center"
                      onClick={() => signOut()}
                    >
                      <IoLogOutOutline className="text-gray-500 text-lg mr-2" />
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
