import {
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = [
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
  "Su",
];

const ExpireDate = () => {
  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 7, 1),
  );

  const [selectedDate, setSelectedDate] = useState(18);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  // Convert Sunday-first JS dates into Monday-first.
  const startingDay =
    firstDay === 0 ? 6 : firstDay - 1;

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1),
    );
    setSelectedDate(18);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1),
    );
    setSelectedDate(18);
  };

  return (
    <div className="h-full w-full select-none">
      <div className="flex h-full items-start justify-center">
        <div className="w-full max-w-md rounded-2xl bg-card p-2 shadow-m shadow-black/5 ring-1 ring-black/5">
          <div className="rounded-lg bg-background p-3 shadow-m shadow-black/5 ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={previousMonth}
                className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <IconChevronLeft size={15} />
              </button>

              <p className="text-sm font-medium text-foreground/90">
                {MONTHS[month]} {year}
              </p>

              <button
                type="button"
                onClick={nextMonth}
                className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <IconChevronRight size={15} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-7">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="flex h-7 items-center justify-center text-[9px] font-medium text-muted-foreground/60"
                >
                  {day}
                </div>
              ))}

              {Array.from({
                length: startingDay,
              }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}

              {Array.from({
                length: daysInMonth,
              }).map((_, index) => {
                const date = index + 1;
                const selected =
                  date === selectedDate;

                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() =>
                      setSelectedDate(date)
                    }
                    className="flex h-8 items-center justify-center"
                  >
                    <span
                      className={`flex size-7 items-center justify-center rounded-lg text-[10px] transition-colors ${
                        selected
                          ? "bg-primary-light-2 text-white shadow-sm ring-1 ring-primary-light-2"
                          : "text-foreground/70 hover:bg-primary-light-1/20"
                      }`}
                    >
                      {date}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2.5">
              <span className="text-[9px] text-muted-foreground">
                Poll closes automatically
              </span>

              <span className="text-[9px] font-medium text-primary-light-2">
                {MONTHS[month]} {selectedDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpireDate;