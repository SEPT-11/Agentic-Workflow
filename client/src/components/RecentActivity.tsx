import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      workflow_run: "bg-accent",
      post_generated: "bg-secondary",
      google_sheet_synced: "bg-secondary",
      platform_connected: "bg-primary",
      post_approved: "bg-secondary",
    };
    return colors[type] || "bg-gray-400";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="text-primary mr-3" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="text-primary mr-3" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities && (activities as any[]).length > 0 ? (
            (activities as any[]).map((activity: any) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No recent activity</p>
            </div>
          )}
          
          {activities && (activities as any[]).length > 0 && (
            <Button variant="ghost" className="w-full text-primary hover:text-blue-700">
              View All Activity
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
