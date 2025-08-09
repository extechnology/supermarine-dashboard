import { useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { RevenueChart } from "@/components/RevenueChart";
import { BookingsChart } from "@/components/BookingsChart";
import { RecentActivity } from "@/components/RecentActivity";
import { TimeRecords } from "@/components/TimeRecords";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, MessageCircle, Settings, Mountain, TrendingUp, LogOut } from "lucide-react";
import heroImage from "@/assets/ski-resort-hero.jpg";
import { toast } from "sonner";

const Index = () => {
  const [isUserAuthenticated, setUserAuthenticated] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    toast.success("You have been logged out.");
    window.location.href = "/";
  };


  return (
    <div className="min-h-screen bg-background dark">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-[url('/dashboard.jpg')] bg-center bg-no-repeat"
        
      >
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
            value="1,284"
            change="+12% from last month"
            changeType="positive"
            icon={Calendar}
          />
          <DashboardCard
            title="Revenue"
            value="$342,567"
            change="+8% from last month"
            changeType="positive"
            icon={DollarSign}
          />
          <DashboardCard
            title="Inquiries"
            value="156"
            change="+24% from last week"
            changeType="positive"
            icon={MessageCircle}
          />
          <DashboardCard
            title="Service Requests"
            value="89"
            change="-5% from last week"
            changeType="negative"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          
          {/* Quick Stats */}
          <div className="space-y-6">
            <DashboardCard
              title="Peak Season Bookings"
              value="89%"
              change="Capacity utilization"
              changeType="positive"
              icon={Mountain}
              className="bg-gradient-to-br from-primary/10 to-accent/10"
            />
            <DashboardCard
              title="Guest Satisfaction"
              value="4.8/5"
              change="Based on 342 reviews"
              changeType="positive"
              icon={TrendingUp}
              className="bg-gradient-to-br from-accent/10 to-primary/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
