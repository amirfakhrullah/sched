import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import React from "react";
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import { ThreeDots } from "react-loader-spinner";
import AppButton from "./AppButton";

/**
 * Make sure to wrap parents component with React.Fragment
 */
const ConfirmModal: React.FC<{
  open: boolean;
  handleOpen: () => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
  deleteLoading?: boolean;
}> = ({
  open,
  handleOpen,
  title,
  description,
  onConfirm,
  deleteLoading = false,
}) => {
  return (
    <Dialog open={open} handler={handleOpen} className="rounded-sm max-w-lg w-[95vw] mx-auto">
      <DialogHeader className="pb-0">
        <h3 className="text-black overflow-hidden font-oswald text-md font-medium mb-1">
          {title || "Are you sure you want to delete this?"}
        </h3>
      </DialogHeader>
      {deleteLoading ? (
        <>
          <div className="w-full flex items-center justify-center py-5">
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color="#115e59"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              visible={true}
            />
          </div>
        </>
      ) : (
        <>
          <DialogBody className="py-0">
            {description || "This action is permanent."}
          </DialogBody>
          <DialogFooter>
            <AppButton
              label="Cancel"
              css="max-w-[10em] mr-2"
              theme="blue-gray"
              variant="outlined"
              onClick={() => handleOpen()}
              icon={<AiOutlineClose className="text-lg mr-1" />}
            />
            <AppButton
              label="Confirm"
              css="bg-red-600 max-w-[10em]"
              theme="red"
              onClick={() => onConfirm()}
              icon={<AiFillDelete className="text-white text-lg mr-1" />}
            />
          </DialogFooter>
        </>
      )}
    </Dialog>
  );
};

export default ConfirmModal;
