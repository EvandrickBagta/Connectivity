import { supabase } from '../lib/supabaseClient';

export interface Project {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  tags?: string[];
  ownerId: string;
  teamRoster: Record<string, any>;
  teamIds: string[];
  ownerDisplayName: string;
  openings: number;
  links: Record<string, any>[];
}

export interface CreateProjectData {
  title: string;
  description?: string;
  tags?: string[];
  ownerId: string;
  teamRoster?: Record<string, any>;
  teamIds?: string[];
  openings?: number;
  links?: Record<string, any>[];
}

/**
 * Get a single project with current owner display name
 */
export const getProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    console.log('Fetching project by ID:', projectId);
    
    const { data, error } = await supabase
      .rpc('get_project_with_owner', { project_id: projectId });

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Failed to fetch project: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('No project found with ID:', projectId);
      return null;
    }

    console.log('Project fetched successfully:', data[0]);
    return data[0];
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    throw error;
  }
};

/**
 * Get all projects with current owner display names
 */
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    console.log('Fetching all projects');
    
    const { data, error } = await supabase
      .rpc('get_all_projects_with_owners');

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    console.log('Projects fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching all projects:', error);
    throw error;
  }
};

/**
 * Get projects by owner with current display name
 */
export const getProjectsByOwner = async (ownerId: string): Promise<Project[]> => {
  try {
    console.log('Fetching projects by owner:', ownerId);
    
    const { data, error } = await supabase
      .rpc('get_projects_by_owner', { owner_id: ownerId });

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Failed to fetch projects by owner: ${error.message}`);
    }

    console.log('Projects by owner fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching projects by owner:', error);
    throw error;
  }
};

/**
 * Create a new project (without storing ownerDisplayName)
 */
export const createProject = async (params: any): Promise<Project> => {
  try {
    console.log('Creating project with params:', params);
    
    // Handle different parameter structures
    let projectData: CreateProjectData;
    if (params.projectData && params.ownerId) {
      // Frontend is passing { projectData: {...}, ownerId: ... }
      projectData = {
        ...params.projectData,
        ownerId: params.ownerId
      };
    } else {
      // Direct project data
      projectData = params;
    }
    
    console.log('Processed project data:', projectData);
    
    const { data, error } = await supabase
      .rpc('create_project', {
        project_data: {
          project_title: projectData.title,
          owner_id: projectData.ownerId,
          project_description: projectData.description,
          project_tags: projectData.tags,
          project_team_roster: projectData.teamRoster || {},
          project_team_ids: projectData.teamIds || [],
          project_openings: projectData.openings || 0,
          project_links: projectData.links || []
        }
      });

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Failed to create project: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('Project creation failed - no data returned');
    }

    console.log('Project created successfully:', data[0]);
    return data[0];
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Update project (direct database operation)
 */
export const updateProject = async (projectId: string, updates: Partial<CreateProjectData>): Promise<Project> => {
  try {
    console.log('Updating project:', { projectId, updates });
    
    const { data, error } = await supabase
      .from('projects')
      .update({
        title: updates.title,
        description: updates.description,
        tags: updates.tags,
        "teamRoster": updates.teamRoster,
        "teamIds": updates.teamIds,
        openings: updates.openings,
        links: updates.links,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      throw new Error(`Failed to update project: ${error.message}`);
    }

    if (!data) {
      throw new Error('Project not found or update failed');
    }

    // Get the updated project with current owner display name
    const updatedProject = await getProjectById(projectId);
    if (!updatedProject) {
      throw new Error('Failed to fetch updated project');
    }

    console.log('Project updated successfully:', updatedProject);
    return updatedProject;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * Delete project
 */
export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    console.log('Deleting project:', projectId);
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete project: ${error.message}`);
    }

    console.log('Project deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};