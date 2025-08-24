Carbon Footprint Tracker

A full-stack application for tracking and reducing carbon footprint with AI-powered insights and recommendations.

Features

- User Authentication: Secure registration and login system
- Footprint Tracking: Log activities across multiple categories
- Visual Analytics: Charts and graphs for footprint visualization
- AI-Powered Recommendations: Puter.js AI powered personalized carbon reduction suggestions
- Carbon Insights: AI-generated analysis and trends based on your footprint data
- Responsive Design: Works on desktop and mobile devices

Tech Stack

Backend
- Node.js with Express
- MongoDB for database
- Puter.js AI integration for AI features (no API key required)
- RESTful API architecture

Frontend
- React.js with hooks
- Redux for state management
- Chart.js for data visualization
- Tailwind CSS for styling

Getting Started

Prerequisites

- Node.js (v14 or higher)
- MongoDB
- MongoDB connection

Installation

1. Clone the repository
2. Install dependencies for both backend and frontend
3. Set up environment variables
4. Run the development servers


Install backend dependencies
cd backend
npm install

Install frontend dependencies
cd ../frontend
npm install

Run backend server
cd ../backend
npm run dev

Run frontend server
cd ../frontend
npm start


Project Structure

/
├── backend/              Backend server code
│   ├── config/           Configuration files
│   ├── controllers/      Request handlers
│   ├── models/           Database models
│   ├── routes/           API routes
│   ├── services/         Business logic
│   ├── utils/            Utility functions
│   └── server.js         Entry point
│
├── frontend/             Frontend React application
│   ├── public/           Static files
│   └── src/              React source code
│       ├── components/   Reusable components
│       ├── pages/        Page components
│       ├── redux/        State management
│       ├── services/     API services
│       ├── styles/       CSS styles
│       └── App.js        Main component

API Endpoints

- /api/users - User authentication and profile management
- /api/footprints - Carbon footprint tracking and calculation
- /api/recommendations - AI-powered recommendations and insights

GPT Integration Features

AI-Powered Recommendations
The application uses Puter.js AI to provide intelligent, personalized carbon reduction recommendations based on your actual footprint data. Puter.js provides free access to advanced AI models without requiring an API key.

How it works:
1. Data Analysis: GPT analyzes your recent carbon footprint activities
2. Pattern Recognition: Identifies your highest emission categories and activities
3.  Personalized Suggestions: Generates specific, actionable recommendations
4. Impact Estimation: Provides estimated CO2 savings for each recommendation

Available AI Features:
- Generate Recommendations: POST /api/recommendations/generate
- Get Carbon Insights: GET /api/recommendations/insights
- Track Progress**: Update recommendation status (Not Started, In Progress, Completed)

Example AI Response:
json
{
  "category": "transportation",
  "title": "Switch to Public Transit",
  "description": "Taking the bus instead of driving for your daily commute could reduce your emissions by 30%",
  "potentialImpact": 2.5,
  "difficulty": "medium"
}


Setup Requirements:
- No API key required! Puter.js provides free AI access
- The AI will automatically analyze your last 50 footprint entries
- Recommendations are saved to your account for tracking progress
- Client-side AI processing available for faster recommendations