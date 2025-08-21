import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mountain } from "lucide-react";
import heroImage from "@/assets/ski-resort-hero.jpg";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginUser } from "../apiServices/AuthServices";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUser({ username, password });

      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);

      toast.success("Login successful!");
      navigate("/dashboard"); 
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.detail || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center bg-[url('/dashboard-login.jpg')]  justify-center bg-cover bg-center bg-no-repeat"
      
    >
      <div className="absolute inset-0 bg-background/80" />
      <Card className="relative z-10 w-full max-w-md mx-4 bg-card/95 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo-icon.png" className="w-12 h-12 mr-2" alt="" />
            <span className="text-2xl font-bold text-foreground">
              Super Marine
            </span>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your Super Marine dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-black to-gray-900 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
