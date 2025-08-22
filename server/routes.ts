import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { 
  insertGoogleSheetSchema, 
  insertPlatformConnectionSchema, 
  insertWorkflowSchema,
  insertPostSchema 
} from "@shared/schema";
import { GoogleSheetsService } from "./services/googleSheets";
import { OpenAIService } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Google Sheets routes
  app.get('/api/google-sheets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sheets = await storage.getGoogleSheets(userId);
      res.json(sheets);
    } catch (error) {
      console.error("Error fetching Google Sheets:", error);
      res.status(500).json({ message: "Failed to fetch Google Sheets" });
    }
  });

  app.post('/api/google-sheets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertGoogleSheetSchema.parse({ ...req.body, userId });
      const sheet = await storage.createGoogleSheet(data);
      
      // Log activity
      await storage.createActivity({
        userId,
        type: 'google_sheet_connected',
        description: `Connected Google Sheet: ${sheet.name}`,
        metadata: { sheetId: sheet.id }
      });

      res.json(sheet);
    } catch (error) {
      console.error("Error creating Google Sheet:", error);
      res.status(400).json({ message: "Failed to create Google Sheet" });
    }
  });

  app.post('/api/google-sheets/:id/sync', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const sheets = await storage.getGoogleSheets(userId);
      const sheet = sheets.find(s => s.id === id);
      
      if (!sheet) {
        return res.status(404).json({ message: "Google Sheet not found" });
      }

      // Sync with Google Sheets API
      const googleSheetsService = new GoogleSheetsService();
      const data = await googleSheetsService.getSheetData(sheet.sheetId, sheet.accessToken);
      
      // Update last synced and entry count
      const updatedSheet = await storage.updateGoogleSheet(id, {
        lastSynced: new Date(),
        entryCount: data.length
      });

      // Log activity
      await storage.createActivity({
        userId,
        type: 'google_sheet_synced',
        description: `Synced Google Sheet: ${sheet.name} (${data.length} entries)`,
        metadata: { sheetId: id, entryCount: data.length }
      });

      res.json(updatedSheet);
    } catch (error) {
      console.error("Error syncing Google Sheet:", error);
      res.status(500).json({ message: "Failed to sync Google Sheet" });
    }
  });

  // Platform connections routes
  app.get('/api/platform-connections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connections = await storage.getPlatformConnections(userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching platform connections:", error);
      res.status(500).json({ message: "Failed to fetch platform connections" });
    }
  });

  app.post('/api/platform-connections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertPlatformConnectionSchema.parse({ ...req.body, userId });
      const connection = await storage.createPlatformConnection(data);
      
      // Log activity
      await storage.createActivity({
        userId,
        type: 'platform_connected',
        description: `Connected ${connection.platform} account: ${connection.accountName}`,
        metadata: { platform: connection.platform, connectionId: connection.id }
      });

      res.json(connection);
    } catch (error) {
      console.error("Error creating platform connection:", error);
      res.status(400).json({ message: "Failed to create platform connection" });
    }
  });

  // Workflows routes
  app.get('/api/workflows', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workflows = await storage.getWorkflows(userId);
      res.json(workflows);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res.status(500).json({ message: "Failed to fetch workflows" });
    }
  });

  app.post('/api/workflows', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertWorkflowSchema.parse({ ...req.body, userId });
      const workflow = await storage.createWorkflow(data);
      res.json(workflow);
    } catch (error) {
      console.error("Error creating workflow:", error);
      res.status(400).json({ message: "Failed to create workflow" });
    }
  });

  app.post('/api/workflows/:id/run', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const workflows = await storage.getWorkflows(userId);
      const workflow = workflows.find(w => w.id === id);
      
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }

      // Get Google Sheets data
      const sheets = await storage.getGoogleSheets(userId);
      const activeSheets = sheets.filter(s => s.isActive);
      
      if (activeSheets.length === 0) {
        return res.status(400).json({ message: "No active Google Sheets found" });
      }

      const googleSheetsService = new GoogleSheetsService();
      const openaiService = new OpenAIService();
      const generatedPosts = [];

      for (const sheet of activeSheets) {
        try {
          // Get sheet data
          const data = await googleSheetsService.getSheetData(sheet.sheetId, sheet.accessToken);
          
          if (data.length === 0) continue;

          // Summarize content
          const summary = await openaiService.summarizeContent(data);

          // Generate platform-specific posts
          const platforms = ['linkedin', 'twitter', 'instagram'];
          
          for (const platform of platforms) {
            const post = await openaiService.generatePost(summary, platform);
            
            const createdPost = await storage.createPost({
              userId,
              workflowId: workflow.id,
              platform,
              title: post.title,
              content: post.content,
              hashtags: post.hashtags,
              characterCount: post.content.length,
              sourceUrl: `https://docs.google.com/spreadsheets/d/${sheet.sheetId}`
            });

            generatedPosts.push(createdPost);
          }
        } catch (error) {
          console.error(`Error processing sheet ${sheet.id}:`, error);
        }
      }

      // Update workflow last run
      await storage.updateWorkflow(id, {
        lastRun: new Date(),
        successRate: generatedPosts.length > 0 ? 100 : 0
      });

      // Log activity
      await storage.createActivity({
        userId,
        type: 'workflow_run',
        description: `Workflow completed: ${generatedPosts.length} posts generated`,
        metadata: { workflowId: id, postsGenerated: generatedPosts.length }
      });

      res.json({ 
        message: `Workflow completed successfully. Generated ${generatedPosts.length} posts.`,
        posts: generatedPosts 
      });
    } catch (error) {
      console.error("Error running workflow:", error);
      res.status(500).json({ message: "Failed to run workflow" });
    }
  });

  // Posts routes
  app.get('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const posts = await storage.getPosts(userId, limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.patch('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const updateData = z.object({
        isApproved: z.boolean().optional(),
        content: z.string().optional(),
        title: z.string().optional(),
        hashtags: z.string().optional()
      }).parse(req.body);
      
      const post = await storage.updatePost(id, updateData);
      
      if (updateData.isApproved) {
        // Log activity
        await storage.createActivity({
          userId,
          type: 'post_approved',
          description: `Post approved for ${post.platform}: ${post.title}`,
          metadata: { postId: id, platform: post.platform }
        });
      }

      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(400).json({ message: "Failed to update post" });
    }
  });

  app.delete('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deletePost(id);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Activities routes
  app.get('/api/activities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit) : 20;
      const activities = await storage.getActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
