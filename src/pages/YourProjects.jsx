import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useUserProjects, useDeleteProject, useUpdateProject } from '../hooks/useProjects'
import PostCard from '../components/PostCard'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import ActivityEditor from '../components/ActivityEditor'
import AddProjectModal from '../components/AddProjectModal'

// Main YourProjects component
const YourProjects = ({ onNavigateToActivity, origin = 'your-activities' }) => {
  const { user } = useUser()
  const [search, setSearch] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  
  const {
    data: projects,
    isLoading,
    error
  } = useUserProjects(user?.id)

  const deleteProjectMutation = useDeleteProject()
  const updateProjectMutation = useUpdateProject()

  // Handle delete button click
  const handleDeleteClick = (project) => {
    setProjectToDelete(project)
    setShowDeleteModal(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return

    try {
      await deleteProjectMutation.mutateAsync(projectToDelete.id)
      setShowDeleteModal(false)
      setProjectToDelete(null)
    } catch (error) {
      console.error('Failed to delete project:', error)
      // You could add a toast notification here
    }
  }

  // Handle delete modal close
  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setProjectToDelete(null)
  }

  // Handle edit button click
  const handleEditClick = (project) => {
    setProjectToEdit(project)
    setShowEditModal(true)
  }

  // Handle edit save
  const handleEditSave = async (updatedData) => {
    if (!projectToEdit) return

    try {
      await updateProjectMutation.mutateAsync({
        id: projectToEdit.id,
        updates: updatedData
      })
      setShowEditModal(false)
      setProjectToEdit(null)
    } catch (error) {
      console.error('Failed to update project:', error)
      // You could add a toast notification here
    }
  }

  // Handle edit modal close
  const handleEditCancel = () => {
    setShowEditModal(false)
    setProjectToEdit(null)
  }

  // Filter projects based on search
  const filteredProjects = projects?.filter(project => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      project.title.toLowerCase().includes(searchLower) ||
      (project.description && project.description.toLowerCase().includes(searchLower))
    )
  }) || []

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <section className="py-20 bg-gradient-to-br from-green-600 via-teal-600 to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Your Activities
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Please sign in to view your activities
            </p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-teal-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Your Activities
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Manage and showcase your student activities
            </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar and Add Button */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search your activities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Add Activity Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Activity</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your activities...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-600">Failed to load your activities. Please try again.</p>
            </div>
          )}

          {/* Projects List */}
          {!isLoading && !error && (
            <>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.491M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                  <p className="text-gray-600">
                    {search ? 'No activities match your search.' : "You haven't created or joined any activities yet."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProjects.map(project => (
                    <PostCard
                      key={project.id}
                      project={project}
                      currentUserId={user?.id}
                      onDelete={handleDeleteClick}
                      onEdit={handleEditClick}
                      onNavigateToActivity={onNavigateToActivity}
                      origin={origin}
                      showEditButton={true}
                      showViewButton={true}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        project={projectToDelete}
        isDeleting={deleteProjectMutation.isPending}
      />

      {/* Activity Editor Modal */}
      <ActivityEditor
        isOpen={showEditModal}
        onClose={handleEditCancel}
        project={projectToEdit}
        onSave={handleEditSave}
        isSaving={updateProjectMutation.isPending}
      />

      {/* Add Activity Modal */}
      <AddProjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Support & Community</h4>
            <div className="flex justify-center space-x-4">
              <a href="#" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Discord</a>
              <a href="#" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">GitHub</a>
              <a href="#" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Developer Contacts</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default YourProjects
