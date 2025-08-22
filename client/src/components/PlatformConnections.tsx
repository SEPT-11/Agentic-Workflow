import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PlatformConnections() {
  const { toast } = useToast();

  const { data: connections, isLoading } = useQuery({
    queryKey: ["/api/platform-connections"],
  });

  const handleConnectPlatform = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Social media platform OAuth integration will be available soon",
    });
  };

  const getPlatformConfig = (platform: string) => {
    const configs: Record<string, any> = {
      linkedin: {
        name: "LinkedIn",
        icon: "fab fa-linkedin-in",
        bgColor: "bg-blue-600",
        borderColor: "border-blue-200",
        bgClass: "bg-blue-50"
      },
      twitter: {
        name: "X.com",
        icon: "fab fa-twitter",
        bgColor: "bg-gray-800",
        borderColor: "border-gray-200",
        bgClass: "bg-gray-50"
      },
      instagram: {
        name: "Instagram",
        icon: "fab fa-instagram",
        bgColor: "bg-pink-600",
        borderColor: "border-pink-200",
        bgClass: "bg-pink-50"
      }
    };

    return configs[platform] || configs.linkedin;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share className="text-primary mr-3" />
            Platform Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock data for demonstration since OAuth isn't implemented yet
  const mockConnections = [
    { platform: "linkedin", accountName: "John Doe", isActive: true },
    { platform: "twitter", accountName: "@johndoe", isActive: true },
    { platform: "instagram", accountName: "@johndoe_official", isActive: true },
  ];

  const displayConnections = connections && (connections as any[]).length > 0 ? connections : mockConnections;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share className="text-primary mr-3" />
          Platform Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(displayConnections as any[]).map((connection: any, index: number) => {
            const config = getPlatformConfig(connection.platform);
            return (
              <div
                key={connection.id || index}
                className={`flex items-center justify-between p-4 ${config.bgClass} rounded-lg border ${config.borderColor}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                    <i className={`${config.icon} text-white`}></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{config.name}</p>
                    <p className="text-sm text-gray-600">
                      Connected as {connection.accountName}
                    </p>
                  </div>
                </div>
                {connection.isActive && (
                  <Badge className="bg-secondary text-white">
                    Connected
                  </Badge>
                )}
              </div>
            );
          })}

          <Button
            variant="outline"
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-colors"
            onClick={handleConnectPlatform}
          >
            <Plus className="text-gray-400 text-lg mb-2 mx-auto" />
            <p className="text-gray-600 font-medium">Connect New Platform</p>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
