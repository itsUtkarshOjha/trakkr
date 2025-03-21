import { Button } from "~/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { days } from "~/lib/constants";
import { WorkoutsWithExercises } from "~/lib/interfaces";
import { useState } from "react";
import { useFetcher } from "react-router-dom";
import { useToast } from "~/hooks/use-toast";
import { SuccessToast } from "~/lib/SuccessToast";

type Props = {
  workout: WorkoutsWithExercises;
};

export function DialogAddToCalendar({ workout }: Props) {
  const fetcher = useFetcher();
  const [selectedDays, setSelectedDays] = useState<string[]>(() => {
    return workout.scheduledAt;
  });
  const { toast } = useToast();
  const message: string = fetcher.data ? fetcher.data.message : "";
  if (message.length > 0) {
    new SuccessToast(message, toast);
    fetcher.data.message = "";
  }
  const handleScheduledAt = () => {
    fetcher.submit(
      {
        selectedDays,
        formType: "SCHEDULE_WORKOUT",
        workoutId: workout.id,
        userId: workout.userId,
      },
      {
        method: "POST",
      }
    );
  };
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Schedule {workout.workoutName}</DialogTitle>
        <DialogDescription>Click save when you&apos;re done.</DialogDescription>
      </DialogHeader>
      <ToggleGroup
        type="multiple"
        defaultValue={workout.scheduledAt}
        onValueChange={(value) => setSelectedDays(value)}
      >
        {days.map((day) => (
          <ToggleGroupItem key={day.day} value={day.day}>
            {day.dayShort}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <DialogFooter>
        <DialogClose>
          <Button onClick={handleScheduledAt}>Save</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
