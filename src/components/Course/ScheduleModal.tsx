import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Option,
  Select,
} from "@material-tailwind/react";
import { Day } from "@prisma/client";
import React from "react";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";
import AppButton from "../AppButton";
import Input from "../Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import moment from "moment";

const ScheduleInputValidator = z.object({
  id: z.string().max(255).optional(),
  day: z.nativeEnum(Day),
  start_time: z.string().min(5).max(255),
  end_time: z.string().min(5).max(255),
});
type ScheduleInputType = z.infer<typeof ScheduleInputValidator>;

const ScheduleModal: React.FC<{
  open: boolean;
  index: number;
  handleOpen: () => void;
  schedule: ScheduleInputType;
  setValue: UseFormSetValue<{
    end_date?: string | undefined;
    name: string;
    start_date: string;
    color: string;
    weekly_schedule: {
      id?: string | undefined;
      day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
      start_time: string;
      end_time: string;
    }[];
  }>;
  getValues: UseFormGetValues<{
    end_date?: string | undefined;
    name: string;
    start_date: string;
    color: string;
    weekly_schedule: {
      id?: string | undefined;
      day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
      start_time: string;
      end_time: string;
    }[];
  }>;
}> = ({
  schedule,
  open,
  handleOpen,
  index,
  setValue: setFormValue,
  getValues: getFormValues,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...schedule,
      start_time: schedule.start_time
        ? moment(schedule.start_time, "hhmm").format("hh:mm")
        : "",
      end_time: schedule.end_time
        ? moment(schedule.end_time, "hhmm").format("hh:mm")
        : "",
    },
    resolver: zodResolver(ScheduleInputValidator),
  });

  const onSubmit = (inputs: ScheduleInputType) => {
    const finalValues = {
      ...inputs,
      start_time: moment(inputs.start_time, "hh:mm").format("hhmm"),
      end_time: moment(inputs.end_time, "hh:mm").format("hhmm"),
    };
    const schedules = getFormValues("weekly_schedule");
    if (index === schedules.length) {
      setFormValue("weekly_schedule", [...schedules, finalValues]);
    } else {
      schedules[index] = finalValues;
      setFormValue("weekly_schedule", schedules);
    }
    handleOpen();
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="rounded-sm max-w-3xl w-[95vw] mx-auto"
    >
      <DialogHeader className="bg-teal-800">
        <h3 className="text-white overflow-hidden font-oswald text-md font-medium">
          Schedule Form
        </h3>
      </DialogHeader>
      <DialogBody
        divider
        className="flex flex-col items-start max-h-[60vh] overflow-y-auto"
      >
        <Select
          label="Select Day"
          variant="standard"
          value={getValues("day")}
          className="rounded-sm"
          onChange={(e) => {
            if (!e) return;
            setValue("day", e.toString() as Day);
          }}
        >
          <Option value="monday">Monday</Option>
          <Option value="tuesday">Tuesday</Option>
          <Option value="wednesday">Wednesday</Option>
          <Option value="thursday">Thursday</Option>
          <Option value="friday">Friday</Option>
        </Select>
        <Input
          title="Start Time"
          type="input"
          inputType="time"
          placeholder="Insert time"
          register={register("start_time")}
          error={errors.start_time}
        />
        <Input
          title="End Time"
          type="input"
          inputType="time"
          placeholder="Insert time"
          register={register("end_time")}
          error={errors.end_time}
        />
      </DialogBody>
      <DialogFooter>
        <AppButton
          label="Cancel"
          type="button"
          css="max-w-[10em] mr-1"
          theme="blue-gray"
          variant="outlined"
          onClick={() => handleOpen()}
        />
        <AppButton
          label="Save"
          type="submit"
          css="max-w-[10em] bg-teal-800"
          theme="green"
          onClick={handleSubmit(onSubmit)}
        />
      </DialogFooter>
    </Dialog>
  );
};

export default ScheduleModal;
