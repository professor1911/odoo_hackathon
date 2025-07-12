
# Skillshare - AI-Powered Skill Swap Platform

## Overview

Skillshare is a full-stack web application built with Next.js that allows users to connect with each other to trade or "swap" skills. The platform is designed to foster a community of learning and sharing, where users can both teach what they know and learn something new from others.

The application features a complete user authentication system, profile management, a skill discovery dashboard, an AI-powered recommendation engine, and a real-time messaging system for coordinating swaps.

## Core Features

- **User Authentication**: Secure sign-up and login functionality using Firebase Authentication.
- **User Profile Management**: Users can create and manage their profiles, including their bio, profile picture, skills they offer, skills they want to learn, and their general availability.
- **Skill Discovery**: A searchable and filterable dashboard where users can find other people based on skills or names.
- **AI Recommendations**: A dedicated "For You" page that uses Google's Gemini model via Genkit to provide personalized recommendations for potential skill swap partners based on profile compatibility.
- **Swap Request System**: Users can send, receive, accept, or reject skill swap requests.
- **Real-time Swap Sessions**: Once a request is accepted, a private chat session is created where users can coordinate their skill swap using real-time messaging powered by Firestore.
- **Rating and Feedback**: After a swap is completed, users can rate their partner, contributing to a community-based reputation system.
- **Responsive Design**: The entire application is fully responsive and optimized for a seamless experience on both desktop and mobile devices.

## Tech Stack

This project is built with a modern, production-ready tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Framework**: [React](https://reactjs.org/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) with the Gemini API
- **Fonts**: PT Sans for body, Space Grotesk for headlines.

## Getting Started

To get the project up and running on your local machine, follow these steps.

### Prerequisites

- Node.js (v18 or later)
- An active Firebase project.

### 1. Set Up Environment Variables

First, you need to configure your Firebase project credentials.

1.  Create a file named `.env.local` in the root of the project.
2.  Go to your Firebase project settings and create a new Web App.
3.  Copy the `firebaseConfig` object values into your `.env.local` file. It should look like this:

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-... # Optional

# Genkit (Google AI)
GOOGLE_API_KEY=your_google_ai_api_key # Get this from Google AI Studio
```

### 2. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 3. Run the Development Servers

This project requires two development servers to run concurrently: one for the Next.js frontend and one for the Genkit AI flows.

-   **Start the Next.js app:**
    ```bash
    npm run dev
    ```
    This will start the main application, typically on `http://localhost:9002`.

-   **Start the Genkit server:**
    Open a **new terminal window** and run:
    ```bash
    npm run genkit:watch
    ```
    This starts the Genkit development server, which watches for changes in your AI flows.

You can now access the application in your browser at the URL provided by the Next.js server.

## Project Structure

Here's a brief overview of the key directories in the project:

-   `src/app/`: Contains all the pages and layouts, following the Next.js App Router structure.
    -   `src/app/(auth)/`: A route group for all pages that require user authentication.
    -   `src/app/(auth)/layout.tsx`: The main layout for the authenticated part of the app, including the sidebar.
-   `src/components/`: Contains all the reusable React components.
    -   `src/components/ui/`: Auto-generated components from ShadCN UI.
    -   `src/components/layout/`: Components related to the overall page structure (Header, Sidebar).
    -   Other folders are organized by feature (e.g., `profile`, `requests`, `session`).
-   `src/ai/`: Contains all the Genkit-related code for AI functionality.
    -   `src/ai/flows/`: Defines the AI flows, such as the skill swap recommendation engine.
-   `src/lib/`: Contains utility functions, type definitions (`types.ts`), and Firebase configuration (`firebase.ts`).
-   `src/context/`: Contains React context providers, such as the `AuthContext` for managing user authentication state.
-   `public/`: Contains static assets like images and fonts.

