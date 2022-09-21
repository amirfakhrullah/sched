import moment from "moment";
import React from "react";
import { LessonCard } from "../../helpers/weeklySchedules";

const Card: React.FC<{
  lessonCard: LessonCard;
}> = ({ lessonCard }) => {
  const getColorThemes = (color: string) => {
    switch (color) {
      case "orange":
        return {
          card: "bg-[#EBAE72]",
          tag: "bg-orange-800",
        };
      case "blue":
        return {
          card: "bg-[#6EA5D8]",
          tag: "bg-blue-900",
        };
      case "green":
        return {
          card: "bg-[#6FA9B1]",
          tag: "bg-green-900",
        };
      case "purple":
        return {
          card: "bg-[#8E7CDF]",
          tag: "bg-purple-900",
        };
      case "grey":
        return {
          card: "bg-[#93989C]",
          tag: "bg-gray-900",
        };
      default:
        return {
          card: "bg-[#93989C]",
          tag: "bg-gray-900",
        };
    }
  };
  const theme = getColorThemes(lessonCard.color);

  return (
    <div className={`p-2 mt-2 ${theme.card}`}>
      <h3 className="font-oswald text-md font-medium cursor-pointer hover:underline mb-1">
        {lessonCard.name}
      </h3>

      <div className="flex flex-row items-start my-2">
        <div className={`inline-block px-2 rounded-md mr-1 ${theme.tag}`}>
          <p className="text-sm text-white">unit</p>
        </div>
        <p className="text-sm">{lessonCard.unit}</p>
      </div>

      <p className="text-sm text-right font-medium">
        {moment(lessonCard.start_time, "hhmm").format("hh:mm A")} -{" "}
        {moment(lessonCard.end_time, "hhmm").format("hh:mm A")}
      </p>
    </div>
  );
};

export default Card;
