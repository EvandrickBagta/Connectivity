import { useState, useEffect } from 'react'

const STORAGE_KEY = 'savedActivities'

export const useSavedActivities = () => {
  const [savedActivities, setSavedActivities] = useState([])

  // Load saved activities from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSavedActivities(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load saved activities:', error)
    }
  }, [])

  // Save to localStorage whenever savedActivities changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedActivities))
    } catch (error) {
      console.error('Failed to save activities:', error)
    }
  }, [savedActivities])

  const addToSaved = (activity) => {
    setSavedActivities(prev => {
      // Check if already saved
      if (prev.some(item => item.id === activity.id)) {
        return prev
      }
      
      // Add with timestamp
      const savedActivity = {
        ...activity,
        savedAt: Date.now()
      }
      
      return [savedActivity, ...prev]
    })
  }

  const removeFromSaved = (activityId) => {
    setSavedActivities(prev => prev.filter(item => item.id !== activityId))
  }

  const clearSaved = () => {
    setSavedActivities([])
  }

  const isSaved = (activityId) => {
    return savedActivities.some(item => item.id === activityId)
  }

  return {
    savedActivities,
    addToSaved,
    removeFromSaved,
    clearSaved,
    isSaved
  }
}
