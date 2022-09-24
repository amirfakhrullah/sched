import React, { FocusEventHandler } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

const Input: React.FC<{
  title: string;
  type: "input" | "textarea"; // select which type of input -> "input" - normal input, "textarea" - textarea
  onBlur?: FocusEventHandler<HTMLTextAreaElement> | undefined;
  minRows?: number;
  placeholder: string;
  required?: boolean;
  register: UseFormRegisterReturn;
  error: FieldError | undefined;
}> = ({
  title,
  type,
  onBlur,
  minRows = 7,
  placeholder,
  required = false,
  register,
  error,
}) => {
  return (
    <div className="my-1">
      <div className="flex flex-row mb-1">
        <p className="font-bold text-sm text-gray-700">{title}</p>
        {required && <p className="text-red-400 ml-1">*</p>}
      </div>

      {type === "input" ? (
        <input
          {...register}
          defaultValue=""
          placeholder={placeholder}
          className="py-1 px-2 text-gray-700 border border-gray-400 rounded-sm w-full bg-transparent"
        />
      ) : (
        <TextareaAutosize
          minRows={minRows}
          {...register}
          onBlur={onBlur}
          rows={7}
          defaultValue=""
          placeholder={placeholder}
          className="resize-none text-gray-700 py-1 px-2 border border-gray-400 rounded-sm w-full bg-transparent"
        />
      )}

      <p className="text-sm font-bold text-red-400 mt-1 text-right">
        {error && error.message}
      </p>
    </div>
  );
};

export default Input;
