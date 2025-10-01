# Connectivity

A networking platform for students built with React and Vite.

## Features

- ⚡ Vite for fast development and building
- ⚛️ React 18 with modern hooks
- 🎨 Tailwind CSS for styling
- 📱 Responsive design
- 🚀 Modern development experience
- 🗄️ Supabase integration for backend services
- 🔄 React Query for data fetching and caching

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level views
├── styles/        # Global styles and utilities
├── App.jsx        # Main application component
└── main.jsx       # Application entry point
```

## Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **Supabase** - Backend-as-a-Service for database and authentication
- **React Query** - Data fetching and caching library

## Supabase Integration

This project includes full Supabase integration for backend services with the following features:

### Database Schema
- **Projects Table**: Stores project information with fields for title, description, link, and timestamps
- **Row Level Security**: Configured for secure data access
- **Real-time Updates**: Projects update live across all connected clients

### Features Implemented
- ✅ **Project Management**: Create, read, update, and delete projects
- ✅ **Real-time Feed**: Live updates when projects are added or deleted
- ✅ **Search Functionality**: Filter projects by title and description
- ✅ **Project Details**: View detailed project information with delete functionality
- ✅ **Loading States**: Proper loading indicators and error handling
- ✅ **Responsive Design**: Works on desktop and mobile devices

### Setup Instructions

1. **Database Setup**: Follow the instructions in [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
2. **Environment Variables**: Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
3. **Install and Run**:
   ```bash
   npm install
   npm run dev
   ```

### Testing
See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing instructions.
