# Testing Guide

## Prerequisites

1. **Set up Supabase Database**
   - Create a new Supabase project
   - Run the SQL commands from `DATABASE_SCHEMA.md` to create the projects table
   - Set up Row Level Security policies

2. **Environment Variables**
   - Create a `.env` file in the project root
   - Add your Supabase URL and anon key:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Testing Steps

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test Basic Functionality

#### A. View Projects Feed
- Navigate to the Explore page
- Verify that projects are loaded from Supabase (or empty state if no projects exist)
- Check that loading states work properly
- Test the search functionality

#### B. Add a New Project
- Click the "Add Project" button in the header
- Fill out the form with:
  - Title: "Test Project"
  - Description: "This is a test project description"
  - Link: "https://example.com"
- Submit the form
- Verify the project appears in the feed immediately
- Check that the modal closes after successful submission

#### C. View Project Details
- Click on any project in the feed
- Verify the project details are displayed correctly
- Check that the project link (if provided) is clickable
- Test the loading state when switching between projects

#### D. Delete a Project
- Click on a project to view its details
- Click the "Delete" button
- Confirm the deletion in the confirmation dialog
- Verify the project is removed from the feed
- Check that you're navigated back to the feed after deletion

### 3. Test Error Handling

#### A. Network Errors
- Disconnect from the internet
- Try to add a new project
- Verify error messages are displayed appropriately

#### B. Invalid Data
- Try to add a project with an empty title
- Verify validation works correctly

### 4. Test Loading States

#### A. Initial Load
- Refresh the page
- Verify skeleton loading states are shown
- Check that the feed populates once data is loaded

#### B. Project Details Loading
- Click on a project
- Verify loading spinner is shown
- Check that details appear once loaded

### 5. Test Real-time Updates

#### A. Add Project in Another Tab
- Open the app in two browser tabs
- Add a project in one tab
- Verify it appears in the other tab (due to React Query cache invalidation)

#### B. Delete Project in Another Tab
- Delete a project in one tab
- Verify it's removed from the other tab

## Expected Behavior

### ✅ Success Criteria
- [ ] Projects load from Supabase database
- [ ] Add project functionality works
- [ ] Project details display correctly
- [ ] Delete functionality works
- [ ] Search functionality works
- [ ] Loading states are shown appropriately
- [ ] Error states are handled gracefully
- [ ] Real-time updates work between tabs
- [ ] Mobile responsive design works

### 🐛 Common Issues

1. **"Missing Supabase environment variables" error**
   - Check that your `.env` file exists and has the correct variables
   - Restart the development server after adding environment variables

2. **"Failed to fetch projects" error**
   - Verify your Supabase URL and key are correct
   - Check that the projects table exists in your database
   - Ensure RLS policies allow read access

3. **Projects not updating after add/delete**
   - Check that React Query cache invalidation is working
   - Verify that mutations are calling `invalidateQueries`

4. **Database connection issues**
   - Check your Supabase project is active
   - Verify your database is not paused
   - Check your internet connection

## Database Verification

You can verify the database integration by checking your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the "Table Editor"
3. Check the "projects" table
4. Verify that projects are being created, updated, and deleted correctly

## Performance Testing

- Test with multiple projects (10+)
- Test search with various queries
- Verify pagination works if implemented
- Check that the app remains responsive during operations
