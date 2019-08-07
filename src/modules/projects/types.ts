// actions
export const PROJECTS_FETCH_ALL = 'PROJECTS_FETCH_ALL';
export const PROJECT_DELETE = 'PROJECT_DELETE';

// setters
export const PROJECTS_SET_ALL = 'PROJECTS_SET_ALL';
export const PROJECT_REMOVE_ONE = 'PROJECT_REMOVE_ONE';

// getters
export const PROJECTS_GET_ALL = 'PROJECTS_GET_ALL';

// Project //
//////////////
export class ProjectDefault {
    public id: string = '';
    public name: string = '';
    public projectTags?: [];
}

export interface IProject extends ProjectDefault { }

// State //
//////////

export interface IProjectState {
    projects: IProject[];
}
