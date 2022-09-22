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
import { useState, Fragment } from "react";
import { useRouter } from "next/router";
import LessonModal from "../LessonModal/LessonModal";

const Card: React.FC<{
  lessonCard: LessonCard;
  date: number;
}> = ({ lessonCard, date }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleOpenLesson = (id?: string) => {
    if (!id) {
      return router.push(
        `/lessons/new?scheduleId=${lessonCard.schedule_id}&date=${date}`
      );
    }
    router.push(`/lessons/${id}`);
  };

  const theme = getColorThemes(lessonCard.color);

  return (
    <Fragment>
      <div className={`p-2 mt-2 ${theme.card}`}>
        <div className="flex flex-row items-start justify-between">
          <h3 className="flex-[0.9] overflow-hidden font-oswald inline-block text-md font-medium cursor-pointer hover:underline">
            {lessonCard.name}
          </h3>
          <Menu placement="bottom-end">
            <MenuHandler>
              <div className="pt-1 cursor-pointer">
                <BsThreeDotsVertical className="text-sm" />
              </div>
            </MenuHandler>
            <MenuList className="rounded-md p-2">
              {lessonCard.lesson_id && (
                <MenuItem
                  className="flex flex-row items-center"
                  onClick={() => handleOpen()}
                >
                  <AiFillEye className="text-gray-500 text-lg mr-2" />
                  Preview lesson
                </MenuItem>
              )}
              <MenuItem
                className="flex flex-row items-center"
                onClick={() => handleOpenLesson(lessonCard.lesson_id)}
              >
                <AiOutlineEdit className="text-gray-500 text-lg mr-2" />
                {lessonCard.lesson_id ? "View/Edit lesson" : "Add lesson"}
              </MenuItem>
            </MenuList>
          </Menu>
        </div>

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
      <LessonModal
        open={open}
        handleOpen={handleOpen}
        lessonCard={lessonCard}
      />
    </Fragment>
  );
};

export default Card;
