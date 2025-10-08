import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllProjects, getProjectsByOwner, createProject, updateProject, deleteProject, getProjectById } from '../services/projectService'

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useProjectById = (id) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useUserProjects = (userId) => {
  return useQuery({
    queryKey: ['userProjects', userId],
    queryFn: () => getProjectsByOwner(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useAddProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['userProjects'] })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }) => updateProject(id, updates),
    onSuccess: () => {
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['userProjects'] })
      // Also invalidate any specific project queries
      queryClient.invalidateQueries({ queryKey: ['project'] })
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteProject,
    onMutate: async (projectId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['projects'] })
      await queryClient.cancelQueries({ queryKey: ['userProjects'] })
      
      // Snapshot the previous values
      const previousProjects = queryClient.getQueryData(['projects'])
      const previousUserProjects = queryClient.getQueryData(['userProjects'])
      
      // Optimistically update the cache
      queryClient.setQueryData(['projects'], (old) => 
        old ? old.filter(project => project.id !== projectId) : []
      )
      queryClient.setQueryData(['userProjects'], (old) => 
        old ? old.filter(project => project.id !== projectId) : []
      )
      
      // Return a context object with the snapshotted value
      return { previousProjects, previousUserProjects }
    },
    onError: (err, projectId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects)
      }
      if (context?.previousUserProjects) {
        queryClient.setQueryData(['userProjects'], context.previousUserProjects)
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['userProjects'] })
    },
  })
}
