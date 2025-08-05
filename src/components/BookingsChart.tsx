import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", bookings: 24, serviceBookings: 8 },
  { day: "Tue", bookings: 18, serviceBookings: 12 },
  { day: "Wed", bookings: 32, serviceBookings: 6 },
  { day: "Thu", bookings: 28, serviceBookings: 14 },
  { day: "Fri", bookings: 45, serviceBookings: 18 },
  { day: "Sat", bookings: 67, serviceBookings: 22 },
  { day: "Sun", bookings: 58, serviceBookings: 16 },
];

export function BookingsChart() {
  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-foreground">Weekly Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="day" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--popover-foreground))"
              }}
            />
            <Bar 
              dataKey="bookings" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="serviceBookings" 
              fill="hsl(var(--accent))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}