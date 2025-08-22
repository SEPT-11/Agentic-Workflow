# Overview

ContentFlow is an AI-powered social media content generator that transforms Google Sheets data into engaging, platform-specific social media posts. The application streamlines content workflows by automatically processing spreadsheet data, generating tailored content using OpenAI's API, and providing approval workflows for social media posts across multiple platforms (LinkedIn, X/Twitter, Instagram).

The system is designed as a full-stack web application with automated content generation workflows, user authentication through Replit Auth, and comprehensive dashboard analytics for content management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client is built with **React 18** using TypeScript and follows a modern component-based architecture:

- **UI Framework**: Utilizes shadcn/ui component library with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Custom auth hook integrated with Replit Auth system
- **Build Tool**: Vite for fast development and optimized production builds

The frontend follows a modular structure with reusable components, custom hooks, and utility functions. Key pages include a landing page for unauthenticated users and a comprehensive dashboard for authenticated users.

## Backend Architecture

The server is built with **Express.js** and follows RESTful API principles:

- **Framework**: Express.js with TypeScript for type safety
- **Authentication**: Replit Auth with OpenID Connect integration and session management
- **API Design**: RESTful endpoints organized by feature (auth, dashboard stats, Google Sheets, workflows, posts, platform connections)
- **Middleware**: Custom logging, error handling, and authentication middleware
- **Development**: Hot reloading with Vite integration in development mode

The backend implements a clean separation of concerns with dedicated route handlers, service layers, and storage abstractions.

## Data Storage Solutions

**Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations:

- **ORM**: Drizzle ORM provides compile-time type safety and migrations
- **Connection**: Neon serverless PostgreSQL for scalable database hosting
- **Schema**: Centralized schema definition in shared directory for consistency
- **Sessions**: Database-backed session storage using connect-pg-simple

Key data models include users, Google Sheets connections, platform connections, workflows, posts, and activities with proper foreign key relationships and cascading deletes.

## Authentication and Authorization

**Replit Auth Integration**:
- OpenID Connect (OIDC) flow with automatic discovery
- Passport.js strategy for session management
- Database-backed sessions with configurable TTL
- User profile synchronization with automatic upserts
- Secure cookie configuration for production deployment

The auth system handles user registration, login, profile management, and session persistence with proper security headers and CSRF protection.

## AI Content Generation

**OpenAI Integration**:
- GPT-4o model for content generation and summarization
- Platform-specific content optimization (LinkedIn, X/Twitter, Instagram)
- Content summarization from Google Sheets data
- Configurable AI parameters and prompt templates
- Error handling and fallback strategies

The AI service processes raw spreadsheet data, generates summaries, and creates platform-optimized social media posts with appropriate character limits and formatting.

## Workflow Automation

**Content Generation Pipeline**:
- Automated workflows that connect Google Sheets data to AI content generation
- Configurable triggers and scheduling (foundation for future enhancements)
- Post approval workflow with manual review capabilities
- Activity logging and audit trails
- Dashboard analytics and reporting

# External Dependencies

## Third-Party Services

- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **OpenAI API**: GPT-4o model for content generation and text processing
- **Google Sheets API**: OAuth2 integration for spreadsheet data access (in development)
- **Replit Auth**: Authentication service with OpenID Connect support

## Key NPM Packages

- **UI/Frontend**: React, Vite, TanStack Query, Wouter, shadcn/ui, Radix UI, Tailwind CSS
- **Backend**: Express.js, Passport.js, OpenID Client, Drizzle ORM
- **Database**: @neondatabase/serverless, drizzle-orm, connect-pg-simple
- **AI/ML**: OpenAI SDK
- **Development**: TypeScript, ESBuild, PostCSS
- **Utilities**: Zod for validation, date-fns for date manipulation, nanoid for ID generation

## API Integrations

- **Google APIs**: Google Sheets API for data fetching (OAuth2 flow in development)
- **Social Media APIs**: Foundation prepared for LinkedIn, X/Twitter, and Instagram APIs
- **OpenAI API**: Content generation and text processing with error handling and retry logic

The application architecture is designed for scalability with clear separation between data access, business logic, and presentation layers. The modular structure supports easy addition of new social media platforms and content generation strategies.