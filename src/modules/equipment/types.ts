// actions
export const EQUIPMENT_SEARCH = 'EQUIPMENT_SEARCH';
export const EQUIPMENT_TYPE_SEARCH = 'EQUIPMENT_TYPE_SEARCH';
export const EQUIPMENT_FETCH_ALL = 'EQUIPMENT_FETCH_ALL';
export const EQUIPMENT_FETCH_ONE = 'EQUIPMENT_FETCH_ONE';
export const EQUIPMENT_FETCH_MY = 'EQUIPMENT_FETCH_MY';
export const EQUIPMENT_COMMIT = 'EQUIPMENT_COMMIT';
export const EQUIPMENT_TYPE_COMMIT = 'EQUIPMENT_TYPE_COMMIT';

// setters
export const EQUIPMENT_SET_ALL = 'EQUIPMENT_SET_ALL';
export const EQUIPMENT_SET_ONE = 'EQUIPMENT_SET_ONE';

// getters
export const EQUIPMENT_GET_ALL = 'EQUIPMENT_GET_ALL';
export const EQUIPMENT_GET_ONE = 'EQUIPMENT_GET_ONE';

// EquipmentType //
//////////////////

export interface EquipmentType {
  id: string;
  title: string;
  description: string;
}

export class EquipmentTypeDefault implements EquipmentType {
  public id: string = '';
  public title: string = '';
  public description: string = '';
}

// Equipment //
//////////////

export interface Equipment {
  id: string;
  equipmentTypeId?: string;
  equipmentType?: EquipmentType;
  serialNumber: string;
  description?: string;
  ownerId?: string;
}

export class EquipmentDefault implements Equipment {
  public id: string = '';
  public equipmentTypeId: string = '';
  public serialNumber: string = '';
}

// State //
//////////

export interface EquipmentState {
  equipment: Equipment[];
}
