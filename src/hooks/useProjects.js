import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchProjects } from '../api/mockProjects'

export const useProjects = ({ search, tags, sort }) => {
  return useInfiniteQuery({
    queryKey: ['projects', { search, tags, sort }],
    queryFn: ({ pageParam }) => fetchProjects({
      cursor: pageParam,
      search,
      tags,
      sort
    }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
