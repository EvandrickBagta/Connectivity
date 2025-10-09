import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'recentlyViewedActivities'
const MAX_RECENT = 10

export const useRecentlyViewed = () => {
  const [recentActivities, setRecentActivities] = useState([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setRecentActivities(parsed)
        console.log('📚 Loaded recent activities from localStorage:', parsed.length)
      }
    } catch (error) {
      console.error('Error loading recent activities:', error)
    }
  }, [])

  // Add activity to recent list
  const addToRecent = useCallback((activity) => {
    try {
      setRecentActivities(prev => {
        // Remove if already exists (to move to front)
        const filtered = prev.filter(item => item.id !== activity.id)
        
        // Create new entry
        const newEntry = {
          id: activity.id,
          title: activity.title,
          tags: activity.tags || [],
          viewedAt: Date.now(),
          ownerId: activity.ownerId,
          ownerDisplayName: activity.ownerDisplayName || 'Unknown'
        }
        
        // Add to front, keep max 10
        const updated = [newEntry, ...filtered].slice(0, MAX_RECENT)
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        console.log('📚 Added to recent:', activity.title)
        
        return updated
      })
    } catch (error) {
      console.error('Error adding to recent activities:', error)
    }
  }, [])

  // Clear all recent activities
  const clearRecent = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setRecentActivities([])
      console.log('📚 Cleared recent activities')
    } catch (error) {
      console.error('Error clearing recent activities:', error)
    }
  }, [])

  return {
    recentActivities,
    addToRecent,
    clearRecent
  }
}

