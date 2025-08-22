import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import QuickStats from "@/components/QuickStats";
import GoogleSheetsIntegration from "@/components/GoogleSheetsIntegration";
import AIWorkflowConfig from "@/components/AIWorkflowConfig";
import GeneratedPosts from "@/components/GeneratedPosts";
import PlatformConnections from "@/components/PlatformConnections";
import RecentActivity from "@/components/RecentActivity";
import QuickActions from "@/components/QuickActions";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-robot text-white text-sm"></i>
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {(user as any)?.firstName || 'there'}!
          </h1>
          <p className="text-gray-600">
            Manage your AI-powered content generation workflow and social media posts.
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Workflow Setup */}
          <div className="lg:col-span-2 space-y-6">
            <GoogleSheetsIntegration />
            <AIWorkflowConfig />
            <GeneratedPosts />
          </div>

          {/* Right Column - Connections & Settings */}
          <div className="space-y-6">
            <PlatformConnections />
            <RecentActivity />
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}
