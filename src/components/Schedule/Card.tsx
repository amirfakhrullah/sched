import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import moment from "moment";
import React from "react";
import { AiFillEye, AiOutlineEdit } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getColorThemes } from "../../helpers/cardColors";
import { LessonCard } from "../../helpers/weeklySchedules";

const Card: React.FC<{
  lessonCard: LessonCard;
}> = ({ lessonCard }) => {
  const theme = getColorThemes(lessonCard.color);

  return (
    <div className={`p-2 mt-2 ${theme.card}`}>
      <div className="flex flex-row items-start justify-between">
        <h3 className="flex-[0.9] overflow-hidden font-oswald inline-block text-md font-medium cursor-pointer hover:underline">
          {lessonCard.name}
        </h3>
        <Menu placement="left-start">
          <MenuHandler>
            <div className="pt-1 cursor-pointer">
              <BsThreeDotsVertical className="text-sm" />
            </div>
          </MenuHandler>
          <MenuList className="rounded-md p-2">
            <MenuItem
              className="flex flex-row items-center"
              onClick={() => null}
            >
              <AiFillEye className="text-gray-500 text-lg mr-2" />
              Preview
            </MenuItem>
            <MenuItem
              className="flex flex-row items-center"
              onClick={() => null}
            >
              <AiOutlineEdit className="text-gray-500 text-lg mr-2" />
              View/Edit
            </MenuItem>
          </MenuList>
        </Menu>
      </div>

      <div className="flex flex-row items-start my-2">
        <div className={`inline-block px-2 rounded-md mr-1 ${theme.tag}`}>
          <p className="text-sm text-white">unit :</p>
        </div>
        <p className="text-sm">{lessonCard.unit}</p>
      </div>

      <p className="text-sm text-right font-medium">
        {moment(lessonCard.start_time, "hhmm").format("hh:mm A")} -{" "}
        {moment(lessonCard.end_time, "hhmm").format("hh:mm A")}
      </p>
      <div className="flex flex-wrap gap-1">
        {lessonCard.tags &&
          lessonCard.tags.map((val, idx) => (
            <div
              key={idx}
              className={`inline-block px-2 rounded-md ${theme.tag}`}
            >
              <p className="text-sm text-white"># {val}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Card;
