import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";

type Props = {
  id: string;
  handleDelete: (id: string) => void;
  isSubmitting: boolean;
  className?: string;
};

export default function DeletionConfirmation({
  handleDelete,
  id,
  isSubmitting,
  className,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="destructive"
          className={`rounded-full ${className}`}
          disabled={isSubmitting}
        >
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-lg">
          Are you sure you want to delete this?
        </DialogHeader>
        <p className="font-light text-sm">This action will be irreversible.</p>
        <DialogFooter>
          <Button
            variant="destructive"
            className="rounded-full"
            onClick={() => handleDelete(id)}
            disabled={isSubmitting}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
