import React from "react";
import { BsCalendar2Week, BsSearch } from "react-icons/bs";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

const Sidebar = () => {
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

  const routes = [
    {
      route: "/",
      label: "Schedule",
      component: (
        <BsCalendar2Week className="text-gray-200 md:text-2xl text-lg" />
      ),
    },
    {
      route: "/courses",
      label: "Courses",
      component: (
        <AiOutlineAppstoreAdd className="text-gray-200 md:text-2xl text-lg" />
      ),
    },
    {
      route: "/search",
      label: "Search",
      component: <BsSearch className="text-gray-200 md:text-2xl text-lg" />,
    },
    {
      label: "Logout",
      clickFn: signOut,
      component: (
        <IoLogOutOutline className="text-gray-200 md:text-2xl text-lg" />
      ),
    },
  ];

  return (
    <>
      {/* DESKTOP VIEW ---------------------------------------- */}
      <div className="md:block hidden">
        <div className="h-screen w-20 bg-teal-800 flex flex-col items-center">
          <div className="mt-36">
            {routes.map((obj, idx) => (
              <div
                key={`route__${idx}`}
                className={`w-full p-4 rounded-r-lg flex flex-col items-center justify-center cursor-pointer hover:bg-teal-700 ease-in duration-100 ${
                  isActive(obj.route) ? "bg-teal-600" : ""
                }`}
                onClick={() => handleClick(obj.route, obj.clickFn)}
              >
                {obj.component}
                <p className="text-[12px] text-gray-300 mt-3">{obj.label}</p>
              </div>
            ))}
          </div>
        </div>
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
              <p className="sm:block hidden text-[12px] text-gray-300">
                {obj.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
