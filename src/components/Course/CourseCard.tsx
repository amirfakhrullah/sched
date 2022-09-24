import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { Course } from "@prisma/client";
import moment from "moment";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getColorThemes } from "../../helpers/cardColors";
import { trpc } from "../../utils/trpc";
import ConfirmModal from "../ConfirmModal";

const CourseCard: React.FC<{
  course: Course;
}> = ({ course }) => {
  const router = useRouter();
  const [deleteAlert, setDeleteAlert] = useState(false);

  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("courses.delete", {
    onSettled() {
      utils.invalidateQueries(["courses.get-all"]);
      setDeleteAlert(false);
    },
  });

  const handleOpenCourse = (id: string) => {
    router.push(`/courses/${id}`);
  };

  const theme = getColorThemes(course.color);

  return (
    <Fragment>
      <div className={`rounded-sm p-2 mt-2 ${theme.card}`}>
        <div className="flex flex-row items-start justify-between mb-2">
          <h3
            className="flex-[0.9] overflow-hidden font-oswald inline-block text-md font-medium cursor-pointer hover:underline"
            onClick={() => handleOpenCourse(course.id)}
          >
            {course.name}
          </h3>
          <Menu placement="bottom-end">
            <MenuHandler>
              <div className="pt-1 cursor-pointer">
                <BsThreeDotsVertical className="text-sm" />
              </div>
            </MenuHandler>
            <MenuList className="rounded-md p-2">
              <MenuItem
                className="flex flex-row items-center"
                onClick={() => handleOpenCourse(course.id)}
              >
                <AiOutlineEdit className="text-gray-500 text-lg mr-2" />
                View/Edit course
              </MenuItem>
              <MenuItem
                className="flex flex-row items-center"
                onClick={() => setDeleteAlert(true)}
              >
                <AiFillDelete className="text-gray-500 text-lg mr-2" />
                Delete course
              </MenuItem>
            </MenuList>
          </Menu>
        </div>

        <p className="text-sm font-medium">
          <b>Start:</b>{" "}
          {moment(course.start_date.toString()).format("MMMM Do YYYY")}
        </p>
        {course.end_date && (
          <p className="text-sm font-medium">
            <b>End:</b>
            {moment(course.end_date.toString()).format("MMMM Do YYYY")}
          </p>
        )}
      </div>
      <ConfirmModal
        deleteLoading={isLoading}
        open={deleteAlert}
        handleOpen={() => setDeleteAlert((alert) => !alert)}
        onConfirm={() => mutate({ id: course.id })}
        description="This action will also delete all the schedules and notes related to this course."
      />
    </Fragment>
  );
};

export default CourseCard;
