import {
  users,
  googleSheets,
  platformConnections,
  workflows,
  posts,
  activities,
  type User,
  type UpsertUser,
  type GoogleSheet,
  type InsertGoogleSheet,
  type PlatformConnection,
  type InsertPlatformConnection,
  type Workflow,
  type InsertWorkflow,
  type Post,
  type InsertPost,
  type Activity,
  type InsertActivity,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these are mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Google Sheets operations
  getGoogleSheets(userId: string): Promise<GoogleSheet[]>;
  createGoogleSheet(sheet: InsertGoogleSheet): Promise<GoogleSheet>;
  updateGoogleSheet(id: string, updates: Partial<GoogleSheet>): Promise<GoogleSheet>;
  deleteGoogleSheet(id: string): Promise<void>;

  // Platform connections operations
  getPlatformConnections(userId: string): Promise<PlatformConnection[]>;
  createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection>;
  updatePlatformConnection(id: string, updates: Partial<PlatformConnection>): Promise<PlatformConnection>;
  deletePlatformConnection(id: string): Promise<void>;

  // Workflow operations
  getWorkflows(userId: string): Promise<Workflow[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow>;
  deleteWorkflow(id: string): Promise<void>;

  // Post operations
  getPosts(userId: string, limit?: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, updates: Partial<Post>): Promise<Post>;
  deletePost(id: string): Promise<void>;

  // Activity operations
  getActivities(userId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Dashboard stats
  getDashboardStats(userId: string): Promise<{
    postsGenerated: number;
    activeWorkflows: number;
    connectedAccounts: number;
    successRate: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these are mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Google Sheets operations
  async getGoogleSheets(userId: string): Promise<GoogleSheet[]> {
    return await db
      .select()
      .from(googleSheets)
      .where(eq(googleSheets.userId, userId))
      .orderBy(desc(googleSheets.createdAt));
  }

  async createGoogleSheet(sheet: InsertGoogleSheet): Promise<GoogleSheet> {
    const [newSheet] = await db.insert(googleSheets).values(sheet).returning();
    return newSheet;
  }

  async updateGoogleSheet(id: string, updates: Partial<GoogleSheet>): Promise<GoogleSheet> {
    const [updatedSheet] = await db
      .update(googleSheets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(googleSheets.id, id))
      .returning();
    return updatedSheet;
  }

  async deleteGoogleSheet(id: string): Promise<void> {
    await db.delete(googleSheets).where(eq(googleSheets.id, id));
  }

  // Platform connections operations
  async getPlatformConnections(userId: string): Promise<PlatformConnection[]> {
    return await db
      .select()
      .from(platformConnections)
      .where(eq(platformConnections.userId, userId))
      .orderBy(desc(platformConnections.createdAt));
  }

  async createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection> {
    const [newConnection] = await db.insert(platformConnections).values(connection).returning();
    return newConnection;
  }

  async updatePlatformConnection(id: string, updates: Partial<PlatformConnection>): Promise<PlatformConnection> {
    const [updatedConnection] = await db
      .update(platformConnections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(platformConnections.id, id))
      .returning();
    return updatedConnection;
  }

  async deletePlatformConnection(id: string): Promise<void> {
    await db.delete(platformConnections).where(eq(platformConnections.id, id));
  }

  // Workflow operations
  async getWorkflows(userId: string): Promise<Workflow[]> {
    return await db
      .select()
      .from(workflows)
      .where(eq(workflows.userId, userId))
      .orderBy(desc(workflows.createdAt));
  }

  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const [newWorkflow] = await db.insert(workflows).values(workflow).returning();
    return newWorkflow;
  }

  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    const [updatedWorkflow] = await db
      .update(workflows)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(workflows.id, id))
      .returning();
    return updatedWorkflow;
  }

  async deleteWorkflow(id: string): Promise<void> {
    await db.delete(workflows).where(eq(workflows.id, id));
  }

  // Post operations
  async getPosts(userId: string, limit: number = 50): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    const [updatedPost] = await db
      .update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  // Activity operations
  async getActivities(userId: string, limit: number = 20): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  // Dashboard stats
  async getDashboardStats(userId: string): Promise<{
    postsGenerated: number;
    activeWorkflows: number;
    connectedAccounts: number;
    successRate: number;
  }> {
    const [postsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(eq(posts.userId, userId));

    const [workflowsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(workflows)
      .where(and(eq(workflows.userId, userId), eq(workflows.isActive, true)));

    const [connectionsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(platformConnections)
      .where(and(eq(platformConnections.userId, userId), eq(platformConnections.isActive, true)));

    const [avgSuccessRate] = await db
      .select({ avg: sql<number>`coalesce(avg(success_rate), 0)::int` })
      .from(workflows)
      .where(eq(workflows.userId, userId));

    return {
      postsGenerated: postsCount?.count || 0,
      activeWorkflows: workflowsCount?.count || 0,
      connectedAccounts: connectionsCount?.count || 0,
      successRate: avgSuccessRate?.avg || 0,
    };
  }
}

export const storage = new DatabaseStorage();
