import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, User, MapPin } from "lucide-react";
import useBookings from "@/hooks/useBookings";
import DateFilter from "./ui/DateFilter";

// Date formatting function
const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// Date filter button
// const DateFilter = () => (
//   <Button variant="outline" className="w-full sm:w-auto">
//     <CalendarIcon className="mr-2 h-4 w-4" />
//     Filter by Date
//   </Button>
// );

// Status color helper
const getStatusColor = (date: string) => {
  const today = new Date();
  const bookingDate = new Date(date);

  if (bookingDate.toDateString() === today.toDateString()) {
    return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"; // active
  } else if (bookingDate < today) {
    return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"; // completed
  } else {
    return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"; // upcoming
  }
};

export const TimeRecords = () => {
  const { bookings, loading: isLoading, error: isError } = useBookings();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [filterDate, setFilterDate] = useState<string>("today");

  useEffect(() => {
    console.log("Filter changed:", filterDate);
  }, [filterDate]);

  const filteredRecords = useMemo(() => {
    if (!bookings) return [];

    const today = new Date();

    // If exact date from calendar is selected
    if (selectedDate) {
      return bookings.filter(
        (record) =>
          new Date(record.date).toDateString() === selectedDate.toDateString()
      );
    }

    // If using filterDate
    switch (filterDate) {
      case "today":
        return bookings.filter(
          (record) =>
            new Date(record.date).toDateString() === today.toDateString()
        );

      case "month":
        return bookings.filter((record) => {
          const d = new Date(record.date);
          return (
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
          );
        });

      case "year":
        return bookings.filter(
          (record) =>
            new Date(record.date).getFullYear() === today.getFullYear()
        );

      case "all":
        return bookings;

      default:
        // Handle specific year
        if (/^\d{4}$/.test(filterDate)) {
          return bookings.filter(
            (record) =>
              new Date(record.date).getFullYear() === parseInt(filterDate)
          );
        }

        // Handle specific month (yyyy-MM)
        if (/^\d{4}-\d{2}$/.test(filterDate)) {
          const [year, month] = filterDate.split("-");
          return bookings.filter((record) => {
            const d = new Date(record.date);
            return (
              d.getFullYear() === parseInt(year) &&
              d.getMonth() + 1 === parseInt(month)
            );
          });
        }

        // Handle custom date (yyyy-MM-dd)
        if (/^\d{4}-\d{2}-\d{2}$/.test(filterDate)) {
          return bookings.filter(
            (record) =>
              new Date(record.date).toDateString() ===
              new Date(filterDate).toDateString()
          );
        }

        return bookings;
    }
  }, [bookings, selectedDate, filterDate]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Time Records</CardTitle>
          <CardDescription>Loading bookings...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Time Records</CardTitle>
          <CardDescription>Error loading bookings.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-none">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Clock className="h-5 w-5 flex-shrink-0" />
              Time Records
            </CardTitle>
            <CardDescription className="text-sm">
              View all guest bookings and activities
            </CardDescription>
          </div>
          <div className="flex-shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <DateFilter
                  FilterDate={filterDate}
                  setFilterDate={setFilterDate}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-3">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-muted-foreground text-sm sm:text-base">
                No records found for the selected date.
              </div>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                className="p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium truncate">
                        {record.name}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(
                        record.date
                      )} text-xs flex-shrink-0 ml-2`}
                    >
                      {new Date(record.date) < new Date()
                        ? "completed"
                        : "upcoming"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{record.title}</span>
                      <span className="text-muted-foreground">
                        • {record.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{record.email}</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {formatDate(new Date(record.date))} at {record.time}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-6 min-w-0 flex-1">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium truncate">
                          {record.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{record.email}</span>
                      </div>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">
                        {record.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {record.duration}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(new Date(record.date))} at {record.time}
                    </span>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(
                        record.date
                      )} whitespace-nowrap`}
                    >
                      {new Date(record.date) < new Date()
                        ? "completed"
                        : "upcoming"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedDate && (
          <div className="mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setSelectedDate(undefined)}
              className="w-full sm:w-auto"
              size="sm"
            >
              Clear Date Filter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
