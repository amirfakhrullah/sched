import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import moment from "moment";
import React from "react";
import { AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import { getColorThemes } from "../../helpers/cardColors";
import { LessonCard } from "../../helpers/weeklySchedules";
import AppButton from "../AppButton";
import LessonModalQuery from "./LessonModalQuery";
import { useRouter } from "next/router";

const LessonModal: React.FC<{
  open: boolean;
  handleOpen: () => void;
  lessonCard: LessonCard;
}> = ({ open, handleOpen, lessonCard }) => {
  const router = useRouter();
  const theme = getColorThemes(lessonCard.color);

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="rounded-sm max-w-3xl w-[95vw] mx-auto"
    >
      <DialogHeader
        className={`${theme.card} flex flex-row items-center justify-between`}
      >
        <div className="block">
          <h3 className="text-black overflow-hidden font-oswald text-md font-medium mb-1">
            {lessonCard.name}
          </h3>
          <div className="flex flex-row items-start">
            <div className={`inline-block px-2 rounded-sm mr-1 ${theme.tag}`}>
              <p className="text-sm text-white">unit</p>
            </div>
            <p className="text-sm text-black">{lessonCard.unit}</p>
          </div>
          <p className="text-sm font-medium">
            {moment(lessonCard.start_time, "HHmm").format("hh:mm A")} -{" "}
            {moment(lessonCard.end_time, "HHmm").format("hh:mm A")}
          </p>
        </div>
        <div
          className="rounded-full p-2 cursor-pointer"
          onClick={() => router.push(`/notes/${lessonCard.lesson_id}`)}
        >
          <AiOutlineEdit className="text-black text-xl" />
        </div>
      </DialogHeader>
      <DialogBody
        divider
        className="flex flex-col items-start max-h-[60vh] overflow-y-auto"
      >
        <div className="flex flex-wrap gap-1 mb-1">
          {lessonCard.tags &&
            lessonCard.tags.map((val, idx) => (
              <div
                key={idx}
                className={`inline-block px-2 rounded-sm ${theme.tag}`}
              >
                <p className="text-sm text-white">{val}</p>
              </div>
            ))}
        </div>
        {lessonCard.lesson_id && open && (
          <LessonModalQuery lessonId={lessonCard.lesson_id} />
        )}
      </DialogBody>
      <DialogFooter>
        <AppButton
          label="Close"
          css="bg-teal-800 max-w-[10em]"
          theme="green"
          onClick={() => handleOpen()}
          icon={<AiOutlineClose className="text-white text-sm mr-2" />}
        />
      </DialogFooter>
    </Dialog>
  );
};

export default LessonModal;
