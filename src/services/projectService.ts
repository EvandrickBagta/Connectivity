import { supabase } from '../lib/supabaseClient';

export interface Project {
  id: string;
  title: string;
  description?: string;
  link?: string;
  tags?: string[];
  created_at: string;
}

export interface CreateProjectData {
  title: string;
  description?: string;
  link?: string;
  tags?: string[];
}

/**
 * Fetch all projects from Supabase, ordered by created_at desc
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
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
 * Fetch a single project by ID
 */
export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new Error(`Failed to fetch project: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    throw error;
  }
};
