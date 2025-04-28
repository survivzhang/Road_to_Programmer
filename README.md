# Road to Programmer

A comprehensive learning platform powered by AI that creates personalized programming education paths for developers at all levels.

![Project Banner](./public/images/banner.png)

## Project Overview

Road to Programmer is an AI-driven educational platform that combines:

- **Frontend**: Next.js React application with Typescript and Tailwind CSS
- **Backend**: ASP.NET Core Web API with Entity Framework Core and PostgreSQL
- **AI Integration**: Advanced OpenAI GPT models for intelligent learning plan generation

## Screenshots

<div align="center">
  <img src="./public/images/homepage.png" alt="Homepage" width="45%" />
  <img src="./public/images/ai-planner.png" alt="AI Planner" width="45%" />
</div>

<div align="center">
  <img src="./public/images/learning-plan.png" alt="Learning Plan" width="45%" />
  <img src="./public/images/user-dashboard.png" alt="User Dashboard" width="45%" />
</div>

## Key Features

- **AI Learning Agent**: Intelligent agent that analyzes your goals, current skills, and available time to create customized learning plans
- **Personalized Roadmaps**: AI-generated step-by-step learning paths tailored to your specific needs and schedule
- **Dynamic Plan Adaptation**: Learning plans that consider your current skill level and target career goals
- **User Authentication**: Secure JWT-based authentication system
- **Roadmap Visualization**: Pre-defined roadmaps for various programming paths
- **Plan Management**: Save, view, and delete your learning plans
- **Responsive Design**: Modern UI with Shadcn UI components

## Demo

![Demo GIF](./public/images/demo.gif)

## AI Capabilities

The platform leverages OpenAI's GPT models to:

- Analyze user requirements and goals
- Consider time constraints and learning pace
- Generate structured, week-by-week learning schedules
- Break down complex programming concepts into manageable learning units
- Prioritize topics based on relevance to career objectives

![AI Agent Workflow](./public/images/ai-workflow.png)

## Project Structure

### Frontend (`my-app/`)

- Built with Next.js 14
- TypeScript for type safety
- Shadcn UI components
- Context API for state management
- Responsive design with Tailwind CSS

### Backend (`RTPapi/`)

- ASP.NET Core Web API
- Entity Framework Core for database access
- JWT authentication
- OpenAI integration for plan generation
- PostgreSQL database

## Architecture

![Architecture Diagram](./public/images/architecture.png)

## Getting Started

### Prerequisites

- Node.js and npm
- .NET 9.0 SDK
- PostgreSQL database

### Setup and Installation

1. Clone the repository
2. Set up the backend:

   ```
   cd RTPapi
   dotnet restore
   dotnet run
   ```

3. Set up the frontend:

   ```
   cd my-app
   npm install
   npm run dev
   ```

4. Create an `.env` file in the RTPapi directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET_KEY=your_jwt_secret_key
   ```

## Contributors

- Your Name/Team

## License

MIT

## Presentation Script (2-3 Minutes Video)

### Introduction (30 seconds)

"Hello, I'm [Your Name], and I'd like to present 'Road to Programmer' - an AI-powered learning platform I've developed to help people create personalized programming learning paths. This full-stack application demonstrates my skills in both frontend and backend development, as well as AI integration."

### Problem & Solution (30 seconds)

"Learning programming can be overwhelming due to the vast amount of resources available. Road to Programmer solves this by using AI to generate customized learning plans based on each user's goals, current skill level, and available time commitment."

### Technology Overview (30 seconds)

"The application consists of a React frontend built with Next.js and TypeScript, providing a responsive UI with Shadcn components. The backend is powered by ASP.NET Core, connecting to a PostgreSQL database via Entity Framework Core. For the AI functionality, I've integrated OpenAI's GPT models through their API."

### Key Features Demo (45-60 seconds)

"Let me show you how it works:

1. First, users create an account with our secure authentication system.
2. After logging in, they can specify their programming goals, current skill level, and how many hours they can commit weekly.
3. Our AI agent analyzes this information and generates a week-by-week learning plan.
4. The plan breaks down complex topics into manageable units with specific hourly allocations.
5. Users can save multiple plans, view them anytime, and track their progress.

As you can see, the interface is clean and intuitive, making it easy for users to navigate through the platform."

### Technical Highlights (15-20 seconds)

"Some technical highlights include JWT authentication, OpenAI API integration for the AI agent, context-based state management in React, and a well-structured ASP.NET Core backend with clean API endpoints."

### Conclusion (15 seconds)

"Road to Programmer showcases my ability to build comprehensive full-stack applications with modern technologies and integrate advanced features like AI. Thank you for your time, and I'd be happy to answer any questions about the implementation details."
