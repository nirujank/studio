# Invorg Staff Hub - Architecture Document

## 1. Overview

The Invorg Staff Hub is a comprehensive web application designed to serve as a central portal for managing staff, projects, and administrative tasks within an organization. It provides role-based access for administrators and staff members, offering features like profile management, project assignments, timesheet logging, leave requests, and AI-powered tools for recruitment and project planning.

## 2. Technology Stack

The application is built on a modern, server-centric tech stack chosen for performance, developer experience, and scalability.

- **Framework**: [Next.js 15](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (for client-side global state), React Hooks (`useState`, `useActionState`) for component state.
- **Icons**: [Lucide React](https://lucide.dev/)

## 3. Architecture & Design Principles

The application follows a server-centric architecture, leveraging the latest features of the Next.js App Router to optimize performance and data handling.

- **Server Components by Default**: Most components are React Server Components (RSCs), which run on the server to reduce the amount of JavaScript sent to the client, leading to faster initial page loads.
- **Client Components for Interactivity**: Interactivity is explicitly opted into by using the `'use client'` directive. This is used for components with event listeners (e.g., button clicks), state, and lifecycle effects.
- **Server Actions**: Form submissions and data mutations are handled via Server Actions. This eliminates the need for creating separate API endpoints for most data operations, simplifying the codebase and improving security. Server Actions are defined in `src/app/actions.ts`.
- **Component-Based UI**: The user interface is built as a collection of reusable React components, primarily sourced from ShadCN/UI and customized as needed. Custom components are located in the `src/components` directory.

## 4. Folder Structure

The project follows a standard Next.js App Router layout, organized by feature and function.

```
/src
├── app/                  # Next.js App Router: contains all pages and layouts.
│   ├── (dashboard)/      # Route groups for organization.
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── staff/
│   │   └── ...
│   ├── api/              # API routes (if any).
│   ├── docs/             # Application documentation (ER diagrams, architecture).
│   ├── actions.ts        # Server Actions for form submissions and data mutations.
│   └── layout.tsx        # Root layout for the entire application.
│
├── ai/                   # Genkit AI integration.
│   ├── flows/            # Contains all Genkit flows for specific AI tasks.
│   └── genkit.ts         # Genkit global configuration.
│
├── components/           # Reusable React components.
│   ├── auth/             # Authentication-related components (login form).
│   ├── dashboard/        # Components specific to the admin dashboard.
│   ├── layout/           # App layout components (sidebar, header).
│   ├── profile/          # Components for the user profile page.
│   └── ui/               # Core ShadCN/UI components.
│
├── hooks/                # Custom React hooks (e.g., useToast, useNotifications).
│
├── lib/                  # Libraries, utilities, and mock data.
│   ├── data.ts           # Mock data source for staff, projects, tenants.
│   ├── placeholder-images.ts # Placeholder image data.
│   └── utils.ts          # Utility functions (e.g., cn for classnames).
│
└── public/               # Static assets (images, fonts).
```

## 5. AI Integration (Genkit)

Generative AI features are powered by **Genkit**, which provides a structured way to define and execute AI-powered workflows.

- **Flows**: Each distinct AI task (e.g., `extractSkillsFromResume`, `calculateProjectFitScore`) is encapsulated in a Genkit Flow, located in `src/ai/flows/`.
- **Schema-Driven**: Flows use Zod schemas (`z.object({...})`) to define their expected input and output structures. This ensures type safety and allows Genkit to automatically format the LLM's response into the desired JSON object.
- **Prompts**: Prompts are defined using `ai.definePrompt` and utilize Handlebars templating (`{{{variable}}}`) to inject dynamic data.
- **Server Actions Bridge**: AI flows are invoked from the front-end via Server Actions defined in `src/app/actions.ts`, which act as a bridge between client components and the server-side Genkit logic.

## 6. Data & State Management

- **Data Source**: The application currently uses a mock data layer located at `src/lib/data.ts`. This file exports arrays of objects that simulate database tables for staff, projects, and tenants. This allows for rapid prototyping without a database setup.
- **Server-Side Data Fetching**: Because most pages are Server Components, they can directly import and use the mock data from `src/lib/data.ts` during the server-rendering process.
- **Client-Side State**:
    - **Local State**: Component-level state is managed with React's `useState` and `useEffect` hooks.
    - **Form State**: `useActionState` is used in forms to handle pending, error, and success states when calling Server Actions.
    - **Global State**: `Zustand` is used for managing global client-side state that needs to be shared across components, such as UI notifications (`useNotifications`).

## 7. Authentication

Authentication is currently mocked for demonstration purposes.

- **Login Form**: `src/components/auth/login-form.tsx` simulates a login process.
- **Session Management**: Upon "login," a `userRole` (`admin` or `staff`) and a `userId` are stored in `sessionStorage`.
- **Role-Based Access**: The application reads from `sessionStorage` to determine the current user's role and renders the appropriate navigation and content. Admin users see management dashboards, while staff users see their personal information and assigned tasks.

This mock setup can be replaced with a real authentication provider (e.g., Firebase Auth, NextAuth.js) in a production environment.
