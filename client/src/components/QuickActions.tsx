import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, Calendar, BarChart3, Settings, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QuickActions() {
  const { toast } = useToast();

  const actions = [
    {
      title: "Quick Generate",
      icon: Wand2,
      bgColor: "bg-primary bg-opacity-5",
      textColor: "text-primary",
      hoverColor: "hover:bg-opacity-10",
      onClick: () => toast({
        title: "Quick Generate",
        description: "Quick generation feature coming soon"
      })
    },
    {
      title: "Schedule Posts",
      icon: Calendar,
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      hoverColor: "hover:bg-gray-100",
      onClick: () => toast({
        title: "Schedule Posts",
        description: "Post scheduling feature coming soon"
      })
    },
    {
      title: "View Analytics",
      icon: BarChart3,
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      hoverColor: "hover:bg-gray-100",
      onClick: () => toast({
        title: "Analytics",
        description: "Analytics dashboard coming soon"
      })
    },
    {
      title: "Settings",
      icon: Settings,
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      hoverColor: "hover:bg-gray-100",
      onClick: () => toast({
        title: "Settings",
        description: "Settings page coming soon"
      })
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className={`w-full flex items-center justify-between p-3 ${action.bgColor} ${action.textColor} rounded-lg ${action.hoverColor} transition-colors`}
                onClick={action.onClick}
              >
                <div className="flex items-center">
                  <IconComponent className="w-5 h-5 mr-3" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
