import { supabase } from '../lib/supabaseClient';
import { getMultipleUserDisplayNames } from '../lib/userLookup';

export interface Project {
  id: string;
  title: string;
  description?: string;
  link?: string; // TODO: Remove after migration to links field
  links?: string[]; // New multiple links field
  tags?: string[];
  openings?: number;
  created_at: string;
  ownerId: string;
  ownerDisplayName: string;
  teamRoster: { [userId: string]: string };
  teamIds: string[];
}

export interface CreateProjectData {
  title: string;
  description?: string;
  link?: string; // TODO: Remove after migration to links field
  links?: string[]; // New multiple links field
  tags?: string[];
  openings?: number;
  ownerId: string;
  ownerDisplayName: string;
  teamRoster: { [userId: string]: string };
  teamIds: string[];
}

/**
 * Fetch all projects from Supabase with current owner display names
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    console.log('🔍 Fetching projects with current display names...');
    
    // First, get all projects
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    if (!projects || projects.length === 0) {
      return [];
    }

    // Get all unique owner IDs
    const ownerIds = [...new Set(projects.map(p => p.ownerId).filter(Boolean))];
    console.log('👥 Found owner IDs:', ownerIds);

    // Fetch current display names for all owners
    const displayNames = await getMultipleUserDisplayNames(ownerIds);
    console.log('📝 Current display names:', Object.fromEntries(displayNames));

    // Transform projects with current display names
    const transformedProjects = projects.map(project => {
      const currentDisplayName = displayNames.get(project.ownerId) || project.ownerDisplayName || 'Unknown User';
      console.log(`🔄 Project "${project.title}" owner: ${project.ownerId} -> ${currentDisplayName}`);
      
      return {
        ...project,
        ownerDisplayName: currentDisplayName
      };
    });

    return transformedProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * Fetch projects for a specific user (owner or team member) with current display names
 */
export const getUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    // First get all projects with current display names
    const allProjects = await getProjects();
    
    // Filter for projects where user is owner or team member
    const userProjects = allProjects.filter(project => 
      project.ownerId === userId || 
      (project.teamIds && project.teamIds.includes(userId))
    );

    return userProjects;
  } catch (error) {
    console.error('Error fetching user projects:', error);
    throw error;
  }
};

/**
 * Add a new project to Supabase
 */
export const addProject = async (projectData: CreateProjectData): Promise<Project> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add project: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

/**
 * Create a new project with owner and team setup
 */
export const createProject = async (projectData: Omit<CreateProjectData, 'ownerId' | 'ownerDisplayName' | 'teamRoster' | 'teamIds'>, ownerId: string, ownerDisplayName: string): Promise<Project> => {
  try {
    const teamRoster = { [ownerId]: "Owner" };
    const teamIds = [ownerId];
    
    const fullProjectData: CreateProjectData = {
      ...projectData,
      ownerId,
      ownerDisplayName,
      teamRoster,
      teamIds
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([fullProjectData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Update a project by ID
 */
export const updateProject = async (id: string, updates: Partial<CreateProjectData>): Promise<Project> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * Delete a project by ID
 */
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

/**
 * Fetch a single project by ID with current owner display name
 */
export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    // Get all projects and find the one with matching ID
    const allProjects = await getProjects();
    const project = allProjects.find(p => p.id === id);
    
    return project || null;
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    throw error;
  }
};
