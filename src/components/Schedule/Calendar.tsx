import moment from "moment";
import React from "react";

const weekDays = [
  {
    day: "Mon",
    date: 20220805,
  },
  {
    day: "Tue",
    date: 20220806,
  },
  {
    day: "Wed",
    date: 20220807,
  },
  {
    day: "Thu",
    date: 20220808,
  },
  {
    day: "Fri",
    date: 20220809,
  },
];

const Calendar = () => {
  return (
    <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-5 w-full">
      {weekDays.map((dayObj) => (
        <div key={dayObj.day} className="flex flex-col">
          <div className="flex flex-row items-center justify-between border-b-2 border-teal-800 pb-2">
            <h3 className="font-oswald text-xl font-semibold">{dayObj.day}</h3>
            <p className="font-oswald text-sm text-gray-500">
              {moment(dayObj.date.toString()).format("MMMM Do")}
            </p>
          </div>

          <div className="bg-[#6EA5D8] p-2 mt-4">
            <h3 className="font-oswald text-md font-medium cursor-pointer hover:underline mb-1">
              Python
            </h3>

            <div className="flex flex-row items-start my-2">
              <div className="bg-blue-900 inline-block px-2 rounded-md mr-1">
                <p className="text-sm text-white">unit</p>
              </div>
              <p className="text-sm">OOP</p>
            </div>

            <p className="text-sm text-right font-medium">08:00 AM - 10:30 PM</p>
          </div>

          <div className="bg-[#EBAE72] p-2 mt-4">
            <h3 className="font-oswald text-md font-medium cursor-pointer hover:underline mb-1">
              Python
            </h3>

            <div className="flex flex-row items-start my-2">
              <div className="bg-orange-800 inline-block px-2 rounded-md mr-1">
                <p className="text-sm text-white">unit</p>
              </div>
              <p className="text-sm">OOP</p>
            </div>

            <p className="text-sm text-right font-medium">08:00 AM - 10:30 PM</p>
          </div>

          <div className="bg-[#6FA9B1] p-2 mt-4">
            <h3 className="font-oswald text-md font-medium cursor-pointer hover:underline mb-1">
              Python
            </h3>

            <div className="flex flex-row items-start my-2">
              <div className="bg-green-900 inline-block px-2 rounded-md mr-1">
                <p className="text-sm text-white">unit</p>
              </div>
              <p className="text-sm">OOP</p>
            </div>

            <p className="text-sm text-right font-medium">08:00 AM - 10:30 PM</p>
          </div>

          <div className="bg-[#8E7CDF] p-2 mt-4">
            <h3 className="font-oswald text-md font-medium cursor-pointer hover:underline mb-1">
              Python
            </h3>

            <div className="flex flex-row items-start my-2">
              <div className="bg-purple-900 inline-block px-2 rounded-md mr-1">
                <p className="text-sm text-white">unit</p>
              </div>
              <p className="text-sm">OOP</p>
            </div>

            <p className="text-sm text-right font-medium">08:00 AM - 10:30 PM</p>
          </div>

          <div className="bg-[#93989C] p-2 mt-4">
            <h3 className="font-oswald text-md font-medium cursor-pointer hover:underline mb-1">
              Python
            </h3>

            <div className="flex flex-row items-start my-2">
              <div className="bg-zinc-900 inline-block px-2 rounded-md mr-1">
                <p className="text-sm text-white">unit</p>
              </div>
              <p className="text-sm">OOP</p>
            </div>

            <p className="text-sm text-right font-medium">08:00 AM - 10:30 PM</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Calendar;
