import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, User, Clock } from "lucide-react";
import useServiceRequest from "@/hooks/useServiceRequest";
import { format } from "date-fns";

export default function ServiceRequest() {
  const { serviceRequest, loading, error } = useServiceRequest();

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
      <h1 className="text-2xl font-medium mb-6 text-white">Service Requests</h1>

      {serviceRequest.length === 0 ? (
        <p className="text-muted-foreground text-sm">No requests found.</p>
      ) : (
        <div className="space-y-4">
          {serviceRequest.map((req) => (
            <Card
              key={req.id}
              className="p-4 hover:shadow-md transition-shadow rounded-xl"
            >
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

              <div className="flex items-start gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-foreground">{req.message}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
