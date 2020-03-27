export const EVENT_SALARY_FETCH_ALL = 'EVENT_SALARY_FETCH_ALL';
export const EVENT_SALARY_FETCH_ONE = 'EVENT_SALARY_FETCH_ONE';
export const EVENT_SALARY_COMMIT = 'EVENT_SALARY_COMMIT';
export const EVENT_SALARY_DELETE = 'EVENT_SALARY_DELETE';

// Shift Salary//

export class ShiftSalaryDefault {
    public shiftId: string = '';
    public count: number | null = null;
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
    public shiftSalaries?: IShiftSalary[] = [];
    public placeSalaries?: IPlaceSalary[] = [];
    public count: number = 0;
    public description: string = '';
}

export interface IEventSalary extends EventSalaryDefault {}

export interface IEventSalaryState {
    eventSalaries: IEventSalary[];
}
