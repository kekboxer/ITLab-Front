export const EVENT_SALARY_FETCH_ALL = 'EVENT_SALARY_FETCH_ALL';
export const EVENT_SALARY_FETCH_ONE = 'EVENT_SALARY_FETCH_ONE';
export const EVENT_SALARY_COMMIT = 'EVENT_SALARY_COMMIT';
export const EVENT_SALARY_COMMIT_NEW = 'EVENT_SALARY_COMMIT_NEW';
export const EVENT_SALARY_DELETE = 'EVENT_SALARY_DELETE';
export const EVENT_SHIFT_SALARY_COMMIT = 'EVENT_SHIFT_SALARY_COMMIT';
export const EVENT_SHIFT_SALARY_DELETE = 'EVENT_SHIFT_SALARY_DELETE';
export const EVENT_PLACE_SALARY_COMMIT = 'EVENT_PLACE_SALARY_COMMIT';
export const EVENT_PLACE_SALARY_DELETE = 'EVENT_PLACE_SALARY_DELETE';

// Shift Salary//

export class ShiftSalaryDefault {
    public shiftId: string = '';
    public count: number = 0;
    public description: string = '';
}

export interface IShiftSalary extends ShiftSalaryDefault {}

// Place Salary//

export class PlaceSalaryDefault {
    public placeId: string = '';
    public count: number = 0;
    public description: string = '';
}

export interface IPlaceSalary extends PlaceSalaryDefault {}

// Event Salary//

export class EventSalaryDefault {
    public eventId?: string = '';
    public created?: string = '';
    public shiftSalaries?: IShiftSalary[] = [];
    public placeSalaries?: IPlaceSalary[] = [];
    public authorId?: string = '';
    public modificationDate?: string = '';
    public count: number = 0;
    public description: string = '';
}

export interface IEventSalary extends EventSalaryDefault {}

export interface IEventSalaryState {
    eventSalaries: IEventSalary[];
}
