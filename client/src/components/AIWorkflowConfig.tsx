import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Settings, Play, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AIWorkflowConfig() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedModel, setSelectedModel] = useState("gpt-4o");

  const { data: workflows, isLoading } = useQuery({
    queryKey: ["/api/workflows"],
  });

  const runWorkflowMutation = useMutation({
    mutationFn: async (workflowId: string) => {
      const res = await apiRequest("POST", `/api/workflows/${workflowId}/run`);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Workflow Complete",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Workflow Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get the first active workflow or create a default one
  const activeWorkflow = (workflows as any[])?.find((w: any) => w.isActive) || (workflows as any[])?.[0];

  const handleRunWorkflow = () => {
    if (!activeWorkflow) {
      toast({
        title: "No Workflow",
        description: "Please create a workflow first",
        variant: "destructive",
      });
      return;
    }
    runWorkflowMutation.mutate(activeWorkflow.id);
  };

  const handleTestWorkflow = () => {
    toast({
      title: "Test Mode",
      description: "Test workflow functionality coming soon",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="text-accent mr-3" />
            AI Processing Chain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Brain className="text-accent mr-3" />
            AI Processing Chain
          </CardTitle>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Step 1: Summarization */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Content Summarization</h4>
              <p className="text-sm text-gray-600 mt-1">
                AI analyzes and summarizes your Google Sheets content
              </p>
              <div className="mt-3 flex items-center space-x-4">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-gray-500">Model Selection</span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-secondary bg-opacity-10 text-secondary">
              Active
            </Badge>
          </div>

          {/* Step 2: Platform Generation */}
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Platform-Specific Generation</h4>
              <p className="text-sm text-gray-600 mt-1">
                Generate optimized posts for each social media platform
              </p>
              <div className="mt-3 flex items-center space-x-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  <i className="fab fa-linkedin-in mr-1"></i>LinkedIn
                </Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                  <i className="fab fa-twitter mr-1"></i>X.com
                </Badge>
                <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-200">
                  <i className="fab fa-instagram mr-1"></i>Instagram
                </Badge>
              </div>
            </div>
            <Badge variant="secondary" className="bg-secondary bg-opacity-10 text-secondary">
              Active
            </Badge>
          </div>

          {/* Workflow Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleRunWorkflow}
                disabled={runWorkflowMutation.isPending}
                className="bg-primary hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {runWorkflowMutation.isPending ? "Running..." : "Run Workflow"}
              </Button>
              <Button 
                variant="outline"
                onClick={handleTestWorkflow}
              >
                <TestTube className="w-4 h-4 mr-2" />
                Test
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              Last run: {activeWorkflow?.lastRun 
                ? new Date(activeWorkflow.lastRun).toLocaleString()
                : 'Never'
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
