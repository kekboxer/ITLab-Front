export type SystemPrivelegeName =
  | ''
  | 'CanEditEquipment'
  | 'CanEditEquipmentOwner'
  | 'CanEditEquipmentType'
  | 'CanEditRoles'
  | 'CanEditEvent'
  | 'CanEditEventType'
  | 'CanInviteToSystem'
  | 'CanDeleteEventRole';

export interface ISystemPrivelegeData {
  id: string;
  name: SystemPrivelegeName;
}

export class SystemPrivelege implements ISystemPrivelegeData {
  public id: string = '';
  public name: SystemPrivelegeName = '';

  constructor(data?: ISystemPrivelegeData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.name = data.name;
  }
}
