import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Check, X } from "lucide-react";

interface PostPreviewModalProps {
  post: any;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (postId: string) => void;
}

export default function PostPreviewModal({ post, isOpen, onClose, onApprove }: PostPreviewModalProps) {
  if (!post) return null;

  const getPlatformConfig = (platform: string) => {
    const configs: Record<string, any> = {
      linkedin: {
        name: "LinkedIn",
        icon: "fab fa-linkedin-in",
        bgColor: "bg-blue-600",
        userTitle: "Marketing Professional • 2nd"
      },
      twitter: {
        name: "X",
        icon: "fab fa-twitter",
        bgColor: "bg-gray-800",
        userTitle: "@johndoe"
      },
      instagram: {
        name: "Instagram",
        icon: "fab fa-instagram",
        bgColor: "bg-pink-600",
        userTitle: "Content Creator"
      }
    };

    return configs[platform] || configs.linkedin;
  };

  const config = getPlatformConfig(post.platform);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Post Preview</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Platform Badge */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1">
              <i className={`${config.icon} mr-2`}></i>
              {config.name}
            </Badge>
            <span className="text-sm text-gray-500">
              Generated {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Post Preview */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                <i className={`${config.icon} text-white`}></i>
              </div>
              <div>
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-500">{config.userTitle}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {post.title && (
                <h3 className="font-semibold text-gray-900">{post.title}</h3>
              )}
              
              <div className="whitespace-pre-wrap text-gray-900">
                {post.content}
              </div>
              
              {post.hashtags && (
                <div className="text-primary font-medium">
                  {post.hashtags}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-6 text-gray-500">
                  <button className="flex items-center space-x-2 hover:text-primary">
                    <i className="fas fa-thumbs-up"></i>
                    <span className="text-sm">Like</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-primary">
                    <i className="fas fa-comment"></i>
                    <span className="text-sm">Comment</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-primary">
                    <i className="fas fa-share"></i>
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Post Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Character Count</p>
              <p className="font-semibold">{post.characterCount || post.content.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Status</p>
              <p className="font-semibold">
                {post.isApproved ? "Approved" : "Pending Review"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          {!post.isApproved && (
            <Button 
              onClick={() => onApprove(post.id)}
              className="bg-secondary hover:bg-emerald-600"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve for Posting
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
