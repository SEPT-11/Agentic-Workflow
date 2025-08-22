import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, FileText, Settings, Link, CheckCircle } from "lucide-react";

export default function QuickStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Posts Generated",
      value: (stats as any)?.postsGenerated || 0,
      change: "+12%",
      changeText: "this month",
      icon: FileText,
      bgColor: "bg-primary",
      changeColor: "text-secondary",
    },
    {
      title: "Active Workflows",
      value: (stats as any)?.activeWorkflows || 0,
      status: "All running smoothly",
      icon: Settings,
      bgColor: "bg-accent",
      statusColor: "text-gray-600",
    },
    {
      title: "Connected Accounts",
      value: (stats as any)?.connectedAccounts || 0,
      status: "Google, LinkedIn, X, Instagram",
      icon: Link,
      bgColor: "bg-secondary",
      statusColor: "text-gray-600",
    },
    {
      title: "Success Rate",
      value: `${(stats as any)?.successRate || 0}%`,
      change: "+2.1%",
      changeText: "improvement",
      icon: CheckCircle,
      bgColor: "bg-secondary",
      changeColor: "text-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`${stat.bgColor.replace('bg-', 'text-')} w-5 h-5`} />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {stat.change ? (
                  <>
                    <TrendingUp className={`${stat.changeColor} w-3 h-3 mr-1`} />
                    <span className={`${stat.changeColor} font-medium`}>{stat.change}</span>
                    <span className="text-gray-500 ml-1">{stat.changeText}</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
                    <span className={stat.statusColor}>{stat.status}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
