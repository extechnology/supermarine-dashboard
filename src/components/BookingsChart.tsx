import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import useBookings from "../hooks/useBookings";
import { useMemo } from "react";
import type { Booking } from "../types";

// ----------------------------
// Types

interface ChartData {
  day: string;
  bookings: number;
  serviceBookings: number;
}

// ----------------------------
// Utils
// ----------------------------
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Transform API bookings -> Chart weekly data
 */
const transformBookings = (bookings: Booking[]): ChartData[] => {
  // initialize weekly slots
  const weekData: ChartData[] = days.map((day) => ({
    day,
    bookings: 0,
    serviceBookings: 0,
  }));

  bookings.forEach((b) => {
    const d = new Date(b.date);
    const dayName = days[d.getDay()];

    const isService = b.title.toLowerCase().includes("service");

    const target = weekData.find((wd) => wd.day === dayName);
    if (target) {
      if (isService) {
        target.serviceBookings += 1;
      } else {
        target.bookings += 1;
      }
    }
  });

  return weekData;
};

// ----------------------------
// Tooltip Component
// ----------------------------
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className="text-xs mb-1"
            style={{ color: entry.color }}
          >
            <span className="font-medium">
              {entry.name === "bookings" ? "Main Bookings" : "Service Bookings"}
              :
            </span>
            <span className="ml-1 font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ----------------------------
// Component
// ----------------------------
export function BookingsChart() {
  const { bookings, loading, error } = useBookings();
  const chartData = useMemo(() => transformBookings(bookings || []), [bookings]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log("bookings:", bookings);

  // Transform only when bookings change

  const totalBookings = chartData.reduce((sum, d) => sum + d.bookings, 0);
  const totalServiceBookings = chartData.reduce(
    (sum, d) => sum + d.serviceBookings,
    0
  );

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">Loading bookings...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-red-500">
          Error loading bookings
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Title + mobile total */}
          <div className="space-y-2">
            <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Weekly Bookings
            </CardTitle>
            <div className="flex sm:hidden gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Total: {totalBookings + totalServiceBookings}</span>
              </div>
            </div>
          </div>

          {/* Desktop summary */}
          <div className="hidden sm:flex gap-6 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="font-semibold text-foreground">
                {totalBookings}
              </div>
              <div className="text-xs">Main Bookings</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-foreground">
                {totalServiceBookings}
              </div>
              <div className="text-xs">Service Bookings</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
              formatter={(value: string) => (
                <span style={{ color: "hsl(var(--foreground))" }}>
                  {value === "bookings" ? "Main Bookings" : "Service Bookings"}
                </span>
              )}
            />
            <Bar
              dataKey="bookings"
              name="bookings"
              fill="rgb(59, 130, 246)"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
            <Bar
              dataKey="serviceBookings"
              name="serviceBookings"
              fill="rgb(147, 51, 234)"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
