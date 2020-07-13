export const EVENT_SALARY_FETCH_ALL = 'EVENT_SALARY_FETCH_ALL';
export const EVENT_SALARY_FETCH_ONE = 'EVENT_SALARY_FETCH_ONE';
export const EVENT_SALARY_COMMIT = 'EVENT_SALARY_COMMIT';
export const EVENT_SALARY_DELETE = 'EVENT_SALARY_DELETE';

// Shift Salary//

export class ShiftSalaryDefault {
    public clientId?: number;
    public shiftId: string = '';
    public count: number | null = null;
    public description: string = '';

    public isNew?: boolean = true;
}

export interface IShiftSalary extends ShiftSalaryDefault {}

// Place Salary//

export class PlaceSalaryDefault {
    public clientId?: number;
    public placeId: string = '';
    public count: number | null = null;
    public description: string = '';
    public isNew?: boolean = true;
}

export interface IPlaceSalary extends PlaceSalaryDefault {}

// Event Salary//

export class EventSalaryDefault {
    public eventId?: string = '';
    public count: number | null = null;
    public shiftSalaries?: IShiftSalary[];
    public placeSalaries?: IPlaceSalary[];
    public description: string = '';
    public isNew?: boolean = true;
}

export interface IEventSalary extends EventSalaryDefault {}

export interface IEventSalaryState {
    eventSalaries: IEventSalary[];
}
