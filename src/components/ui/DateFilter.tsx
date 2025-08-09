import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Date Filter Props
interface DateFilterProps {
  FilterDate: string;
  setFilterDate: (value: string) => void;
  title?: string;
}

const DateFilter = ({
  FilterDate,
  setFilterDate,
  title = "Filter by",
}: DateFilterProps) => {
  // Years
  const currentYear = new Date().getFullYear();
  const startYear = 2025;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

  // Months
  const months = [
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

  const isYear = /^\d{4}$/.test(FilterDate);
  const isMonth = /^\d{4}-\d{2}$/.test(FilterDate);
  const isCustomDate =
    !["today", "month", "year", "all"].includes(FilterDate) &&
    !isYear &&
    !isMonth;

  // Determine selected filter type
  const [selectType, setSelectType] = useState<string>(
    ["today", "month", "year", "all"].includes(FilterDate)
      ? FilterDate
      : isYear
      ? "specific-year"
      : isMonth
      ? "specific-month"
      : "custom"
  );

  // State for the popover
  const [openPopover, setOpenPopover] = useState(false);

  // State for custom month
  const [selectedMonth, setSelectedMonth] = useState<string>(
    isMonth ? FilterDate.split("-")[1] : ""
  );
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>(
    isMonth ? FilterDate.split("-")[0] : String(currentYear)
  );

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Filter Type */}
      <Select
        value={selectType}
        onValueChange={(value) => {
          setSelectType(value);
          if (["today", "month", "year", "all"].includes(value)) {
            setFilterDate(value);
          }
        }}
      >
        <SelectTrigger className="w-36 hover:cursor-pointer">
          <SelectValue placeholder={title} />
        </SelectTrigger>

        <SelectContent className="dark:bg-gray-900">
          <SelectItem
            value="today"
            className="dark:hover:bg-gray-800 dark:data-[state=checked]:bg-gray-800"
          >
            Today
          </SelectItem>
          <SelectItem
            value="month"
            className="dark:hover:bg-gray-800 dark:data-[state=checked]:bg-gray-800"
          >
            This Month
          </SelectItem>
          <SelectItem
            value="year"
            className="dark:hover:bg-gray-800 dark:data-[state=checked]:bg-gray-800"
          >
            This Year
          </SelectItem>
          <SelectItem
            value="specific-year"
            className="dark:hover:bg-gray-800 dark:data-[state=checked]:bg-gray-800"
          >
            Specific Year
          </SelectItem>
          <SelectItem
            value="specific-month"
            className="dark:hover:bg-gray-800 dark:data-[state=checked]:bg-gray-800"
          >
            Specific Month
          </SelectItem>
          <SelectItem
            value="custom"
            className="dark:hover:bg-gray-800 dark:data-[state=checked]:bg-gray-800"
          >
            Custom Date
          </SelectItem>
          <SelectItem
            value="all"
            className="dark:hover:bg-gray-800 dark:data-[state=checked]:bg-gray-800"
          >
            All Time
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Specific Year Picker */}
      {selectType === "specific-year" && (
        <Select
          value={isYear ? FilterDate : ""}
          onValueChange={(value) => setFilterDate(value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>

          <SelectContent className="dark:bg-gray-900">
            {years.map((year) => (
              <SelectItem
                key={year}
                value={String(year)}
                className="dark:hover:bg-gray-800 dark:data-[state=checked]:bg-gray-800"
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Specific Month Picker */}
      {selectType === "specific-month" && (
        <div className="flex gap-2">
          {/* Month */}
          <Select
            value={selectedMonth}
            onValueChange={(monthIndex) => {
              setSelectedMonth(monthIndex);
              if (selectedMonthYear) {
                setFilterDate(`${selectedMonthYear}-${monthIndex}`);
              }
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>

            <SelectContent className="dark:bg-gray-900">
              {months.map((month, index) => {
                const monthIndex = String(index + 1).padStart(2, "0");
                return (
                  <SelectItem
                    key={month}
                    value={monthIndex}
                    className="dark:hover:bg-gray-800 dark:data-[state=checked]:bg-gray-800"
                  >
                    {month}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Year */}
          <Select
            value={selectedMonthYear}
            onValueChange={(year) => {
              setSelectedMonthYear(year);
              if (selectedMonth) {
                setFilterDate(`${year}-${selectedMonth}`);
              }
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>

            <SelectContent className="dark:bg-gray-900">
              {years.map((year) => (
                <SelectItem
                  key={year}
                  value={String(year)}
                  className="dark:hover:bg-gray-800 dark:data-[state=checked]:bg-gray-800"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Custom Date Picker */}
      {selectType === "custom" && (
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
          <PopoverTrigger>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !isCustomDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {isCustomDate
                ? format(new Date(FilterDate), "PPP")
                : "Pick a date"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={isCustomDate ? new Date(FilterDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  setFilterDate(format(date, "yyyy-MM-dd"));
                  setOpenPopover(false);
                }
              }}
              initialFocus
              className="p-3 pointer-events-auto dark:bg-gray-900 dark:text-gray-100"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default DateFilter;
