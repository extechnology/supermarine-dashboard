import { useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { RevenueChart } from "@/components/RevenueChart";
import { BookingsChart } from "@/components/BookingsChart";
import { RecentActivity } from "@/components/RecentActivity";
import { TimeRecords } from "@/components/TimeRecords";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  MessageCircle,
  Settings,
  Mountain,
  TrendingUp,
  LogOut,
} from "lucide-react";
import heroImage from "@/assets/ski-resort-hero.jpg";
import { toast } from "sonner";
import useBookings from "../hooks/useBookings";
import useEnquiry from "../hooks/useEnquiry";
import useServiceRequest from "../hooks/useServiceRequest";
import ServiceRequest from "@/components/ServiceRequest";

function calculatePercentageChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const change = ((current - previous) / previous) * 100;
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

const Index = () => {
  const { bookings, loading: isLoading, error } = useBookings();
  const { enquiry, loading: enquiriesLoading } = useEnquiry();
  const {
    serviceRequest,
    loading,
    error: serviceRequestError,
  } = useServiceRequest();

  const [isUserAuthenticated, setUserAuthenticated] = useState(false);
  const enquiriesByMonth: Record<string, number> = {};
  enquiry?.forEach((e) => {
    const monthKey = new Date(e.created_at).toISOString().slice(0, 7);
    enquiriesByMonth[monthKey] = (enquiriesByMonth[monthKey] || 0) + 1;
  });
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1)
    .toISOString()
    .slice(0, 7);
  // use the same 'now' variable later in the code

  const currentEnquiries = enquiriesByMonth[currentMonth] || 0;
  const prevEnquiries = enquiriesByMonth[prevMonth] || 0;

  const enquiriesChange = calculatePercentageChange(
    currentEnquiries,
    prevEnquiries
  );
  // Calculate stats
  const totalBookings = bookings?.length ?? 0;
  const totalRevenue = bookings
    ? bookings.reduce((sum, b) => sum + parseFloat(b.price), 0).toFixed(2)
    : "0.00";

  const bookingsByMonth: Record<string, number> = {};
  bookings?.forEach((b) => {
    const monthKey = new Date(b.created_at).toISOString().slice(0, 7); // YYYY-MM
    bookingsByMonth[monthKey] = (bookingsByMonth[monthKey] || 0) + 1;
  });

  const revenueByMonth: Record<string, number> = {};
  bookings?.forEach((b) => {
    const monthKey = new Date(b.created_at).toISOString().slice(0, 7);
    revenueByMonth[monthKey] =
      (revenueByMonth[monthKey] || 0) + parseFloat(b.price);
  });

  // === Current & Previous month ===

  const currentBookings = bookingsByMonth[currentMonth] || 0;
  const prevBookings = bookingsByMonth[prevMonth] || 0;

  const currentRevenue = revenueByMonth[currentMonth] || 0;
  const prevRevenue = revenueByMonth[prevMonth] || 0;

  // === Percentage Changes ===
  const bookingChange = calculatePercentageChange(
    currentBookings,
    prevBookings
  );
  const revenueChange = calculatePercentageChange(currentRevenue, prevRevenue);

  const totalRequests = serviceRequest.length;

  // Compute change (this week vs last week)
  const startOfThisWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  const thisWeekRequests = serviceRequest.filter(
    (req) => new Date(req.created_at) >= startOfThisWeek
  ).length;

  const lastWeekRequests = serviceRequest.filter(
    (req) =>
      new Date(req.created_at) >= startOfLastWeek &&
      new Date(req.created_at) < startOfThisWeek
  ).length;

  let change = 0;
  let changeType: "positive" | "negative" | "neutral" = "neutral";

  if (lastWeekRequests > 0) {
    change = ((thisWeekRequests - lastWeekRequests) / lastWeekRequests) * 100;
    changeType = change >= 0 ? "positive" : "negative";
  }
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    toast.success("You have been logged out.");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Hero Section */}
      <div className="relative h-64 bg-cover bg-[url('/dashboard.jpg')] bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Super Marine Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                  Monitor bookings, revenue, and inquiries in real-time
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="bg-card/80 backdrop-blur-sm  text-white hover:bg-card"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Bookings"
            value={isLoading ? "Loading..." : currentBookings.toString()}
            change={`${bookingChange} from last month`}
            changeType={
              currentBookings >= prevBookings ? "positive" : "negative"
            }
            icon={Calendar}
          />

          {/* ✅ Revenue */}
          <DashboardCard
            title="Revenue"
            value={isLoading ? "Loading..." : `$${currentRevenue.toFixed(2)}`}
            change={`${revenueChange} from last month`}
            changeType={currentRevenue >= prevRevenue ? "positive" : "negative"}
            icon={DollarSign}
          />

          <DashboardCard
            title="Enquiries"
            value={
              enquiriesLoading ? "Loading..." : currentEnquiries.toString()
            }
            change={`${enquiriesChange} from last month`}
            changeType={
              currentEnquiries >= prevEnquiries ? "positive" : "negative"
            }
            icon={MessageCircle}
          />

          <DashboardCard
            title="Service Requests"
            value={loading ? "..." : totalRequests.toString()}
            change={
              lastWeekRequests === 0
                ? "No data from last week"
                : `${change.toFixed(1)}% from last week`
            }
            changeType={changeType}
            icon={Settings}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart />
          <BookingsChart />
        </div>

        {/* Time Records Section */}
        <div className="mb-8">
          <TimeRecords />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="">
            <RecentActivity />
          </div>
          <div>
            <ServiceRequest />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
