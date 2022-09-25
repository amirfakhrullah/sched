import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import {
  CourseFormValidator,
  CoursePayloadType,
} from "../../helpers/validations/courses";
import { trpc } from "../../utils/trpc";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "../Loader";
import Input from "../Input";
import { Option, Select } from "@material-tailwind/react";
import { getColorThemes } from "../../helpers/cardColors";
import AppButton from "../AppButton";
import moment from "moment";
import ScheduleModal from "./ScheduleModal";
import ConfirmModal from "../ConfirmModal";

const CourseForm: React.FC<{
  type: "create" | "edit";
  id?: string;
  initialValues: CoursePayloadType;
}> = ({ id, type, initialValues }) => {
  const router = useRouter();
  const utils = trpc.useContext();

  const [deleteAlert, setDeleteAlert] = useState(false);
  const [addSched, setAddSched] = useState(false);
  const [editIndex, setEditIndex] = useState<number | undefined>(undefined);
  const [currColor, setCurrColor] = useState(
    initialValues.color ? getColorThemes(initialValues.color).card : ""
  );

  const { mutate: createMutate, isLoading: createLoading } = trpc.useMutation(
    "courses.create",
    {
      onSuccess: ({ id: courseId }) => {
        router.push(`/courses/${courseId}?new=true`);
        toast("Course created");
      },
    }
  );
  const { mutate: editMutate, isLoading: editLoading } = trpc.useMutation(
    "courses.update",
    {
      onSuccess: () => {
        utils.invalidateQueries(["courses.get"]);
        toast("Course updated");
      },
      onError: (e) => {
        toast(e.message);
        reset();
      },
    }
  );
  const { mutate: deleteMutate, isLoading: deleteLoading } = trpc.useMutation(
    "courses.delete",
    {
      onSuccess: () => {
        setDeleteAlert(false);
        if (
          router.query &&
          router.query.new &&
          typeof router.query.new === "string" &&
          router.query.new === "true"
        ) {
          router.push("/courses");
        } else {
          router.back();
        }
        toast("Course deleted");
      },
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(CourseFormValidator),
  });

  const handleAddSchedule = () => {
    const schedules = getValues("weekly_schedule");
    setEditIndex(schedules.length);
    setAddSched(true);
  };

  const handleEditSchedule = (idx: number) => {
    setEditIndex(idx);
    setAddSched(true);
  };

  const onSubmit = ({
    name,
    color,
    start_date,
    end_date,
    weekly_schedule,
  }: CoursePayloadType) => {
    if (type === "create") {
      return createMutate({
        name,
        color,
        start_date: moment(start_date).format("yyyyMMDD"),
        weekly_schedule,
        end_date: end_date ? moment(end_date).format("yyyyMMDD") : undefined,
      });
    }
    if (type === "edit" && id) {
      return editMutate({
        id,
        name,
        color,
        start_date: moment(start_date).format("yyyyMMDD"),
        weekly_schedule,
        end_date: end_date ? moment(end_date).format("yyyyMMDD") : undefined,
      });
    }
  };

  if (createLoading || editLoading) return <Loader />;

  return (
    <Fragment>
      <div className="sm:p-6 p-3">
        <Input
          title="Name"
          required
          type="input"
          placeholder="Insert course name"
          register={register("name")}
          error={errors.name}
        />
        <div className="mt-3 flex flex-row items-center justify-center">
          <div
            className={`w-20 h-10 border border-gray-400 rounded-sm mr-2 ${currColor}`}
          />
          <Select
            label="Select Color *"
            variant="standard"
            className="rounded-sm"
            value={getValues("color")}
            onChange={(e) => {
              if (!e) return;
              const color = getColorThemes(e.toString());
              setCurrColor(color.card);
              setValue("color", e.toString());
            }}
          >
            <Option value="blue">Blue</Option>
            <Option value="orange">Orange</Option>
            <Option value="purple">Purple</Option>
            <Option value="green">Green</Option>
            <Option value="grey">Grey</Option>
          </Select>
        </div>
        <p className="text-sm font-bold text-red-400 mt-1 text-right">
          {errors.color && errors.color.message}
        </p>

        <Input
          title="Start Date"
          required
          type="input"
          inputType="date"
          placeholder="Insert date"
          register={register("start_date")}
          error={errors.start_date}
        />
        <Input
          title="End Date"
          type="input"
          inputType="date"
          placeholder="Insert date"
          register={register("end_date")}
          error={errors.end_date}
        />

        <div className="my-1">
          <div className="flex flex-row mb-1">
            <p className="font-bold text-sm text-gray-700">Weekly Schedule</p>
          </div>
        </div>
        {getValues("weekly_schedule") &&
          getValues("weekly_schedule").map((schedule, idx) => (
            <div
              key={idx}
              className="border rounded-sm border-gray-400 bg-blue-gray-100 p-2 mb-2"
            >
              <p
                className="font-bold capitalize cursor-pointer hover:underline"
                onClick={() => handleEditSchedule(idx)}
              >
                {schedule.day}
              </p>
              <p className="text-sm font-medium">
                {moment(schedule.start_time, "HHmm").format("hh:mm A")} -{" "}
                {moment(schedule.end_time, "HHmm").format("hh:mm A")}
              </p>
            </div>
          ))}

        <AppButton
          type="button"
          label="+ Add Schedule"
          theme="blue-gray"
          variant="outlined"
          css="max-w-[13em] mr-1"
          onClick={() => handleAddSchedule()}
        />
      </div>
      {editIndex !== undefined && (
        <ScheduleModal
          open={addSched}
          handleOpen={() => {
            if (addSched) {
              setAddSched(false);
              setEditIndex(undefined);
            } else {
              setAddSched(true);
            }
          }}
          schedule={
            getValues("weekly_schedule")[editIndex] || {
              day: "monday",
              start_time: "",
              end_time: "",
            }
          }
          getValues={getValues}
          index={editIndex}
          setValue={setValue}
        />
      )}
      <div className="sm:p-6 p-3 flex sm:flex-row gap-1 flex-col sm:items-center items-end justify-end border-t border-blue-gray-100">
        {type === "edit" && (
          <AppButton
            type="button"
            label="Delete"
            theme="red"
            css="max-w-[10em]"
            onClick={() => setDeleteAlert(true)}
          />
        )}
        <AppButton
          type="submit"
          label="Save"
          theme="green"
          css="bg-teal-800 max-w-[10em]"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
      {type === "edit" && (
        <ConfirmModal
          deleteLoading={deleteLoading}
          open={deleteAlert}
          handleOpen={() => setDeleteAlert((alert) => !alert)}
          onConfirm={() => id && deleteMutate({ id })}
        />
      )}
    </Fragment>
  );
};

export default CourseForm;
