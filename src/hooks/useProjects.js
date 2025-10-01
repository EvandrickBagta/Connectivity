import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjects, addProject, deleteProject, getProjectById } from '../services/projectService'

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
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

export const useAddProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
