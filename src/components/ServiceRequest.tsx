import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, User, Clock } from "lucide-react";
import useServiceRequest from "@/hooks/useServiceRequest";
import { format } from "date-fns";
import axiosInstance from "../api/axiosinstace";
import { Download } from "lucide-react";
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

export default function ServiceRequest() {
  const { serviceRequest, loading, error } = useServiceRequest();
  const [filterDate, setFilterDate] = useState<string>("today");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get("/export/service-requests/", {
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
    if (!serviceRequest) return [];

    const today = new Date();
    let dateFilteredRecords = [];

    // First apply date filtering
    if (selectedDate) {
      dateFilteredRecords = serviceRequest.filter(
        (record) =>
          new Date(record.created_at).toDateString() ===
          selectedDate.toDateString()
      );
    } else {
      // If using filterDate
      switch (filterDate) {
        case "today":
          dateFilteredRecords = serviceRequest.filter(
            (record) =>
              new Date(record.created_at).toDateString() ===
              today.toDateString()
          );
          break;

        case "month":
          dateFilteredRecords = serviceRequest.filter((record) => {
            const d = new Date(record.created_at);
            return (
              d.getMonth() === today.getMonth() &&
              d.getFullYear() === today.getFullYear()
            );
          });
          break;

        case "year":
          dateFilteredRecords = serviceRequest.filter(
            (record) =>
              new Date(record.created_at).getFullYear() === today.getFullYear()
          );
          break;

        case "all":
          dateFilteredRecords = serviceRequest;
          break;

        default:
          // Handle specific year
          if (/^\d{4}$/.test(filterDate)) {
            dateFilteredRecords = serviceRequest.filter(
              (record) =>
                new Date(record.created_at).getFullYear() ===
                parseInt(filterDate)
            );
          }
          // Handle specific month (yyyy-MM)
          else if (/^\d{4}-\d{2}$/.test(filterDate)) {
            const [year, month] = filterDate.split("-");
            dateFilteredRecords = serviceRequest.filter((record) => {
              const d = new Date(record.created_at);
              return (
                d.getFullYear() === parseInt(year) &&
                d.getMonth() + 1 === parseInt(month)
              );
            });
          }
          // Handle custom date (yyyy-MM-dd)
          else if (/^\d{4}-\d{2}-\d{2}$/.test(filterDate)) {
            dateFilteredRecords = serviceRequest.filter(
              (record) =>
                new Date(record.created_at).toDateString() ===
                new Date(filterDate).toDateString()
            );
          } else {
            dateFilteredRecords = serviceRequest;
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
  }, [serviceRequest, selectedDate, filterDate, statusFilter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axiosInstance.patch(`/service/${id}/status/`, {
        status: newStatus,
      });
      // Option A: Refresh the list manually
      window.location.reload();
      // Option B: Better -> Optimistically update state inside useBookings
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Loading requests...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm">Failed to load requests.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl content-center font-medium text-white">
          Service Requests
        </h1>
        <div className="flex gap-5 text-white">
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

      {serviceRequest.length === 0 ? (
        <p className="text-muted-foreground text-sm">No requests found.</p>
      ) : (
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No requests found for the selected filter.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((req) => (
                <Card
                  key={req.id}
                  className="p-4 hover:shadow-md transition-shadow rounded-xl"
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{req.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {format(new Date(req.created_at), "dd MMM yyyy, hh:mm a")}
                    </div>
                  </div>

                  {/* Message row */}
                  <div className="flex items-start gap-2 text-sm mb-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-foreground">{req.message}</p>
                  </div>

                  {/* Status dropdown row */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      Status:
                    </span>
                    <Select
                      value={req.status}
                      onValueChange={(value) =>
                        handleStatusChange(req.id, value)
                      }
                    >
                      <SelectTrigger
                        className={`w-[120px] capitalize ${
                          req.status === "reviewed"
                            ? " text-green-700 border-green-300"
                            : " text-red-700 border-red-300"
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
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
