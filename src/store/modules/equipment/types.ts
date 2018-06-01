
export interface EquipmentType {
  id: string,
  title: string
}

export interface Equipment {
  id: string,
  equipmentTypeId: string,
  equipmentType?: EquipmentType,
  serialNumber: string,
  description: string
}

export const createDefaultEquipment = (): Equipment => {
  return {
    id: "",
    equipmentTypeId: "",
    serialNumber: "",
    description: ""
  }
}

export interface EquipmentState {
  equipment: Equipment[]
}