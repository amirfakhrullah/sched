import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import moment from "moment";
import React from "react";
import { AiFillDelete, AiFillEye, AiOutlineEdit } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getColorThemes } from "../../helpers/cardColors";
import { LessonCard } from "../../helpers/weeklySchedules";
import { useState, Fragment } from "react";
import { useRouter } from "next/router";
import LessonModal from "../LessonModal/LessonModal";
import ConfirmModal from "../ConfirmModal";
import { trpc } from "../../utils/trpc";

const Card: React.FC<{
  lessonCard: LessonCard;
  date: number;
}> = ({ lessonCard, date }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("lessons.delete", {
    onSettled() {
      utils.invalidateQueries(["courses.weeklySchedule"]);
      setDeleteAlert(false);
    },
  });

  const handleOpen = () => setOpen(!open);

  const handleOpenLesson = (id?: string) => {
    if (!id) {
      return router.push(
        `/notes/new?scheduleId=${lessonCard.schedule_id}&date=${date}`
      );
    }
    router.push(`/notes/${id}`);
  };

  const theme = getColorThemes(lessonCard.color);

  return (
    <Fragment>
      <div className={`rounded-sm p-2 mt-2 ${theme.card}`}>
        <div className="flex flex-row items-start justify-between">
          <h3
            className="flex-[0.9] overflow-hidden font-oswald inline-block text-md font-medium cursor-pointer hover:underline"
            onClick={() => handleOpenLesson()}
          >
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
                  Preview note
                </MenuItem>
              )}
              {!lessonCard.lesson_id && (
                <div className="border-gray-600 border-b-[1px] mb-2">
                  <p className="text-[12px]">No note added yet.</p>
                </div>
              )}
              <MenuItem
                className="flex flex-row items-center"
                onClick={() => handleOpenLesson(lessonCard.lesson_id)}
              >
                <AiOutlineEdit className="text-gray-500 text-lg mr-2" />
                {lessonCard.lesson_id ? "View/Edit note" : "Add note"}
              </MenuItem>
              {lessonCard.lesson_id && (
                <MenuItem
                  className="flex flex-row items-center"
                  onClick={() => setDeleteAlert(true)}
                >
                  <AiFillDelete className="text-gray-500 text-lg mr-2" />
                  Delete note
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </div>

        <div className="flex flex-row items-start my-2">
          <div className={`inline-block px-2 rounded-sm mr-1 ${theme.tag}`}>
            <p className="text-sm text-white">unit</p>
          </div>
          <p className="text-sm">{lessonCard.unit}</p>
        </div>

        <p className="text-sm text-right font-medium">
          {moment(lessonCard.start_time, "hhmm").format("hh:mm A")} -{" "}
          {moment(lessonCard.end_time, "hhmm").format("hh:mm A")}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {lessonCard.tags &&
            lessonCard.tags.map((val, idx) => (
              <div
                key={idx}
                className="inline-block px-2 rounded-sm border border-gray-800"
              >
                <p className="text-sm text-black">{val}</p>
              </div>
            ))}
        </div>
      </div>
      <LessonModal
        open={open}
        handleOpen={handleOpen}
        lessonCard={lessonCard}
      />
      {lessonCard.lesson_id && (
        <ConfirmModal
          deleteLoading={isLoading}
          open={deleteAlert}
          handleOpen={() => setDeleteAlert((alert) => !alert)}
          onConfirm={() =>
            lessonCard.lesson_id && mutate({ id: lessonCard.lesson_id })
          }
        />
      )}
    </Fragment>
  );
};

export default Card;
