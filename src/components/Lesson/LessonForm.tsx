import { useRouter } from "next/router";
import React, { Fragment } from "react";
import {
  CreateLessonPayloadType,
  CreateLessonPayloadValidator,
} from "../../helpers/validations/lessons";
import { trpc } from "../../utils/trpc";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import { Button } from "@material-tailwind/react";
import AppButton from "../AppButton";
import Markdown from "../Markdown";
import Loader from "../Loader";
import ConfirmModal from "../ConfirmModal";
import { toast } from "react-toastify";

const LessonForm: React.FC<{
  type: "create" | "edit";
  id?: string;
  initialValues: CreateLessonPayloadType;
  colors: {
    card: string;
    tag: string;
    hex: string;
  };
}> = ({ type, id, initialValues, colors }) => {
  const router = useRouter();
  const utils = trpc.useContext();

  const [editMode, setEditMode] = useState(type === "create");
  const [preview, setPreview] = useState(false);
  const [tagValue, setTagValue] = useState("");
  const [tagsRefresh, setTagsRefresh] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  const { mutate: createMutate, isLoading: createLoading } = trpc.useMutation(
    "lessons.create",
    {
      onSuccess: ({ id: lessonId, date: lessonDate }) => {
        router.push({
          pathname: `/notes/${lessonId}`,
          query: {
            new: lessonDate,
          },
        });
        toast.success("Note created");
      },
      onError: (e) => {
        setIsLoadingCreate(false);
        toast.error(e.message);
      },
    }
  );
  const { mutate: editMutate, isLoading: editLoading } = trpc.useMutation(
    "lessons.update",
    {
      onSuccess: () => {
        setEditMode(false);
        setPreview(false);
        toast.success("Note updated");
        utils.invalidateQueries(["lessons.get"]);
      },
    }
  );
  const { mutate: deleteMutate, isLoading: deleteLoading } = trpc.useMutation(
    "lessons.delete",
    {
      onSuccess: () => {
        setDeleteAlert(false);
        if (
          router.query &&
          router.query.new &&
          typeof router.query.new === "string"
        ) {
          router.push({
            pathname: "/",
            query: {
              id: router.query.new,
            },
          });
        } else {
          router.back();
        }
        toast.success("Note deleted");
      },
    }
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(CreateLessonPayloadValidator),
  });

  const handleTagsKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (tagValue.length === 0) {
      return;
    }
    if (e.key === "Enter") {
      const currentTags = getValues("tags");
      setValue("tags", [...currentTags, tagValue.toLowerCase().trimEnd()]);
      return setTagValue("");
    }
  };

  const handleAddTags = () => {
    if (tagValue.length === 0) {
      return;
    }
    const currentTags = getValues("tags");
    setValue("tags", [...currentTags, tagValue.toLowerCase().trimEnd()]);
    return setTagValue("");
  };

  const handleDeleteTags = (value: string) => {
    setTagsRefresh(true);
    const currentTags = getValues("tags");
    setValue("tags", [...currentTags.filter((tag) => tag !== value)]);
    setTimeout(() => {
      setTagsRefresh(false);
    }, 100);
  };

  const onSubmit = ({
    scheduleId,
    date,
    note,
    tags,
    unit,
  }: CreateLessonPayloadType) => {
    if (type === "create") {
      setIsLoadingCreate(true);
      return createMutate({
        scheduleId,
        date,
        note,
        tags,
        unit,
      });
    }
    if (type === "edit" && id) {
      return editMutate({
        id,
        note,
        tags,
        unit,
      });
    }
  };

  if (createLoading || editLoading || isLoadingCreate)
    return <Loader />;

  return (
    <Fragment>
      <div className="sm:p-6 p-3">
        {editMode && (
          <div className="flex flex-row items-center justify-end">
            <AppButton
              type="button"
              label={preview ? "Exit Preview" : "See Preview"}
              theme="blue-gray"
              variant="outlined"
              css="max-w-[12em]"
              onClick={() => setPreview((prev) => !prev)}
            />
          </div>
        )}
        {editMode && !preview ? (
          <>
            <Input
              title="Unit"
              required
              type="input"
              placeholder="Insert title"
              register={register("unit")}
              error={errors.unit}
            />
            <Input
              title="Notes"
              required
              type="textarea"
              onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) =>
                setValue("note", e.target.value.trim())
              }
              placeholder="Insert notes here..."
              register={register("note")}
              error={errors.note}
            />

            {/* Tags */}
            <div className="my-1">
              <div className="flex flex-row mb-1">
                <p className="font-bold text-sm text-gray-700">Tags</p>
              </div>
              {!tagsRefresh ? (
                <div className="flex flex-wrap gap-1">
                  {getValues("tags") &&
                    getValues("tags").map((val, idx) => (
                      <div
                        key={`tags__${idx}`}
                        onClick={() => handleDeleteTags(val)}
                        className={`inline-flex flex-row items-center px-2 rounded-sm ${colors.tag}`}
                      >
                        <p className="text-sm text-white">{val}</p>
                        <p className="cursor-pointer text-sm text-white ml-1 font-bold">
                          x
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p>Loading...</p>
              )}
              <div className="flex flex-row items-center">
                <input
                  placeholder="Insert tag and press enter or click add button"
                  value={tagValue}
                  onKeyDown={handleTagsKeyPress}
                  onChange={(e) => setTagValue(e.currentTarget.value)}
                  className="mr-1 py-1 px-2 text-gray-700 border border-gray-400 rounded-sm w-full bg-transparent"
                />
                <Button
                  onClick={() => handleAddTags()}
                  color="green"
                  className="bg-teal-800 rounded-sm"
                >
                  Add
                </Button>
              </div>
              <p className="text-sm font-bold text-red-400 mt-1 text-right">
                {errors.tags && errors.tags.message}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-row items-start">
              <div
                className={`inline-block px-2 rounded-sm mr-1 ${colors.tag}`}
              >
                <p className="text-sm text-white">unit</p>
              </div>
              <p className="text-sm text-black">{getValues("unit")}</p>
            </div>

            <Markdown>{getValues("note")}</Markdown>

            <div className="flex flex-wrap gap-1 mb-1">
              {getValues("tags") &&
                getValues("tags").map((val, idx) => (
                  <div
                    key={idx}
                    className={`inline-block px-2 rounded-sm ${colors.tag}`}
                  >
                    <p className="text-sm text-white">{val}</p>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

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
        {type === "edit" && editMode && (
          <AppButton
            type="button"
            label="Cancel"
            theme="blue-gray"
            variant="outlined"
            css="max-w-[10em]"
            onClick={() => {
              reset();
              setEditMode(false);
              setPreview(false);
            }}
          />
        )}
        {type === "edit" && !editMode && (
          <AppButton
            type="button"
            label="Edit"
            theme="blue-gray"
            variant="outlined"
            css="max-w-[10em]"
            onClick={() => setEditMode((mode) => !mode)}
          />
        )}
        {editMode && (
          <AppButton
            type="submit"
            label="Save"
            theme="green"
            css="bg-teal-800 max-w-[10em]"
            onClick={handleSubmit(onSubmit)}
          />
        )}
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

export default LessonForm;
