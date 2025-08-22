import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderSync, Plus, Table } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function GoogleSheetsIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sheets, isLoading } = useQuery({
    queryKey: ["/api/google-sheets"],
  });

  const syncMutation = useMutation({
    mutationFn: async (sheetId: string) => {
      await apiRequest("POST", `/api/google-sheets/${sheetId}/sync`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/google-sheets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Google Sheet synced successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "FolderSync Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleConnectNewSheet = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Google Sheets OAuth integration will be available soon",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Table className="text-secondary mr-3" />
            Google Sheets Integration
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
            <Table className="text-secondary mr-3" />
            Google Sheets Integration
          </CardTitle>
          <Badge variant="secondary" className="bg-secondary bg-opacity-10 text-secondary">
            Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sheets && (sheets as any[]).length > 0 ? (
            (sheets as any[]).map((sheet: any) => (
              <div key={sheet.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <i className="fab fa-google text-blue-500 text-xl mr-4"></i>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{sheet.name}</p>
                  <p className="text-sm text-gray-500">
                    Last synced: {sheet.lastSynced 
                      ? new Date(sheet.lastSynced).toLocaleString()
                      : 'Never'
                    } • {sheet.entryCount || 0} entries
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => syncMutation.mutate(sheet.id)}
                  disabled={syncMutation.isPending}
                >
                  <FolderSync className="w-4 h-4 mr-2" />
                  FolderSync
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-4">No Google Sheets connected yet</p>
            </div>
          )}
          
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            <Plus className="text-gray-400 text-2xl mb-2 mx-auto" />
            <p className="text-gray-600 font-medium mb-2">Connect Additional Sheet</p>
            <p className="text-sm text-gray-500 mb-4">Add another Google Sheet to expand your content sources</p>
            <Button 
              onClick={handleConnectNewSheet}
              className="bg-primary hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Sheet
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
