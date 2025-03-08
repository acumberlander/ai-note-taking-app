import React from "react";
import {
  Button,
  Dialog,
  Checkbox,
  Typography,
  DialogBody,
  IconButton,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function DeleteModal() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        className="p-4"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <DialogHeader
          className="relative m-0 block"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Typography
            variant="h4"
            color="blue-gray"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Are you sure you want to delete these notes?
          </Typography>
          <Typography
            className="mt-1 font-normal text-gray-600"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Select or deselect the notes you want to delete.
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={handleOpen}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <XMarkIcon className="h-4 w-4 stroke-2 hover:bg-red-700" />
          </IconButton>
        </DialogHeader>
        <DialogBody
          className="space-y-4 px-2"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Checkbox
            label={
              <div>
                <Typography
                  color="blue-gray"
                  className="font-medium"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Webinars
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-normal"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Interested in attending webinars and online events.
                </Typography>
              </div>
            }
            containerProps={{
              className: "-mt-5",
            }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
        </DialogBody>
        <DialogFooter
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Button
            className="ml-auto bg-gray-500 px-4 py-1 rounded"
            onClick={handleOpen}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Cancel
          </Button>
          <Button
            className="ml-auto bg-red-500 px-4 py-1 rounded"
            color="white"
            onClick={handleOpen}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
