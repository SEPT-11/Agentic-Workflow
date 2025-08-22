import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">ContentFlow</span>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-blue-700"
            >
              Sign In
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Social Media Content Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your Google Sheets content into engaging, platform-specific social media posts with AI. 
            Streamline your content workflow and boost your social media presence.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-primary hover:bg-blue-700 text-lg px-8 py-3"
          >
            Get Started Free
          </Button>
        </div>

        {/* Features */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-table text-primary text-xl"></i>
              </div>
              <CardTitle>Google Sheets Integration</CardTitle>
              <CardDescription>
                Connect your Google Sheets and automatically sync content for AI processing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-brain text-accent text-xl"></i>
              </div>
              <CardTitle>AI Content Generation</CardTitle>
              <CardDescription>
                Advanced AI summarizes your content and generates platform-specific posts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-share-alt text-secondary text-xl"></i>
              </div>
              <CardTitle>Multi-Platform Support</CardTitle>
              <CardDescription>
                Create optimized posts for LinkedIn, X (Twitter), and Instagram automatically
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it works */}
        <div className="py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Connect Your Sheets</h3>
              <p className="text-gray-600">Link your Google Sheets containing links, content, or ideas</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900">AI Processing</h3>
              <p className="text-gray-600">Our AI analyzes and summarizes your content automatically</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Generate Posts</h3>
              <p className="text-gray-600">Get platform-optimized posts ready for publishing</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 bg-primary rounded-2xl text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Content?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of content creators who are streamlining their social media workflow
          </p>
          <Button 
            size="lg"
            variant="secondary"
            onClick={() => window.location.href = '/api/login'}
            className="text-lg px-8 py-3"
          >
            Start Creating Now
          </Button>
        </div>
      </div>
    </div>
  );
}
