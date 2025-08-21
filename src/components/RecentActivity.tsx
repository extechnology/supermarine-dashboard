import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Mail, Phone, Wrench } from "lucide-react";
import useEnquiry from "../hooks/useEnquiry";
import { formatDistanceToNow } from "date-fns";
import useServiceRequest from "@/hooks/useServiceRequest";

const getIcon = () => <Wrench className="h-5 w-5 text-primary" />;

// Utility: badge color per status (for now, keeping pending as default)
const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "resolved":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function RecentActivity() {
  const { enquiry, loading, error } = useEnquiry();
  const { serviceRequest, loading: loadingServiceRequest, error: errorServiceRequest } = useServiceRequest();
  console.log("service:", serviceRequest);

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
        <CardTitle className="text-foreground">Enquiry Bookings</CardTitle>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{item.email}</span>
                </div>
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
