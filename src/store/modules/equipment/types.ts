
// EquipmentType //
//////////////////

export interface EquipmentType {
  id: string
  title: string
  description: string
}

export class EquipmentTypeDefault implements EquipmentType {
  id: string = ""
  title: string = ""
  description: string = ""
}

// Equipment //
//////////////

export interface Equipment {
  id: string
  equipmentTypeId: string
  equipmentType?: EquipmentType
  serialNumber: string
  description?: string
}

export class EquipmentDefault implements Equipment {
  id: string = ""
  equipmentTypeId: string = ""
  serialNumber: string = ""
}

// State //
//////////

export interface EquipmentState {
  equipment: Equipment[]
}