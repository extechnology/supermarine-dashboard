import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Mail, Phone, Wrench, Download } from "lucide-react";
import useEnquiry from "../hooks/useEnquiry";
import { formatDistanceToNow } from "date-fns";
import useServiceRequest from "@/hooks/useServiceRequest";
import axiosInstance from "../api/axiosinstace";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const getIcon = () => <Wrench className="h-5 w-5 text-primary" />;


export function RecentActivity() {
  const { enquiry, loading, error } = useEnquiry();
  const {
    serviceRequest,
    loading: loadingServiceRequest,
    error: errorServiceRequest,
  } = useServiceRequest();

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
          <Button className="content-center" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            <span>Download Excel</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enquiry.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors shadow-sm"
            >
              <div className="flex items-center space-x-3 mb-2">
                {getIcon()}
                <h3 className="font-semibold text-foreground text-sm truncate">
                  {item.title}
                </h3>
                {/* <Badge className={getStatusColor("pending")}>Pending</Badge> */}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
