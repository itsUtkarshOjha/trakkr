import { Image } from "@prisma/client";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Button } from "./ui/button";
import DeletionConfirmation from "./delete-confirm-dialog";
import { useFetcher } from "@remix-run/react";
import { useToast } from "~/hooks/use-toast";
import { SuccessToast } from "~/lib/SuccessToast";

type Props = {
  images: Image[];
};

export default function WorkoutLogImages({ images }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const fetcher = useFetcher();
  const { toast } = useToast();
  const message =
    fetcher.data && fetcher.data.message ? fetcher.data.message : "";
  if (message.length > 0) {
    new SuccessToast(message, toast);
    fetcher.data.message = "";
  }
  const handleImageDelete = (id: string) => {
    fetcher.submit(
      {
        formType: "DELETE_IMAGE",
        imageId: id,
      },
      {
        method: "DELETE",
      }
    );
  };
  const slides = images.map((image) => ({
    src: image.url,
  }));
  const isSubmitting = fetcher.state === "submitting";
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {images.map((image, i) => (
          <div className="relative">
            <img
              src={image.url}
              key={image.id}
              alt="Workout log image"
              className="relative cursor-pointer w-full h-48 object-cover rounded-lg shadow-md hover:opacity-80 transition-all duration-200 transform hover:scale-105"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
            />
            <DeletionConfirmation
              id={image.id}
              handleDelete={(id) => handleImageDelete(id)}
              isSubmitting={isSubmitting}
              className="absolute top-2 right-2 bg-transparent hover:bg-destructive"
            />
          </div>
        ))}
      </div>
      {open && (
        <Lightbox
          slides={slides}
          open={open}
          index={index}
          close={() => setOpen(false)}
        />
      )}
    </>
  );
}
