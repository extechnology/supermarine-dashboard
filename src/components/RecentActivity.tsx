import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, MessageSquare, Wrench } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "booking",
    user: "Sarah Johnson",
    action: "Booked ski lesson package",
    time: "2 minutes ago",
    status: "confirmed"
  },
  {
    id: 2,
    type: "enquiry",
    user: "Mike Chen",
    action: "Enquired about group discounts",
    time: "15 minutes ago",
    status: "pending"
  },
  {
    id: 3,
    type: "service",
    user: "Emma Wilson",
    action: "Requested equipment maintenance",
    time: "1 hour ago",
    status: "in-progress"
  },
  {
    id: 4,
    type: "booking",
    user: "David Brown",
    action: "Cancelled accommodation booking",
    time: "2 hours ago",
    status: "cancelled"
  },
  {
    id: 5,
    type: "enquiry",
    user: "Lisa Taylor",
    action: "Asked about weather conditions",
    time: "3 hours ago",
    status: "resolved"
  }
];

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
  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="text-primary">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.user}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {activity.action}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}