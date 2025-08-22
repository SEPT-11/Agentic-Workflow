import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Plus, Eye, Edit, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PostPreviewModal from "./PostPreviewModal";

export default function GeneratedPosts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts"],
  });

  const approvePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const res = await apiRequest("PATCH", `/api/posts/${postId}`, {
        isApproved: true
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Post Approved",
        description: "Post has been approved for publishing",
      });
    },
    onError: (error) => {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getPlatformBadge = (platform: string) => {
    const configs: Record<string, any> = {
      linkedin: {
        icon: "fab fa-linkedin-in",
        className: "bg-blue-100 text-blue-800 border-blue-200"
      },
      twitter: {
        icon: "fab fa-twitter",
        className: "bg-gray-100 text-gray-800 border-gray-200"
      },
      instagram: {
        icon: "fab fa-instagram",
        className: "bg-pink-100 text-pink-800 border-pink-200"
      }
    };

    const config = configs[platform] || configs.linkedin;
    return (
      <Badge variant="outline" className={config.className}>
        <i className={`${config.icon} mr-1`}></i>
        {platform.charAt(0).toUpperCase() + platform.slice(1)}
      </Badge>
    );
  };

  const handlePreviewPost = (post: any) => {
    setSelectedPost(post);
    setIsPreviewOpen(true);
  };

  const handleExportPosts = () => {
    toast({
      title: "Export Started",
      description: "Posts export functionality coming soon",
    });
  };

  const handleGenerateNew = () => {
    toast({
      title: "Manual Generation",
      description: "Manual post generation coming soon",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="text-primary mr-3" />
            Generated Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="text-primary mr-3" />
              Generated Posts
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportPosts}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={handleGenerateNew} className="bg-primary hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Generate New
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts && (posts as any[]).length > 0 ? (
              (posts as any[]).map((post: any) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getPlatformBadge(post.platform)}
                        <span className="text-xs text-gray-500">
                          Generated {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium mb-2">
                        {post.title || "Generated Post"}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{post.characterCount || post.content.length} characters</span>
                        {post.hashtags && <span>{post.hashtags}</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreviewPost(post)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast({
                          title: "Edit Post",
                          description: "Post editing functionality coming soon"
                        })}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => approvePostMutation.mutate(post.id)}
                        disabled={post.isApproved || approvePostMutation.isPending}
                        className={post.isApproved ? "text-secondary" : "hover:text-secondary"}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No posts generated yet</p>
                <p className="text-sm text-gray-400">Run a workflow to generate your first posts</p>
              </div>
            )}

            {posts && (posts as any[]).length > 0 && (
              <div className="text-center py-4">
                <Button variant="ghost" className="text-primary hover:text-blue-700">
                  Load more posts...
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <PostPreviewModal
        post={selectedPost}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedPost(null);
        }}
        onApprove={(postId) => {
          approvePostMutation.mutate(postId);
          setIsPreviewOpen(false);
          setSelectedPost(null);
        }}
      />
    </>
  );
}
