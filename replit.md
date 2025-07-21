# Exam Portal Application

## Overview

This is a React-based exam portal application built with TypeScript, featuring a modern full-stack architecture. The application allows users to register, login, take exams across different subjects (Web Development, AI, Data Science), and view their results. It uses shadcn/ui for the component library and Firebase for data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client-side and server-side code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript support
- **Database**: Firebase Firestore for data persistence
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React Query for server state, Context API for auth state
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component Library**: Comprehensive shadcn/ui setup with 30+ pre-built components
- **Authentication**: Context-based auth system with Firebase integration
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build System**: Vite with TypeScript and React plugins

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Database Integration**: Drizzle ORM configured for PostgreSQL (though currently using Firebase)
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **API Structure**: RESTful API with /api prefix routing

### Data Models
The application defines several key schemas using Zod:
- **User**: Authentication and profile information
- **Question**: Exam questions with multiple choice options
- **Subject**: Exam subjects with questions and metadata
- **UserScore**: Score tracking across different subjects
- **ExamAttempt**: Individual exam attempt records

## Data Flow

1. **Authentication Flow**:
   - Users register/login through Firebase authentication
   - User sessions are managed via localStorage and AuthContext
   - Protected routes redirect unauthenticated users to login

2. **Exam Flow**:
   - Users select subjects from dashboard
   - Exam timer tracks duration and auto-submits on timeout
   - Questions are presented one at a time with navigation
   - Answers are stored locally during exam and submitted on completion

3. **Results Flow**:
   - Scores are calculated and stored in Firebase
   - Results page shows detailed performance breakdown
   - Historical attempts are tracked and accessible

## External Dependencies

### Core Dependencies
- **Firebase**: Primary database and authentication provider
- **React Query**: Server state management and caching
- **Wouter**: Lightweight routing solution
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation and schema definition

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and development experience
- **Tailwind CSS**: Utility-first CSS framework
- **Drizzle**: Database ORM (configured but not actively used)

### UI Dependencies
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Class Variance Authority**: Styling utilities
- **Tailwind Merge**: CSS class merging utility

## Deployment Strategy

The application is configured for development and production environments:

### Development
- **Dev Server**: Vite development server with HMR
- **Backend**: Express server with tsx for TypeScript execution
- **Database**: Firebase with development configuration
- **Build Tool**: Concurrent client and server development

### Production
- **Build Process**: Vite builds client, esbuild bundles server
- **Static Assets**: Client built to dist/public directory
- **Server**: Node.js execution of bundled server code
- **Database**: Firebase production environment

### Configuration Files
- **TypeScript**: Shared tsconfig for client, server, and shared code
- **Vite**: Custom configuration with path aliases and plugins
- **Tailwind**: Extended theme with custom color scheme and variables
- **Drizzle**: PostgreSQL configuration ready for future migration

The application is designed to be easily deployable to platforms like Replit, with proper environment variable handling and production-ready build processes.