import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import moment from "moment";
import React from "react";
import { ThreeDots } from "react-loader-spinner";
import { getColorThemes } from "../helpers/cardColors";
import { LessonCard } from "../helpers/weeklySchedules";
import { trpc } from "../utils/trpc";

const LessonModal: React.FC<{
  open: boolean;
  handleOpen: () => void;
  lessonCard: LessonCard;
}> = ({ open, handleOpen, lessonCard }) => {
  const { isLoading, data } = trpc.useQuery([
    "lessons.get",
    {
      includeCourse: false,
      lessonId: lessonCard.lesson_id,
    },
  ]);

  const theme = getColorThemes(lessonCard.color);

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="rounded-md max-w-3xl w-[95vw] mx-auto"
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
        {isLoading ? (
          <div className="w-full flex items-center justify-center">
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color={theme.hex}
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              visible={true}
            />
          </div>
        ) : (
          data?.note
        )}
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
      </DialogBody>
      <DialogFooter>
        <Button
          color="green"
          className="bg-teal-800 rounded-md"
          onClick={() => handleOpen()}
        >
          <span>Close</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default LessonModal;
