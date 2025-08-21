import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, MessageSquare, Wrench } from "lucide-react";
import useEnquiry from "@/hooks/useEnquiry";
import { formatDistanceToNow } from "date-fns";

// Utility: map enquiry to activity type
const getIcon = (type: string) => {
  switch (type) {
    case "booking":
      return <User className="h-4 w-4" />;
    case "enquiry":
      return <MessageSquare className="h-4 w-4" />;
    case "service":
      return <Wrench className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

// Utility: badge color per status
const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-accent text-accent-foreground";
    case "pending":
      return "bg-secondary text-secondary-foreground";
    case "in-progress":
      return "bg-primary text-primary-foreground";
    case "cancelled":
      return "bg-destructive text-destructive-foreground";
    case "resolved":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function RecentActivity() {
  const { enquiry, loading, error } = useEnquiry();

  if (loading) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Service Requests</CardTitle>
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
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
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
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enquiry.slice(0, 5).map((enquiry) => (
            <div
              key={enquiry.id}
              className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="text-primary">{getIcon("enquiry")}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {enquiry.name} ({enquiry.title})
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  Duration: {enquiry.duration} min • {enquiry.number_of_persons}{" "}
                  person(s)
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Badge className={getStatusColor("pending")}>pending</Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(enquiry.created_at), {
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
