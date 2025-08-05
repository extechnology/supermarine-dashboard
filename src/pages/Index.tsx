import { DashboardCard } from "@/components/DashboardCard";
import { RevenueChart } from "@/components/RevenueChart";
import { BookingsChart } from "@/components/BookingsChart";
import { RecentActivity } from "@/components/RecentActivity";
import { Calendar, DollarSign, MessageCircle, Settings, Mountain, TrendingUp } from "lucide-react";
import heroImage from "@/assets/ski-resort-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Ski Resort Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Monitor bookings, revenue, and guest services in real-time
              </p>
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
            title="Enquiries"
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
