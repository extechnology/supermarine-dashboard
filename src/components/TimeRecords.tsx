import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, User, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data - replace with your actual data source
const mockRecords = [
  {
    id: 1,
    date: new Date("2024-01-15"),
    guestName: "John Smith",
    activity: "Ski Lesson",
    location: "Beginner Slope",
    duration: "2 hours",
    status: "completed"
  },
  {
    id: 2,
    date: new Date("2024-01-14"),
    guestName: "Sarah Johnson", 
    activity: "Equipment Rental",
    location: "Rental Shop",
    duration: "1 day",
    status: "active"
  },
  {
    id: 3,
    date: new Date("2024-01-13"),
    guestName: "Mike Wilson",
    activity: "Lift Pass",
    location: "Main Lodge",
    duration: "Full day",
    status: "completed"
  },
  {
    id: 4,
    date: new Date("2024-01-12"),
    guestName: "Emma Davis",
    activity: "Snowboard Lesson",
    location: "Advanced Slope", 
    duration: "3 hours",
    status: "cancelled"
  },
  {
    id: 5,
    date: new Date("2024-01-11"),
    guestName: "Robert Brown",
    activity: "Spa Service",
    location: "Wellness Center",
    duration: "90 minutes",
    status: "completed"
  }
];

export const TimeRecords = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filteredRecords, setFilteredRecords] = useState(mockRecords);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const filtered = mockRecords.filter(record => 
        record.date.toDateString() === date.toDateString()
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(mockRecords);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-alpine-green/20 text-alpine-green border-alpine-green/30";
      case "active":
        return "bg-alpine-blue/20 text-alpine-blue border-alpine-blue/30";
      case "cancelled":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Records
            </CardTitle>
            <CardDescription>
              View all guest activities and bookings
            </CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Filter by date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No records found for the selected date.
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{record.guestName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {record.location}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{record.activity}</span>
                    <span className="text-xs text-muted-foreground">{record.duration}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {format(record.date, "MMM dd, yyyy")}
                  </span>
                  <Badge 
                    variant="outline"
                    className={getStatusColor(record.status)}
                  >
                    {record.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
        {selectedDate && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => handleDateSelect(undefined)}
              className="w-full"
            >
              Clear Date Filter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};