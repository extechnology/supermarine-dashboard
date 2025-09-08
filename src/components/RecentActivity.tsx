import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Mail, Phone, Wrench, Download } from "lucide-react";
import useEnquiry from "../hooks/useEnquiry";
import { formatDistanceToNow } from "date-fns";
import axiosInstance from "../api/axiosinstace";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DateFilter from "./ui/DateFilter";
import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";

const getIcon = () => <Wrench className="h-5 w-5 text-primary" />;

export function RecentActivity() {
  const { enquiry, loading, error } = useEnquiry();
  const [filterDate, setFilterDate] = useState<string>("today");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("all"); // New state for status filter

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get("/export/enquiry-bookings/", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ServiceRequests.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!enquiry) return [];

    const today = new Date();
    let dateFilteredRecords = [];

    // First apply date filtering
    if (selectedDate) {
      dateFilteredRecords = enquiry.filter(
        (record) =>
          new Date(record.created_at).toDateString() ===
          selectedDate.toDateString()
      );
    } else {
      // If using filterDate
      switch (filterDate) {
        case "today":
          dateFilteredRecords = enquiry.filter(
            (record) =>
              new Date(record.created_at).toDateString() ===
              today.toDateString()
          );
          break;

        case "month":
          dateFilteredRecords = enquiry.filter((record) => {
            const d = new Date(record.created_at);
            return (
              d.getMonth() === today.getMonth() &&
              d.getFullYear() === today.getFullYear()
            );
          });
          break;

        case "year":
          dateFilteredRecords = enquiry.filter(
            (record) =>
              new Date(record.created_at).getFullYear() === today.getFullYear()
          );
          break;

        case "all":
          dateFilteredRecords = enquiry;
          break;

        default:
          // Handle specific year
          if (/^\d{4}$/.test(filterDate)) {
            dateFilteredRecords = enquiry.filter(
              (record) =>
                new Date(record.created_at).getFullYear() ===
                parseInt(filterDate)
            );
          }
          // Handle specific month (yyyy-MM)
          else if (/^\d{4}-\d{2}$/.test(filterDate)) {
            const [year, month] = filterDate.split("-");
            dateFilteredRecords = enquiry.filter((record) => {
              const d = new Date(record.created_at);
              return (
                d.getFullYear() === parseInt(year) &&
                d.getMonth() + 1 === parseInt(month)
              );
            });
          }
          // Handle custom date (yyyy-MM-dd)
          else if (/^\d{4}-\d{2}-\d{2}$/.test(filterDate)) {
            dateFilteredRecords = enquiry.filter(
              (record) =>
                new Date(record.created_at).toDateString() ===
                new Date(filterDate).toDateString()
            );
          } else {
            dateFilteredRecords = enquiry;
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
  }, [enquiry, selectedDate, filterDate, statusFilter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axiosInstance.patch(`/enquiry/${id}/status/`, {
        status: newStatus,
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Enquiry Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Loading enquiries...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Enquiry Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">Failed to load enquiries</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-foreground">Enquiry Bookings</CardTitle>
          <div className="flex items-center gap-4 text-white">
            {/* Updated Status Filter using Select component */}
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

            <Button className="content-center" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              <span>Download Excel</span>
            </Button>
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
      <CardContent>
        <div className="space-y-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors shadow-sm"
              >
                <div className="flex items-center space-x-3 mb-2">
                  {getIcon()}
                  <h3 className="font-semibold text-foreground text-sm truncate">
                    {item.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm items-center">
                  {/* Column 1 */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{item.email}</span>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{item.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {item.date} at {item.time}
                      </span>
                    </div>
                  </div>

                  {/* Column 3 (Status) */}
                  <div className="flex items-end justify-end space-x-2">
                    <Select
                      value={item.status}
                      onValueChange={(value) =>
                        handleStatusChange(item.id, value)
                      }
                    >
                      <SelectTrigger
                        className={`w-[120px] capitalize ${
                          item.status === "reviewed"
                            ? "text-green-700 border-green-300"
                            : "text-red-700 border-red-300"
                        }`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="pending"
                          className="text-red-600 focus:bg-red-300 focus:text-red-600"
                        >
                          Pending
                        </SelectItem>
                        <SelectItem
                          value="reviewed"
                          className="text-green-600 focus:bg-green-300 focus:text-green-600"
                        >
                          Reviewed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                  <span>Duration: {item.duration} min</span>
                  <span>{item.number_of_persons} person(s)</span>
                  <span>
                    {formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              No enquiries found for the selected filter.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
