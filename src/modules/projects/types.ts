// actions
export const PROJECTS_FETCH_ALL = 'PROJECTS_FETCH_ALL';
export const PROJECT_DELETE = 'PROJECT_DELETE';
export const PROJECT_FETCH_ONE = 'PROJECT_FETCH_ONE';
export const PROJECT_COMMIT = 'PROJECT_COMMIT';
export const PROJECT_TAGS_FETCH = 'PROJECT_TAGS_FETCH';
export const TAGS_FETCH = 'TAGS_FETCH';

// setters
export const PROJECTS_SET_ALL = 'PROJECTS_SET_ALL';
export const PROJECT_REMOVE_ONE = 'PROJECT_REMOVE_ONE';
export const PROJECT_SET_ONE = 'PROJECT_SET_ONE';

// getters
export const PROJECTS_GET_ALL = 'PROJECTS_GET_ALL';

// Project //
//////////////

export class TagDefalult {
    public id: string = '';
    public value: string = '';
    public color: string = '#ffffff';
    public useCount: number = 0;
}

export interface ITag extends TagDefalult {}

export class ProjectDefault {
    public id: string = '';
    public name: string = '';
    public tags?: ITag[] = [];
    public shortDescription?: string = '';
    public description?: string = '';
}

export interface IProject extends ProjectDefault { }

// State //
//////////

export interface IProjectState {
    projects: IProject[];
    tags: ITag[];
}
