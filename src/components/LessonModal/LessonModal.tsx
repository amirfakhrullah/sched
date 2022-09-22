import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import moment from "moment";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { getColorThemes } from "../../helpers/cardColors";
import { LessonCard } from "../../helpers/weeklySchedules";
import AppButton from "../AppButton";
import LessonModalQuery from "./LessonModalQuery";

const LessonModal: React.FC<{
  open: boolean;
  handleOpen: () => void;
  lessonCard: LessonCard;
}> = ({ open, handleOpen, lessonCard }) => {
  const theme = getColorThemes(lessonCard.color);

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="rounded-sm max-w-3xl w-[95vw] mx-auto"
    >
      <DialogHeader className={`${theme.card} block`}>
        <h3 className="text-black overflow-hidden font-oswald text-md font-medium">
          {lessonCard.name}
        </h3>
        <p className="text-sm font-medium">
          {moment(lessonCard.start_time, "hhmm").format("hh:mm A")} -{" "}
          {moment(lessonCard.end_time, "hhmm").format("hh:mm A")}
        </p>
      </DialogHeader>
      <DialogBody divider className="flex flex-col items-start">
        <div className="flex flex-row items-start my-2">
          <div className={`inline-block px-2 rounded-md mr-1 ${theme.tag}`}>
            <p className="text-sm text-white">unit :</p>
          </div>
          <p className="text-sm text-black">{lessonCard.unit}</p>
        </div>
        {lessonCard.lesson_id && open && (
          <LessonModalQuery lessonId={lessonCard.lesson_id} hex={theme.hex} />
        )}
        <div className="flex flex-wrap gap-1 mt-5">
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
