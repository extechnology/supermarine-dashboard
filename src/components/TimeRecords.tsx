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
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Download,
} from "lucide-react";
import useBookings from "@/hooks/useBookings";
import DateFilter from "./ui/DateFilter";
import axiosInstance from "../api/axiosinstace";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const TimeRecords = () => {
  const { bookings, loading: isLoading, error: isError } = useBookings();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [filterDate, setFilterDate] = useState<string>("today");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get("/export/bookings/", {
        params: { filter: filterDate }, // pass filter if needed
        responseType: "blob", // important for file downloads
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Bookings.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const formatDuration = (duration: string): string => {
    // Handle day + time (e.g., "1 00:00:00")
    const [dayPart, timePart] = duration.includes(" ")
      ? duration.split(" ")
      : [null, duration];

    const [hh, mm, ss] = timePart.split(":").map(Number);
    const parts: string[] = [];

    if (dayPart) {
      const days = Number(dayPart);
      if (days === 1 && hh === 0 && mm === 0 && ss === 0) {
        return "One day";
      }
      parts.push(`${days} day${days > 1 ? "s" : ""}`);
    }

    if (hh) parts.push(`${hh} hr${hh > 1 ? "s" : ""}`);
    if (mm) parts.push(`${mm} min`);
    if (!hh && !mm && ss) parts.push(`${ss} sec`);

    return parts.join(" ") || duration;
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axiosInstance.patch(`/bookings/${id}/status/`, {
        status: newStatus,
      });
      // Option A: Refresh the list manually
      window.location.reload();
      // Option B: Better -> Optimistically update state inside useBookings
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  useEffect(() => {
    console.log("Filter changed:", filterDate);
  }, [filterDate]);

  const filteredRecords = useMemo(() => {
    if (!bookings) return [];

    const today = new Date();
    let dateFilteredRecords = [];

    // First apply date filtering
    if (selectedDate) {
      dateFilteredRecords = bookings.filter(
        (record) =>
          new Date(record.date).toDateString() === selectedDate.toDateString()
      );
    } else {
      // If using filterDate
      switch (filterDate) {
        case "today":
          dateFilteredRecords = bookings.filter(
            (record) =>
              new Date(record.created_at).toDateString() ===
              today.toDateString()
          );
          break;

        case "month":
          dateFilteredRecords = bookings.filter((record) => {
            const d = new Date(record.created_at);
            return (
              d.getMonth() === today.getMonth() &&
              d.getFullYear() === today.getFullYear()
            );
          });
          break;

        case "year":
          dateFilteredRecords = bookings.filter(
            (record) =>
              new Date(record.created_at).getFullYear() === today.getFullYear()
          );
          break;

        case "all":
          dateFilteredRecords = bookings;
          break;

        default:
          // Handle specific year
          if (/^\d{4}$/.test(filterDate)) {
            dateFilteredRecords = bookings.filter(
              (record) =>
                new Date(record.date).getFullYear() === parseInt(filterDate)
            );
          }
          // Handle specific month (yyyy-MM)
          else if (/^\d{4}-\d{2}$/.test(filterDate)) {
            const [year, month] = filterDate.split("-");
            dateFilteredRecords = bookings.filter((record) => {
              const d = new Date(record.date);
              return (
                d.getFullYear() === parseInt(year) &&
                d.getMonth() + 1 === parseInt(month)
              );
            });
          }
          // Handle custom date (yyyy-MM-dd)
          else if (/^\d{4}-\d{2}-\d{2}$/.test(filterDate)) {
            dateFilteredRecords = bookings.filter(
              (record) =>
                new Date(record.date).toDateString() ===
                new Date(filterDate).toDateString()
            );
          } else {
            dateFilteredRecords = bookings;
          }
          break;
      }
    }

    // Then apply status filtering
    if (statusFilter === "all") {
      return dateFilteredRecords;
    } else {
      return dateFilteredRecords.filter(
        (record) => record.status === statusFilter
      );
    }
  }, [bookings, selectedDate, filterDate, statusFilter]);

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
              Booking Time Records
            </CardTitle>
            <CardDescription className="text-sm">
              View all guest bookings and activities
            </CardDescription>
          </div>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] bg-background border-border text-foreground">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <Button className="content-center" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                <span>Download Excel</span>
              </Button>
            </div>
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
                No records found for the selected filter.
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
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(new Date(record.date))} at {record.time}
                      </span>
                      <Select
                        value={record.status}
                        onValueChange={(value) =>
                          handleStatusChange(record.id, value)
                        }
                      >
                        <SelectTrigger
                          className={`w-[120px] ${
                            record.status === "reviewed"
                              ? " text-green-700 border-green-300"
                              : " text-red-700 border-red-300"
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                        {formatDuration(record.duration)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {record.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        Booking Date : {formatDate(new Date(record.created_at))}{" "}
                        at {record.time}
                      </span>
                      <Select
                        value={record.status}
                        onValueChange={(value) =>
                          handleStatusChange(record.id, value)
                        }
                      >
                        <SelectTrigger
                          className={`w-[120px] ${
                            record.status === "reviewed"
                              ? " text-green-700 border-green-300"
                              : " text-red-700 border-red-300"
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
