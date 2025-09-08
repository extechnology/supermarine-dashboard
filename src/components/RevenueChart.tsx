import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useBookings from "@/hooks/useBookings";
import { parseISO, format } from "date-fns";

export function RevenueChart() {
  const { bookings, loading, error } = useBookings();

  // transform bookings → chart data
  const chartData = React.useMemo(() => {
    if (!bookings) return [];

    const revenueByMonth: Record<
      string,
      { revenue: number; bookings: number }
    > = {};

    bookings.forEach((b) => {
      const month = format(parseISO(b.date), "MMM"); // e.g. "Aug"
      const price = parseFloat(b.price);

      if (!revenueByMonth[month]) {
        revenueByMonth[month] = { revenue: 0, bookings: 0 };
      }

      revenueByMonth[month].revenue += price;
      revenueByMonth[month].bookings += 1;
    });

    return Object.entries(revenueByMonth).map(([month, values]) => ({
      month,
      ...values,
    }));
  }, [bookings]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>Loading chart...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>Error loading chart.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-foreground text-base sm:text-lg lg:text-xl">
          Revenue Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `AED ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--popover-foreground))",
              }}
              formatter={(value, name) =>
                name === "revenue"
                  ? [`AED ${Number(value).toLocaleString()}`, "Revenue"]
                  : [value, "Bookings"]
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#revenueGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
